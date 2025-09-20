import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get the base URL from the request
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const response = NextResponse.redirect(`${baseUrl}/`);
  
  // Clear the session cookie
  response.cookies.delete('fumble-session');
  
  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}