/**
 * World Anvil Worlds API Route
 *
 * GET /api/worldanvil/worlds - List user's worlds
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/worlds - List user's worlds
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);

    // Get user's World Anvil token from database
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        worldanvil_token: true,
        worldanvil_id: true,
      },
    });

    if (!user?.worldanvil_token) {
      return NextResponse.json({
        error: 'World Anvil account not linked',
        message: 'Please link your World Anvil account in the Linked Accounts page'
      }, { status: 400 });
    }

    // Create World Anvil API client with user's token
    const waConfig = getWorldAnvilConfig();
    const client = new WorldAnvilApiClient({
      apiKey: waConfig.apiKey,
      accessToken: user.worldanvil_token,
    });

    // Fetch user's worlds from World Anvil
    const worlds = await client.get('/user/worlds', { params: { granularity: 1 } });

    return NextResponse.json({
      success: true,
      worlds: worlds || [],
    });
  } catch (error: any) {
    console.error('Error fetching worlds:', error);

    // Handle World Anvil API errors
    if (error.response?.status === 401) {
      return NextResponse.json({
        error: 'World Anvil authentication failed',
        message: 'Your World Anvil token may have expired. Please reconnect your account.'
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Failed to fetch worlds',
      details: error.message
    }, { status: 500 });
  }
}