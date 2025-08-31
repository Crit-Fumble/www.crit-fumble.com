import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '../../../../../next/services/AuthService';
import { getUserByDiscordId } from '../../../../../next/services/ProfileService';
import { getCharactersByPlayerId } from '../../../../../next/services/Character/CharacterService';
import { getCampaignsByUserId } from '../../../../../next/services/Party/PartyService';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify authentication
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Get user data from database using session ID
    const userData = await getUserByDiscordId(session.user.id);
    
    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's characters
    const characters = await getCharactersByPlayerId(userData.id);
    
    // Get user's campaigns/parties
    const campaigns = await getCampaignsByUserId(userData.id);
    
    // Return formatted user data
    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        admin: userData.admin || false
      },
      characters,
      campaigns
    });
    
  } catch (error) {
    console.error('Error in /api/user/data route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
