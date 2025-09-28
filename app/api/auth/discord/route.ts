import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@crit-fumble/core';
import { isDiscordAdmin, logAdminCheck } from '../../../lib/admin-utils';

// Simple Discord OAuth implementation without heavy dependencies
// Initialize Prisma client
const prisma = new PrismaClient();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Get the base URL from the request
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  if (!code) {
    // Build Discord OAuth URL manually
    const params = new URLSearchParams({
      client_id: process.env.AUTH_DISCORD_ID || '',
      redirect_uri: `${baseUrl}/api/auth/discord`,
      response_type: 'code',
      scope: 'identify email',
    });
    
    const authUrl = `https://discord.com/oauth2/authorize?${params}`;
    return NextResponse.redirect(authUrl);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_DISCORD_ID || '',
        client_secret: process.env.AUTH_DISCORD_SECRET || '',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${baseUrl}/api/auth/discord`,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info from Discord using the user's access token
    // This correctly returns the authenticated user's profile, not our app's info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    // Fetch user roles from Discord server if DISCORD_SERVER_ID is configured
    let roles: string[] = [];
    if (process.env.DISCORD_SERVER_ID && process.env.DISCORD_WEB_BOT_TOKEN) {
      try {
        const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${userData.id}`, {
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
          },
        });

        if (memberResponse.ok) {
          const guildMember = await memberResponse.json();
          roles = guildMember.roles || [];
        }
      } catch (roleError) {
        console.warn('Failed to fetch Discord roles:', roleError);
        // Continue without roles - not critical for basic auth
      }
    }

    // Check if user is a Discord admin
    const userIsAdmin = isDiscordAdmin(userData.id);
    logAdminCheck(userData.id, userIsAdmin);

    // Create or update user in database
    let dbUser;
    try {
      // First try to find existing user by discord_id
      const existingUser = await prisma.user.findFirst({
        where: { discord_id: userData.id }
      });

      if (existingUser) {
        // Update existing user
        dbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: userData.global_name || userData.username,
            email: userData.email,
            image: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
            admin: userIsAdmin, // Update admin status on each login
            data: {
              discord: {
                username: userData.username,
                discriminator: userData.discriminator,
                global_name: userData.global_name,
                verified: userData.verified,
              }
            },
            updatedAt: new Date(),
          }
        });
      } else {
        // Create new user
        dbUser = await prisma.user.create({
          data: {
            id: userData.id, // Use Discord ID as primary key
            discord_id: userData.id,
            name: userData.global_name || userData.username,
            email: userData.email,
            image: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
            admin: userIsAdmin,
            data: {
              discord: {
                username: userData.username,
                discriminator: userData.discriminator,
                global_name: userData.global_name,
                verified: userData.verified,
              }
            }
          }
        });
      }
      
      console.log(`✅ User ${userData.username} (${userData.id}) ${dbUser.admin ? 'with admin privileges' : ''} logged in`);
    } catch (dbError) {
      console.error('Error creating/updating user in database:', dbError);
      // Continue with session creation even if DB update fails
    }
    
    // Set session cookie with complete user data
    const sessionData = {
      id: userData.id,
      userId: userData.id,
      username: userData.username,
      name: userData.global_name || userData.username,
      email: userData.email,
      avatar: userData.avatar,
      admin: dbUser?.admin ?? userIsAdmin, // Use database admin status if available, fallback to Discord check
      roles,
    };
    
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    
    response.cookies.set('fumble-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Discord OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}