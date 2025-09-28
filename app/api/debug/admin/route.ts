import { NextRequest, NextResponse } from 'next/server';
import { getDiscordAdminIds, isDiscordAdmin } from '../../../lib/admin-utils';

// This route uses dynamic features
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check admin status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const discordId = searchParams.get('discordId');
  
  if (!discordId) {
    return NextResponse.json({
      error: 'discordId parameter required',
      usage: '/api/debug/admin?discordId=YOUR_DISCORD_ID'
    }, { status: 400 });
  }

  const adminIds = getDiscordAdminIds();
  const isAdmin = isDiscordAdmin(discordId);

  return NextResponse.json({
    discordId,
    isAdmin,
    adminIds,
    envVariable: process.env.DISCORD_ADMIN_IDS,
    message: isAdmin ? '🛡️ This user is an admin' : '👤 This user is not an admin'
  });
}