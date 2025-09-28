import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@crit-fumble/core';
import { isDiscordAdmin, logAdminCheck } from '../../../../lib/admin-utils';

// This route uses dynamic features
export const dynamic = 'force-dynamic';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Handle Discord OAuth2 callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Discord OAuth error:', error);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
      const errorUrl = new URL('/auth/error?error=discord_oauth_failed', baseUrl);
      return NextResponse.redirect(errorUrl);
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_DISCORD_ID!,
        client_secret: process.env.AUTH_DISCORD_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Failed to exchange code for token:', error);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
      const errorUrl = new URL('/auth/error?error=token_exchange_failed', baseUrl);
      return NextResponse.redirect(errorUrl);
    }

    const accessToken = (await tokenResponse.json()).access_token;

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info');
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
      const errorUrl = new URL('/auth/error?error=user_info_failed', baseUrl);
      return NextResponse.redirect(errorUrl);
    }

    const user = await userResponse.json();

    // Try to fetch user roles from the Discord server using bot token (more reliable)
    let roles: string[] = [];
    if (process.env.DISCORD_SERVER_ID && process.env.DISCORD_WEB_BOT_TOKEN) {
      try {
        // Use bot token to fetch user's guild member info
        const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${user.id}`, {
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
          },
        });

        if (memberResponse.ok) {
          const guildMember = await memberResponse.json();
          roles = guildMember.roles || [];
          console.log('Successfully fetched user roles via bot token:', roles.length);
        } else {
          console.warn('Failed to fetch Discord roles via bot token:', memberResponse.status, memberResponse.statusText);
          // User might not be in the server or bot doesn't have permissions
        }
      } catch (roleError) {
        console.warn('Error fetching Discord roles:', roleError);
        // Continue without roles - not critical for authentication
      }
    } else {
      console.warn('Discord server ID or bot token not configured');
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

      if (existingUser) {
        // Update existing user
        dbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: user.global_name || user.username,
            email: user.email,
            image: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
            admin: userIsAdmin, // Update admin status on each login
            data: {
              discord: {
                username: user.username,
                discriminator: user.discriminator,
                global_name: user.global_name,
                verified: user.verified,
              }
            },
            updatedAt: new Date(),
          }
        });
      } else {
        // Create new user
        dbUser = await prisma.user.create({
          data: {
            id: user.id, // Use Discord ID as primary key
            discord_id: user.id,
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
              }
            }
          }
        });
      }
      
      console.log(`✅ User ${user.username} (${user.id}) ${dbUser.admin ? 'with admin privileges' : ''} logged in`);
    } catch (dbError) {
      console.error('Error creating/updating user in database:', dbError);
      // Continue with session creation even if DB update fails
    }

    // Create session cookie with user data
    const sessionData = {
      id: user.id,
      userId: user.id,
      username: user.username,
      name: user.global_name || user.username,
      email: user.email,
      avatar: user.avatar,
      admin: dbUser?.admin ?? userIsAdmin, // Use database admin status if available, fallback to Discord check
      roles,
    };

    console.log('Discord user authenticated:', user.username);

    // Redirect to dashboard with session cookie
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
    const dashboardUrl = new URL('/dashboard?auth=success', baseUrl);
    const response = NextResponse.redirect(dashboardUrl);
    
    response.cookies.set('fumble-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
    const errorUrl = new URL('/?error=auth_failed', baseUrl);
    return NextResponse.redirect(errorUrl);
  }
}