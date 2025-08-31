import { NextResponse } from 'next/server';
import { getServerSession } from '@crit-fumble/core/server/config/auth';
import fetch from 'node-fetch';

// This endpoint provides the current status of the Discord bot
export async function GET() {
  try {
    // Verify authentication and permissions
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify admin status
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to verify user permissions' }, { status: 403 });
    }
    
    const userData = await userResponse.json();
    
    if (!userData.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // This would normally call the bot's API to get the actual status
    // For demonstration, we're returning mock data
    // In a production environment, you would set up an internal API for the bot
    // that could be queried from here
    
    const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
    
    try {
      const botResponse = await fetch(`${BOT_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${process.env.BOT_API_KEY}`
        },
        timeout: 5000 // 5 second timeout
      });
      
      if (!botResponse.ok) {
        // If the bot API is unavailable, return offline status
        return NextResponse.json({
          online: false,
          uptime: 'N/A',
          memory: 'N/A',
          guilds: 0,
          version: process.env.BOT_VERSION || '1.0.0'
        });
      }
      
      const botStatus = await botResponse.json();
      return NextResponse.json(botStatus);
      
    } catch (error) {
      // If there's an error connecting to the bot API, return offline status
      return NextResponse.json({
        online: false,
        uptime: 'N/A',
        memory: 'N/A',
        guilds: 0,
        version: process.env.BOT_VERSION || '1.0.0'
      });
    }
    
  } catch (error) {
    console.error('Error in bot status API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
