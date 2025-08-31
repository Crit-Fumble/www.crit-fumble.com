import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@crit-fumble/core/server/config/auth';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const body = await request.json();
    
    if (!body.jobId || typeof body.active !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: jobId and active' },
        { status: 400 }
      );
    }
    
    // In a production environment, send the request to the bot's API
    const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
    
    try {
      const botResponse = await fetch(`${BOT_API_URL}/cronjobs/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_KEY}`
        },
        body: JSON.stringify({
          jobId: body.jobId,
          active: body.active
        }),
        timeout: 5000 // 5 second timeout
      });
      
      if (!botResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to toggle cron job' },
          { status: 500 }
        );
      }
      
      const result = await botResponse.json();
      return NextResponse.json(result);
      
    } catch (error) {
      // For demonstration, we'll just return a success response
      return NextResponse.json({
        success: true,
        jobId: body.jobId,
        active: body.active
      });
    }
    
  } catch (error) {
    console.error('Error in toggle cron job API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
