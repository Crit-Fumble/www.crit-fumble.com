import { NextResponse } from 'next/server';
import axios from 'axios';
import { prisma } from '@crit-fumble/core';
import { getDiscordConfig } from '@crit-fumble/core/models/config';

// Get Discord configuration
const discordConfig = getDiscordConfig();

function isDiscordAdmin(discordId: string): boolean {
  if (!discordId) return false;
  
  const isAdmin = discordConfig.adminIds?.includes(discordId) ?? false;
  
  return isAdmin;
}

function logAdminCheck(discordId: string, isAdmin: boolean): void {
  console.log(`🔍 Admin Check: Discord ID ${discordId}`);
  console.log(`📋 Admin IDs in config: [${discordConfig.adminIds?.join(', ') || ''}]`);
  console.log(`✅ Is Admin: ${isAdmin}`);
}

// Initialize Prisma client

/**
 * Discord OAuth2 Bot Installation Callback
 * Handles both bot installation and user authentication tokens
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  let state = url.searchParams.get('state') || '/dashboard';

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  // Ensure state is an absolute URL
  if (!state.startsWith('http')) {
    state = `${process.env.NEXT_PUBLIC_BASE_URL}${state}`;
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: discordConfig.clientId,
      client_secret: discordConfig.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: discordConfig.redirectUri || `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth2/callback`,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;

    console.log('🤖 OAuth2 Flow - Granted scopes:', scope);

    // If we have bot scope, the bot has been installed to a guild
    const hasBot = scope.includes('bot');
    if (hasBot) {
      console.log('✅ Bot successfully installed to Discord server with OAuth2 flow');
    }

    // Get user profile using the access token
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;

    // Try to fetch user roles from the Discord server using bot token (more reliable than user token)
    let roles: string[] = [];
    if (discordConfig.serverId && discordConfig.botToken) {
      try {
        const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${discordConfig.serverId}/members/${user.id}`, {
          headers: {
            'Authorization': `Bot ${discordConfig.botToken}`,
          },
        });

        if (memberResponse.ok) {
          const guildMember = await memberResponse.json();
          roles = guildMember.roles || [];
          console.log('Successfully fetched user roles via bot token:', roles.length);
        } else {
          console.warn('Failed to fetch Discord roles via bot token:', memberResponse.status, memberResponse.statusText);
        }
      } catch (roleError) {
        console.warn('Error fetching Discord roles:', roleError);
      }
    }

    // Check if user is a Discord admin
    const userIsAdmin = isDiscordAdmin(user.id);
    logAdminCheck(user.id, userIsAdmin);

    // Create or update user in database
    let dbUser;
    try {
      // First try to find existing user by discord_id
      const existingUser = await prisma.user.findFirst({
        where: { discord_id: user.id }
      });

      const userData = {
        name: user.global_name || user.username,
        email: user.email,
        image: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
        admin: userIsAdmin,
        data: {
          discord: {
            username: user.username,
            discriminator: user.discriminator,
            global_name: user.global_name,
            verified: user.verified,
            oauth2_scopes: scope, // Store the granted scopes
            bot_installed: hasBot,
          }
        },
        updatedAt: new Date(),
      };

      if (existingUser) {
        // Update existing user using their unique ID
        dbUser = await prisma.user.update({
          where: { id: existingUser.id as string },
          data: userData
        });
      } else {
        // Create new user
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            discord_id: user.id,
            ...userData
          }
        });
      }
      
      console.log(`✅ OAuth2: User ${user.username} (${user.id}) ${dbUser.admin ? 'with admin privileges' : ''} ${hasBot ? 'and bot installed' : ''}`);
    } catch (dbError) {
      console.error('Error creating/updating user in database:', dbError);
    }

    // Create session cookie with user data including OAuth2 info
    const sessionData = {
      id: user.id,
      userId: user.id,
      username: user.username,
      name: user.global_name || user.username,
      email: user.email,
      avatar: user.avatar,
      admin: dbUser?.admin ?? userIsAdmin,
      roles,
      oauth2: {
        scopes: scope,
        botInstalled: hasBot,
        expiresAt: Date.now() + (expires_in * 1000)
      }
    };

    const response = NextResponse.redirect(state);
    response.cookies.set('fumble-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error in OAuth2 callback:', error);
    return NextResponse.json({ error: 'Failed to process OAuth2 callback' }, { status: 500 });
  }
}

// Remove edge runtime - using Prisma requires Node.js runtime