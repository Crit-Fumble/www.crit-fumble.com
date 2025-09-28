/**
 * Simple test for Discord help command
 */
import { PrismaClient, DiscordController } from '@crit-fumble/core';
import { InteractionType, InteractionResponseType } from 'discord-interactions';

async function testHelpCommand() {
  console.log('🧪 Testing Discord help command...');
  
  const prisma = new PrismaClient();
  const controller = new DiscordController(prisma);
  
  // Mock Discord interaction for /help command
  const mockInteraction = {
    type: InteractionType.ApplicationCommand,
    data: {
      name: 'help'
    },
    user: {
      id: '123456789',
      username: 'testuser'
    },
    guild_id: process.env.DISCORD_SERVER_ID || '1234567890'
  };
  
  try {
    const response = await controller.handleInteraction(mockInteraction);
    
    console.log('✅ Help command response:');
    console.log('Response type:', response.type);
    console.log('Response data:', response.data?.content);
    
    if (response.type === InteractionResponseType.ChannelMessageWithSource) {
      console.log('🎉 Help command working correctly!');
    } else {
      console.log('❌ Unexpected response type');
    }
    
  } catch (error) {
    console.error('❌ Error testing help command:', error);
  } finally {
    await controller.cleanup();
  }
}

// Run the test
if (require.main === module) {
  testHelpCommand().catch(console.error);
}