/**
 * World Anvil Blocks API Route
 *
 * GET /api/worldanvil/blocks?folderId=xxx - List blocks in a folder
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/blocks?folderId=xxx - List blocks in a folder
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
    const folderId = url.searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json({
        error: 'Folder ID is required',
        message: 'Please provide a folderId query parameter'
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

    // Fetch blocks from the specified folder
    const blocks = await client.get('/blockfolder/blocks', {
      params: {
        id: folderId,
        granularity: 1
      }
    });

    return NextResponse.json({
      success: true,
      blocks: blocks || [],
    });
  } catch (error: any) {
    console.error('Error fetching blocks:', error);

    // Handle World Anvil API errors
    if (error.response?.status === 401) {
      return NextResponse.json({
        error: 'World Anvil authentication failed',
        message: 'Your World Anvil token may have expired. Please reconnect your account.'
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Failed to fetch blocks',
      details: error.message
    }, { status: 500 });
  }
}