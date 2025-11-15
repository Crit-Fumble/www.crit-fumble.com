/**
 * World Anvil Block Folders API Route
 *
 * GET /api/worldanvil/blockfolders?worldId=xxx - List block folders in a world
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/blockfolders?worldId=xxx - List block folders in a world
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);

    // Get query parameters
    const url = new URL(request.url);
    const worldId = url.searchParams.get('worldId');

    if (!worldId) {
      return NextResponse.json({
        error: 'World ID is required',
        message: 'Please provide a worldId query parameter'
      }, { status: 400 });
    }

    // Get user's World Anvil token from database
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        worldanvil_token: true,
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

    // Fetch block folders from the specified world
    const folders = await client.get('/world/blockfolders', {
      params: {
        id: worldId,
        granularity: 1
      }
    });

    return NextResponse.json({
      success: true,
      folders: folders || [],
    });
  } catch (error: any) {
    console.error('Error fetching block folders:', error);

    // Handle World Anvil API errors
    if (error.response?.status === 401) {
      return NextResponse.json({
        error: 'World Anvil authentication failed',
        message: 'Your World Anvil token may have expired. Please reconnect your account.'
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Failed to fetch block folders',
      details: error.message
    }, { status: 500 });
  }
}