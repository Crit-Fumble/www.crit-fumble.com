import { NextResponse } from 'next/server';

/**
 * Discord OAuth2 Bot Installation Flow
 * This endpoint handles bot installation with multiple scopes as per Discord documentation:
 * "If your application requires multiple scopes then you may need the full OAuth2 flow 
 * to ensure a bot doesn't join before your application is granted a token."
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  const installBot = url.searchParams.get('bot') === 'true';

  const baseParams = {
    client_id: process.env.AUTH_DISCORD_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/oauth2/callback`,
    response_type: 'code',
    state: redirectTo,
  };

  let scope: string;
  let permissions: string | undefined;

  if (installBot) {
    // Bot installation flow with bot scope + user scopes
    scope = 'bot identify email';
    permissions = '2147764288'; // Read Messages, Send Messages, Use Slash Commands, Manage Roles, View Channels
  } else {
    // User authentication only
    scope = 'identify email';
  }

  const params = new URLSearchParams({
    ...baseParams,
    scope,
    ...(permissions && { permissions })
  });

  const authorizationUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

  return NextResponse.redirect(authorizationUrl);
}

export const runtime = 'edge';