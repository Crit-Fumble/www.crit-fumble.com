import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/`);
  
  // Clear the session cookie
  response.cookies.delete('fumble-session');
  
  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}