import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Use NEXT_PUBLIC_BASE_URL to avoid port issues in Codespaces
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const homeUrl = new URL('/', baseUrl);
  
  // Create the redirect response
  const response = NextResponse.redirect(homeUrl);
  
  // Clear the session cookie with explicit settings to ensure it's deleted
  response.cookies.set('fumble-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    expires: new Date(0) // Set to past date
  });
  
  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}