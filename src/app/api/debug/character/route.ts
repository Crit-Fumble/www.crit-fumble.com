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
    // @ts-ignore - Prisma client has this model at runtime
    const character = await prisma.character.findFirst({
      where: { slug }
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // If character has a party ID, fetch the party details
    let party = null;
    let parentParty = null;
    let campaign = null;

    // Check if character is associated with a party
    // Note: Using party_id rather than party as that's what the current DB schema uses
    if (character.party_id) {
      // @ts-ignore - Prisma client has this model at runtime
      party = await prisma.party.findUnique({
        where: { id: character.party_id }
      });

      if (party?.parentParty) {
        // @ts-ignore - Prisma client has this model at runtime
        parentParty = await prisma.party.findUnique({
          where: { id: party.parentParty }
        });
      }

      if (party?.campaign) {
        // @ts-ignore - Prisma client has this model at runtime
        campaign = await prisma.campaign.findUnique({
          where: { id: party.campaign }
        });
      }
    }
    
    // Also check for direct campaign relation
    // Note: Using campaign_id rather than campaign as that's what the current DB schema uses
    if (!campaign && character.campaign_id) {
      // @ts-ignore - Prisma client has this model at runtime
      campaign = await prisma.campaign.findUnique({
        where: { id: character.campaign_id }
      });
    }

    return NextResponse.json({ 
      character,
      party,
      parentParty,
      campaign
    });
  } catch (error) {
    console.error('Error in debug handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
