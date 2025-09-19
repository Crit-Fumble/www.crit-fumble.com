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
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'WorldAnvil token is required' }, { status: 400 });
    }

    // TODO: Store user's WorldAnvil token securely in database
    // For now, we'll just validate the token format
    if (typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    // TODO: Test the token with WorldAnvil API to ensure it's valid
    
    return NextResponse.json({ 
      success: true, 
      message: 'WorldAnvil token connected successfully' 
    });
  } catch (error) {
    console.error('Error connecting WorldAnvil:', error);
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

    // TODO: Remove user's WorldAnvil token from database
    
    return NextResponse.json({ 
      success: true, 
      message: 'WorldAnvil token disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting WorldAnvil:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}