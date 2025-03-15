import { getServerSession } from '@/services/AuthService';
import { getCampaignById } from '@/services/CampaignService';
import { 
  getCharacterBySlug,
  getCharacterWithRelations, 
  createCharacter, 
  updateCharacter, 
  deleteCharacter 
} from '@/services/CharacterService';
import { getPartyById, getPartyBySlug } from '@/services/PartyService';
import { getUserByDiscordId } from '@/services/ProfileService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import prisma from '@/services/DatabaseService'; // Fixed import for prisma

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
    if (character?.campaign) {
      console.log(`Character ${characterSlug} has direct campaign ID: ${character.campaign}`);
      campaign = await getCampaignById(character.campaign);
      console.log(`Direct campaign data:`, campaign);
      
      if (campaign?.worldAnvil) {
        world = await getWorld(campaign.worldAnvil);
      }
    }
    
    // Then check for party and its associated campaign
    if (character?.party) {
      console.log(`Character ${characterSlug} has party ID: ${character.party}`);
      
      try {
        party = await getPartyById(character.party);
        console.log(`Party data for ${characterSlug}:`, party ? JSON.stringify(party) : 'null');
        
        // Check if we actually got party data back
        if (!party || !party.id) {
          console.log(`WARNING: Failed to retrieve party with ID ${character.party}`);
          // Try direct database query as fallback
          // @ts-ignore - Prisma client has this model at runtime
          const directPartyQuery = await prisma.party.findUnique({
            where: { id: character.party }
          });
          
          if (directPartyQuery) {
            console.log(`Successfully retrieved party data via direct query:`, directPartyQuery);
            party = directPartyQuery;
          } else {
            console.error(`Party with ID ${character.party} not found in database`);
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
          console.log(`No parent party found for party ID: ${character.party}`);
        }
        
        // Only look for campaign through party if we don't already have one
        if (party?.campaign && !campaign?.id) {
          console.log(`Party has campaign ID: ${party.campaign}`);
          campaign = await getCampaignById(party.campaign);
          console.log(`Campaign data from party:`, campaign ? JSON.stringify(campaign) : 'null');
          
          if (campaign?.worldAnvil) {
            world = await getWorld(campaign.worldAnvil);
          }
        } else if (!campaign?.id) {
          console.log(`No campaign found for party ID: ${character.party}`);
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

    // Create the character
    const newCharacter = await createCharacter(characterData, session.user.id);
    
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
    
    // Update the character (service layer will verify if user is player or GM)
    const updatedCharacter = await updateCharacter(characterId, characterData, session.user.id);
    
    if (!updatedCharacter) {
      return NextResponse.json({ 
        error: 'Character not found or you do not have permission to edit it. Only the character owner or a game master of the campaign/party can edit characters.' 
      }, { status: 403 });
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
    
    // Delete the character (service layer will verify if user is player or GM)
    const success = await deleteCharacter(characterId, session.user.id);
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Character not found or you do not have permission to delete it. Only the character owner or a game master of the campaign/party can delete characters.' 
      }, { status: 403 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in deleteCharacterHandler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};