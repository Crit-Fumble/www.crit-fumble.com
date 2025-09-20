import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord OAuth2 callback endpoint
 * Handles OAuth2 flow for Discord authentication
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Discord OAuth error:', error);
      return NextResponse.redirect('/auth/error?error=discord_oauth_failed');
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
      return NextResponse.redirect('/auth/error?error=token_exchange_failed');
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
      return NextResponse.redirect('/auth/error?error=user_info_failed');
    }

    const user = await userResponse.json();

    // TODO: Store user in database, create session, etc.
    console.log('Discord user authenticated:', user.username);

    // Redirect to success page or dashboard
    return NextResponse.redirect('/dashboard?auth=success');

  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return NextResponse.redirect('/auth/error?error=internal_error');
  }
}