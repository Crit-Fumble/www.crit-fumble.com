import { NextRequest, NextResponse } from 'next/server';

// This route uses dynamic features
export const dynamic = 'force-dynamic';

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

    const tokens = await tokenResponse.json();

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info');
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url;
      const errorUrl = new URL('/auth/error?error=user_info_failed', baseUrl);
      return NextResponse.redirect(errorUrl);
    }

    const user = await userResponse.json();

    // Create session cookie with user data
    const sessionData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
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