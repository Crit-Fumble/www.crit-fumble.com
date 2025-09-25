import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';

/**
 * Discord Application Events webhook endpoint
 * Handles Discord application webhook events like APPLICATION_AUTHORIZED
 * See: https://discord.com/developers/docs/events/webhook-events
 */

export async function POST(request: NextRequest) {
  try {
    // This endpoint gets called by Discord webhooks immediately when events happen
    // No need for scheduled polling - events are pushed to us instantly
    
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    // Verify Discord signature
    const publicKey = process.env.AUTH_DISCORD_PUBLIC_KEY;
    if (!publicKey || !signature || !timestamp) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 401 });
    }

    const isValid = verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle Discord application webhook events
    switch (event.event?.type) {
      case 'APPLICATION_AUTHORIZED':
        console.log('Application Authorized:', event);
        await handleApplicationAuthorized(event);
        break;

      case 'APPLICATION_DEAUTHORIZED':
        console.log('Application Deauthorized:', event);
        await handleApplicationDeauthorized(event);
        break;

      default:
        console.log('Unhandled application event type:', event.event?.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord event webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleApplicationAuthorized(eventData: any) {
  // Process application authorization
  console.log('Application authorized:', eventData);
  // Add logic for handling authorization (e.g., update database, notify admins)
}

async function handleApplicationDeauthorized(eventData: any) {
  // Process application deauthorization
  console.log('Application deauthorized:', eventData);
  // Add logic for handling deauthorization (e.g., cleanup data, notify admins)
}