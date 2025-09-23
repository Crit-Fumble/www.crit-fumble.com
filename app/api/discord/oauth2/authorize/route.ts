import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';

  const params = new URLSearchParams({
    client_id: process.env.AUTH_DISCORD_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth2/callback`,
    response_type: 'code',
    scope: 'identify email guilds',
    state: redirectTo,
  });

  const authorizationUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

  return NextResponse.redirect(authorizationUrl);
}

export const config = {
  runtime: 'edge',
};