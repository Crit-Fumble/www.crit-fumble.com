import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { getWorldAnvilConfig } from '@crit-fumble/worldanvil';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'WorldAnvil token is required' }, { status: 400 });
    }

    if (typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    // Validate the token by testing it with World Anvil API
    try {
      const waConfig = getWorldAnvilConfig();
      const client = new WorldAnvilApiClient({
        apiKey: waConfig.apiKey,
        accessToken: token,
      });

      // Test the token by fetching user identity
      const identity = await client.get('/identity');

      if (!identity || !identity.id) {
        return NextResponse.json({
          error: 'Invalid World Anvil token - could not verify identity'
        }, { status: 400 });
      }

      // Store the token in database
      await prisma.user.update({
        where: { id: userData.userId },
        data: {
          worldanvil_token: token,
          worldanvil_id: identity.id,
          worldanvil_username: identity.username,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ World Anvil: User ${identity.username} (${identity.id}) linked successfully`);

      return NextResponse.json({
        success: true,
        message: 'World Anvil account linked successfully',
        worldanvil: {
          id: identity.id,
          username: identity.username,
        }
      });
    } catch (apiError: any) {
      console.error('Error validating World Anvil token:', apiError);
      return NextResponse.json({
        error: 'Invalid World Anvil token - could not authenticate with World Anvil API',
        details: apiError.message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error connecting WorldAnvil:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);

    // Get user's World Anvil connection status
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        worldanvil_id: true,
        worldanvil_username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      connected: !!user.worldanvil_id,
      worldanvil: user.worldanvil_id ? {
        id: user.worldanvil_id,
        username: user.worldanvil_username,
      } : null,
    });
  } catch (error) {
    console.error('Error checking WorldAnvil status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);

    // Remove user's World Anvil token from database
    await prisma.user.update({
      where: { id: userData.userId },
      data: {
        worldanvil_token: null,
        worldanvil_id: null,
        worldanvil_username: null,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ World Anvil: User ${userData.username} disconnected successfully`);

    return NextResponse.json({
      success: true,
      message: 'World Anvil account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting WorldAnvil:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}