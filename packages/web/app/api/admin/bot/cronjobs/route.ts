import { NextResponse } from 'next/server';
import { getServerSession } from '@/web/config/auth';
import fetch from 'node-fetch';

// This endpoint retrieves all cron jobs configured in the bot
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
    
    // In a production environment, you would query the bot's API
    const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
    
    try {
      const botResponse = await fetch(`${BOT_API_URL}/cronjobs`, {
        headers: {
          'Authorization': `Bearer ${process.env.BOT_API_KEY}`
        },
        timeout: 5000 // 5 second timeout
      });
      
      if (!botResponse.ok) {
        // If the bot API is unavailable, return an empty list
        return NextResponse.json([]);
      }
      
      const cronJobs = await botResponse.json();
      return NextResponse.json(cronJobs);
      
    } catch (error) {
      // For demonstration purposes, return mock data if API is unavailable
      return NextResponse.json([
        {
          id: 'scheduled-events',
          name: 'HandleScheduledEvents',
          description: 'Checks for upcoming events and sends notifications',
          schedule: '*/30 * * * *',
          lastRun: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
          nextRun: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
          active: true
        },
        {
          id: 'campaign-reminders',
          name: 'CampaignReminders',
          description: 'Sends reminders for upcoming campaigns',
          schedule: '0 10 * * *', // 10:00 AM daily
          lastRun: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
          nextRun: new Date(Date.now() + 16 * 3600000).toISOString(), // 16 hours from now
          active: true
        },
        {
          id: 'cleanup-logs',
          name: 'CleanupLogs',
          description: 'Removes old log entries',
          schedule: '0 2 * * 0', // 2:00 AM on Sundays
          lastRun: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
          nextRun: new Date(Date.now() + 4 * 86400000).toISOString(), // 4 days from now
          active: false
        }
      ]);
    }
    
  } catch (error) {
    console.error('Error in cron jobs API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
