import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord OAuth2 initiation endpoint
 * Redirects users to Discord for authentication
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const params = new URLSearchParams({
      client_id: process.env.AUTH_DISCORD_ID!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth/callback`,
      response_type: 'code',
      scope: 'identify email guilds',
      state: encodeURIComponent(redirectTo), // Store redirect destination
    });

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

    return NextResponse.redirect(discordAuthUrl);

  } catch (error) {
    console.error('Discord OAuth initiation error:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}