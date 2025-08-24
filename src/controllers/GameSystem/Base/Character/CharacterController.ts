import { getServerSession } from '@/services/AuthService';
import { getCampaignById } from '@/services/GameSystem/Base/Campaign/CampaignService';
import { 
  getCharacterBySlug,
  getCharacterWithRelations, 
  createCharacter, 
  updateCharacter, 
  deleteCharacter 
} from '@/services/GameSystem/Base/Character/CharacterService';
import { getPartyById, getPartyBySlug } from '@/services/GameSystem/Base/Party/PartyService';
import { getUserByDiscordId } from '@/services/ProfileService';
import { getWorld } from '@/services/GameSystem/Base/World/WorldAnvilService';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { Character } from '@/models/cfg';
import prisma from '@/services/DatabaseService';

export const getCharacterPageProps = async ({ character: { slug: characterSlug }, ...incProps}: any) => {
  if (!characterSlug) {
    redirect("/");
  }
  const session = await getServerSession();

  if (!session?.user?.id) {
    // TODO: get url for redirect
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/character/${characterSlug}`)}`);
  }

  try {
    // Get the user
    const player: any = await getUserByDiscordId(session.user.id);
    
    // Try to get the character with all possible relations first
    let character: any = await getCharacterWithRelations(characterSlug);
    
    // Fall back to basic character lookup if the relational query failed
    if (!character) {
      character = await getCharacterBySlug(characterSlug);
    }
    
    console.log(`Character data retrieved for ${characterSlug}:`, character);
    
    if (!character || Object.keys(character).length === 0) {
      console.error(`Character not found for slug: ${characterSlug}`);
      return {
        ...incProps,
        session,
        player,
        error: 'Character not found'
      };
    }
    
    // Initialize with empty objects to prevent null reference errors
    let party: any = {};
    let parentParty: any = {};
    let campaign: any = {};
    let world: any = {};
    
    // First check for direct campaign association
    if (character?.campaign_id) {
      console.log(`Character ${characterSlug} has direct campaign ID: ${character.campaign_id}`);
      campaign = await getCampaignById(character.campaign_id);
      console.log(`Direct campaign data:`, campaign);
      
      if (campaign?.worldAnvil) {
        world = await getWorld(campaign.worldAnvil);
      }
    }
    
    // Then check for party and its associated campaign
    if (character?.party_id) {
      console.log(`Character ${characterSlug} has party ID: ${character.party_id}`);
      
      try {
        party = await getPartyById(character.party_id);
        console.log(`Party data for ${characterSlug}:`, party ? JSON.stringify(party) : 'null');
        
        // Check if we actually got party data back
        if (!party || !party.id) {
          console.log(`WARNING: Failed to retrieve party with ID ${character.party_id}`);
          // Try direct database query as fallback
          // @ts-ignore - Prisma client has this model at runtime
          const directPartyQuery = await prisma.party.findUnique({
            where: { id: character.party_id }
          });
          
          if (directPartyQuery) {
            console.log(`Successfully retrieved party data via direct query:`, directPartyQuery);
            party = directPartyQuery;
          } else {
            console.error(`Party with ID ${character.party_id} not found in database`);
          }
        }
        
        if (party?.parentParty) {
          console.log(`Party has parent party ID: ${party.parentParty}`);
          parentParty = await getPartyById(party.parentParty);
          console.log(`Parent party data:`, parentParty ? JSON.stringify(parentParty) : 'null');
          
          if (!parentParty || !parentParty.id) {
            console.log(`WARNING: Failed to retrieve parent party with ID ${party.parentParty}`);
          }
        } else {
          console.log(`No parent party found for party ID: ${character.party_id}`);
        }
        
        // Only look for campaign through party if we don't already have one
        if (party?.campaign_id && !campaign?.id) {
          console.log(`Party has campaign ID: ${party.campaign_id}`);
          campaign = await getCampaignById(party.campaign_id);
          console.log(`Campaign data from party:`, campaign ? JSON.stringify(campaign) : 'null');
          
          if (campaign?.worldAnvil) {
            world = await getWorld(campaign.worldAnvil);
          }
        } else if (!campaign?.id) {
          console.log(`No campaign found for party ID: ${character.party_id}`);
        }
      } catch (error) {
        console.error(`Error retrieving party data for character ${characterSlug}:`, error);
      }
    } else {
      console.log(`Character ${characterSlug} has no party ID assigned`);
    }

    const outProps = {
      ...incProps,
      session,
      player,
      campaign,
      party,
      parentParty,
      character,
      world,
    }

    return outProps;
  } catch (error) {
    console.error('Error in getCharacterPageProps:', error);
    return {
      ...incProps,
      session,
      error: 'An error occurred while loading character data'
    };
  }
};

// Controller method to create a new character
export const createCharacterHandler = async (request: Request) => {
  const session = await getServerSession();

  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const characterData = await request.json();
    
    // Add the player ID to the character data
    characterData.player = session.user.id;

    // Create the character
    const newCharacter = await createCharacter(characterData);
    
    if (!newCharacter) {
      return NextResponse.json({ error: 'Failed to create character' }, { status: 400 });
    }
    
    return NextResponse.json({ character: newCharacter }, { status: 201 });
  } catch (error) {
    console.error('Error in createCharacterHandler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

// Controller method to update an existing character
export const updateCharacterHandler = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession();
  
  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const characterData = await request.json();
    const characterId = params.id;
    
    // Get the existing character to check ownership
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    // Check if the character exists and if the user is the owner
    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    
    // Get the user profile to properly check ownership
    const { getUserByDiscordId } = await import('@/services/ProfileService');
    const userProfile = await getUserByDiscordId(session.user.id);
    
    console.log('Update permissions check:', {
      characterPlayer: existingCharacter.player,
      sessionUserId: session.user.id,
      userProfileId: userProfile && typeof userProfile === 'object' && 'id' in userProfile ? userProfile.id : 'Not found'
    });
    
    // Check if the user is the owner of the character
    // Compare with both session ID and profile ID to handle different ID formats
    const isOwner = 
      existingCharacter.player === session.user.id || 
      (userProfile && typeof userProfile === 'object' && 'id' in userProfile && 
       existingCharacter.player === userProfile.id);
      
    if (!isOwner) {
      // TODO: Check if user is GM of the campaign/party
      return NextResponse.json({ 
        error: 'You do not have permission to edit this character. Only the character owner or a game master of the campaign/party can edit characters.' 
      }, { status: 403 });
    }
    
    // Update the character
    const updatedCharacter = await updateCharacter(characterId, characterData);
    
    if (!updatedCharacter) {
      return NextResponse.json({ 
        error: 'Failed to update character' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ character: updatedCharacter });
  } catch (error) {
    console.error('Error in updateCharacterHandler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

// Controller method to delete a character
export const deleteCharacterHandler = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await getServerSession();
  
  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const characterId = params.id;
    
    // Get the existing character to check ownership
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterId }
    });
    
    // Check if the character exists and if the user is the owner
    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    
    // Check if the user is the owner of the character
    if (existingCharacter.player !== session.user.id) {
      // TODO: Check if user is GM of the campaign/party
      return NextResponse.json({ 
        error: 'You do not have permission to delete this character. Only the character owner or a game master of the campaign/party can delete characters.' 
      }, { status: 403 });
    }
    
    // Delete the character
    await deleteCharacter(characterId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in deleteCharacterHandler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};