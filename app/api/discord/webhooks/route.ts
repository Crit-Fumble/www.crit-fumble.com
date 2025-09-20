import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';

/**
 * Discord Interaction endpoint - replaces persistent bot for slash commands
 * Discord will POST to this endpoint when users interact with your bot
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    // Verify the request is actually from Discord
    const publicKey = process.env.AUTH_DISCORD_PUBLIC_KEY;
    if (!publicKey || !signature || !timestamp) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 401 });
    }

    const isValid = verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle different interaction types
    switch (interaction.type) {
      case 1: // PING - Discord's verification
        return NextResponse.json({ type: 1 });

      case 2: // APPLICATION_COMMAND - Slash commands
        return await handleApplicationCommand(interaction);

      case 3: // MESSAGE_COMPONENT - Button/select menu interactions
        return await handleMessageComponent(interaction);

      case 4: // APPLICATION_COMMAND_AUTOCOMPLETE
        return await handleAutocomplete(interaction);

      case 5: // MODAL_SUBMIT - Form submissions
        return await handleModalSubmit(interaction);

      default:
        console.warn(`Unknown interaction type: ${interaction.type}`);
        return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error handling Discord interaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle slash command interactions
 */
async function handleApplicationCommand(interaction: any) {
  const { data } = interaction;
  
  console.log(`🎯 Command executed: /${data.name} by ${interaction.member?.user?.username || interaction.user?.username}`);

  switch (data.name) {
    case 'event':
      return await handleEventCommand(interaction);
    
    case 'campaign':
      return await handleCampaignCommand(interaction);
    
    case 'character':
      return await handleCharacterCommand(interaction);
    
    default:
      return NextResponse.json({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: `Command \`/${data.name}\` is not implemented yet.`,
          flags: 64 // EPHEMERAL
        }
      });
  }
}

/**
 * Handle button/select menu interactions
 */
async function handleMessageComponent(interaction: any) {
  const { data } = interaction;
  
  console.log(`🔘 Component interaction: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

  return NextResponse.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: `Button/select menu interactions not implemented yet.`,
      flags: 64 // EPHEMERAL
    }
  });
}

/**
 * Handle autocomplete interactions
 */
async function handleAutocomplete(interaction: any) {
  console.log(`🔍 Autocomplete requested for: ${interaction.data.name}`);

  return NextResponse.json({
    type: 8, // APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
    data: {
      choices: [] // Return empty choices for now
    }
  });
}

/**
 * Handle modal form submissions
 */
async function handleModalSubmit(interaction: any) {
  const { data } = interaction;
  
  console.log(`📝 Modal submitted: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

  return NextResponse.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: `Modal form submissions not implemented yet.`,
      flags: 64 // EPHEMERAL
    }
  });
}

/**
 * Handle /event command
 */
async function handleEventCommand(interaction: any) {
  // TODO: Implement event management functionality
  // This would integrate with your core services
  
  return NextResponse.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: '📅 Event management functionality coming soon!',
      flags: 64 // EPHEMERAL
    }
  });
}

/**
 * Handle /campaign command  
 */
async function handleCampaignCommand(interaction: any) {
  // TODO: Implement campaign management functionality
  
  return NextResponse.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: '🎲 Campaign management functionality coming soon!',
      flags: 64 // EPHEMERAL
    }
  });
}

/**
 * Handle /character command
 */
async function handleCharacterCommand(interaction: any) {
  // TODO: Implement character management functionality
  
  return NextResponse.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: '⚔️ Character management functionality coming soon!',
      flags: 64 // EPHEMERAL
    }
  });
}