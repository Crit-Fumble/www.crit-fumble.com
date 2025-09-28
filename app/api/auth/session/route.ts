import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionCookie = cookies().get('fumble-session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ session: null, isLoggedIn: false });
    }
    
    const userData = JSON.parse(sessionCookie.value);
    
    return NextResponse.json({
      session: {
        id: userData.id,
        userId: userData.discord_id || userData.userId,
        username: userData.username,
        name: userData.name || userData.discord?.global_name,
        email: userData.email,
        avatar: userData.avatar || userData.discord?.avatar,
        admin: userData.admin || false,
        roles: userData.roles || []
      },
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error parsing session:', error);
    return NextResponse.json({ session: null, isLoggedIn: false });
  }
}