import { getServerSession } from '@/services/AuthService';
import prisma from '@/services/DatabaseService';
import { NextResponse } from 'next/server';

// GET endpoint to debug character data directly from the database
export async function GET(request: Request) {
  const session = await getServerSession();

  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Character slug is required' }, { status: 400 });
    }

    // Directly query the database for the character
    const character = await prisma.character.findFirst({
      where: { slug }
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      character
    });
  } catch (error) {
    console.error('Error in debug handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
