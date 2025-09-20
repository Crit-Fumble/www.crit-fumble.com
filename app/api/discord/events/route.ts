import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';

// Alternative approach: Event-driven Discord monitoring
// Instead of polling every 5 minutes, respond to Discord events in real-time

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

    // Handle different Discord events
    switch (event.t) {
      case 'GUILD_SCHEDULED_EVENT_CREATE':
      case 'GUILD_SCHEDULED_EVENT_UPDATE':
      case 'GUILD_SCHEDULED_EVENT_DELETE':
        // Process event immediately when Discord sends it
        await handleScheduledEvent(event.d);
        break;
      
      case 'GUILD_MEMBER_ADD':
      case 'GUILD_MEMBER_REMOVE':
        // Handle member changes immediately
        await handleMemberChange(event.d);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord event webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleScheduledEvent(eventData: any) {
  // Process scheduled events in real-time
  console.log('Scheduled event received:', eventData);
}

async function handleMemberChange(memberData: any) {
  // Process member changes in real-time
  console.log('Member change received:', memberData);
}