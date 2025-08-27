import { getServerSession } from '@/services/AuthService';
import prisma from '@/services/DatabaseService';
import { NextResponse } from 'next/server';

// GET endpoint to debug party data directly from the database
export async function GET(request: Request) {
  const session = await getServerSession();

  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const characterSlug = url.searchParams.get('characterSlug');

    if (!id && !characterSlug) {
      return NextResponse.json({ error: 'Party ID or character slug is required' }, { status: 400 });
    }

    let party = null;
    let character = null;

    // If character slug is provided, get the character first
    if (characterSlug) {
      // @ts-ignore - Prisma client has this model at runtime
      character = await prisma.character.findFirst({
        where: { slug: characterSlug }
      });

      if (!character) {
        return NextResponse.json({ error: 'Character not found' }, { status: 404 });
      }
    } else if (id) {
      // Direct party lookup by ID
      // @ts-ignore - Prisma client has this model at runtime
      party = await prisma.party.findUnique({
        where: { id }
      });
    }

    if (!party) {
      return NextResponse.json({ 
        error: 'Party not found',
        character
      }, { status: 404 });
    }

    // Get parent party if it exists
    let parentParty = null;
    if (party.parentParty) {
      // @ts-ignore - Prisma client has this model at runtime
      parentParty = await prisma.party.findUnique({
        where: { id: party.parentParty }
      });
    }

    return NextResponse.json({
      party,
      parentParty,
      character
    });
  } catch (error) {
    console.error('Error in debug party handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
