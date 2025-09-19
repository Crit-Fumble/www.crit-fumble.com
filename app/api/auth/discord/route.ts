import { NextRequest, NextResponse } from 'next/server';

// Simple Discord OAuth implementation without heavy dependencies
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
    
    // Set session cookie
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    
    response.cookies.set('fumble-session', JSON.stringify({
      userId: userData.id,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
    }), {
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