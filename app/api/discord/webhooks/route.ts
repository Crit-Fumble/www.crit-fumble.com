import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';
import { PrismaClient, DiscordController } from '@crit-fumble/core';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();
const discordController = new DiscordController(prisma);

/**
 * Discord Interaction endpoint - replaces persistent bot for slash commands
 * Discord will POST to this endpoint when users interact with your bot
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const publicKey = process.env.AUTH_DISCORD_PUBLIC_KEY;
    if (!publicKey || !signature || !timestamp) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 401 });
    }

    const isValid = verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const interaction = JSON.parse(body);
    
    // Handle the interaction using the Discord controller
    const result = await discordController.handleInteraction(interaction);
    
    // If result contains error, return with appropriate status
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Discord webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}