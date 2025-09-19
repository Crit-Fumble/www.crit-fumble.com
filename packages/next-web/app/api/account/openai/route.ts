import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { apiKey, organizationId } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is required' }, { status: 400 });
    }

    // TODO: Store user's OpenAI credentials securely in database
    // For now, we'll just validate the API key format
    if (typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
      return NextResponse.json({ error: 'Invalid OpenAI API key format' }, { status: 400 });
    }

    // TODO: Test the API key with OpenAI API to ensure it's valid
    
    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI credentials connected successfully' 
    });
  } catch (error) {
    console.error('Error connecting OpenAI:', error);
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

    // TODO: Remove user's OpenAI credentials from database
    
    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI credentials disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting OpenAI:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}