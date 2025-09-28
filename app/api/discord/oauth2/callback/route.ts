import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  let state = url.searchParams.get('state') || '/';

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  // Ensure state is an absolute URL
  if (!state.startsWith('http')) {
    state = `${process.env.NEXT_PUBLIC_BASE_URL}${state}`;
  }

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.AUTH_DISCORD_ID!,
      client_secret: process.env.AUTH_DISCORD_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth2/callback`,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch user roles from the Discord server
    const guildResponse = await axios.get(`https://discord.com/api/v10/users/@me/guilds/${process.env.DISCORD_SERVER_ID}/member`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (guildResponse.status !== 200) {
      return NextResponse.json({ error: 'Failed to fetch user roles' }, { status: guildResponse.status });
    }

    const guildMember = guildResponse.data;
    const roles = guildMember.roles || [];

    console.log('User roles:', roles);

    // Redirect to the original page stored in the `state` parameter
    return NextResponse.redirect(state);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
  }
}

export const runtime = 'edge';