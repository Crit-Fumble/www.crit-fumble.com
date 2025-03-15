import prisma from '@/services/DatabaseService';
import { randomUUID } from 'node:crypto';

export const getCharacter = async ( character: any ) => {
  let result = {};

  if (character?.id) {
    result = await getCharacterById(character?.id);
  }
  if (character?.slug) {
    result = await getCharacterBySlug(character?.slug);
  }
  if (character?.name) {
    result = await getCharacterById(character?.name);
  }

  return result;
}

export const getCharacterBySlug = async ( slug: string ) => {
  if (!slug) return {};
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.character.findFirst({
    where: { slug },
    include: {
      DndBeyond: true
    }
  });

  return response ?? {};
}

/**
 * Get character by slug with all related data (party, campaign) in a single query
 */
export const getCharacterWithRelations = async (slug: string) => {
  if (!slug) return null;
  
  try {
    // @ts-ignore - Prisma client has this model at runtime
    const character = await prisma.character.findFirst({
      where: { slug },
      include: {
        DndBeyond: true
      }
    });
    
    console.log('Character data with relations:', character);
    
    return character;
  } catch (error) {
    console.error('Error in getCharacterWithRelations:', error);
    return null;
  }
}

export const getCharacterById = async ( id: string ) => {
  if (!id) return {};
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.character.findUnique({
    where: { id },
    include: {
      DndBeyond: true
    }
  });

  return response ?? {};
}

export const getCharactersByPlayerId = async ( userId: string ) => {
  if (!userId) return [];
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.character.findMany({
    where: { player: userId },
    include: {
      DndBeyond: true
    }
  });

  return response ?? [];
}

export const getCharactersByCampaignId = async ( campaignId: string ) => {
  if (!campaignId) return [];

  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.character.findMany({
    where: { campaign: campaignId },
    include: {
      DndBeyond: true
    }
  });

  return response ?? [];
}

export const getCharactersByPartyIds = async ( partyIds: string[] ) => {
  if (!partyIds || !partyIds?.length) return [];

  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.character.findMany({
    where: { 
      party: { 
        in: partyIds 
      } 
    },
    include: {
      DndBeyond: true
    }
  });

  return response ?? [];
}

/**
 * Create a D&D Beyond character record
 */
export const createCharacterDndBeyond = async (dndBeyondId: string) => {
  if (!dndBeyondId) {
    console.log('No D&D Beyond ID provided');
    return null;
  }
  
  console.log(`Attempting to create CharacterDndBeyond with D&D Beyond ID: ${dndBeyondId}`);
  
  try {
    // Generate a unique ID for the new D&D Beyond character record
    const id = randomUUID();
    console.log(`Generated UUID for CharacterDndBeyond: ${id}`);
    
    // Create the data object to explicitly see what we're passing
    const createData = {
      id,
      dd_beyond_id: dndBeyondId
    };
    console.log('CharacterDndBeyond create data:', createData);
    
    // @ts-ignore - Prisma client has this model at runtime
    const dndBeyondCharacter = await prisma.characterDndBeyond.create({
      data: createData,
    });
    
    console.log('CharacterDndBeyond record created successfully:', dndBeyondCharacter);
    return dndBeyondCharacter;
  } catch (error) {
    console.error('Error creating D&D Beyond character record:', error);
    return null;
  }
}

export const createCharacter = async (characterData: any, userId: string) => {
  if (!userId || !characterData) {
    console.log('Missing userId or characterData');
    return null;
  }
  
  try {
    // Generate a unique ID for the new character
    const id = randomUUID();
    console.log('Character data received:', characterData);
    
    // Check if D&D Beyond ID was provided
    let dd_beyond = null;
    if (characterData.dndBeyondId) {
      console.log(`Creating D&D Beyond character record with ID: ${characterData.dndBeyondId}`);
      
      try {
        // Create D&D Beyond character record
        const dndBeyondCharacter = await createCharacterDndBeyond(characterData.dndBeyondId);
        
        if (dndBeyondCharacter) {
          // The id field from CharacterDndBeyond should be linked to the dd_beyond field in Character
          dd_beyond = dndBeyondCharacter.id;
          console.log(`D&D Beyond record created with system ID: ${dd_beyond}`);
        } else {
          console.warn('Failed to create D&D Beyond character record');
        }
      } catch (error) {
        console.error('Error in D&D Beyond character creation:', error);
      }
      
      // Remove dndBeyondId from characterData as it's not a direct field in the Character model
      delete characterData.dndBeyondId;
    } else {
      console.log('No D&D Beyond ID provided in character data');
    }
    
    const characterCreateData = {
      id,
      ...characterData,
      dd_beyond, // This links to the CharacterDndBeyond.id
      player: userId // Ensure the character belongs to the authenticated user
    };
    
    console.log('Creating character with data:', characterCreateData);
    
    // @ts-ignore - Prisma client has this model at runtime
    const newCharacter = await prisma.character.create({
      data: characterCreateData,
      include: {
        DndBeyond: true
      }
    });
    
    console.log('Character created successfully:', newCharacter);
    return newCharacter;
  } catch (error) {
    console.error('Error creating character:', error);
    return null;
  }
}

export const updateCharacter = async (id: string, characterData: any, userId: string) => {
  if (!id || !userId) return null;
  
  try {
    // First check if the character exists
    // @ts-ignore - Prisma client has this model at runtime
    const existingCharacter = await prisma.character.findUnique({
      where: { id },
      include: {
        DndBeyond: true
      }
    });
    
    if (!existingCharacter) {
      return null; // Character not found
    }
    
    // Check if user is the player or a game master
    const isPlayer = existingCharacter.player === userId;
    const isGM = await isGameMasterForCharacter(id, userId);
    
    if (!isPlayer && !isGM) {
      // User is neither the player nor a GM for this character
      return null;
    }
    
    // @ts-ignore - Prisma client has this model at runtime
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        ...characterData,
        updatedAt: new Date()
      },
      include: {
        DndBeyond: true
      }
    });
    
    return updatedCharacter;
  } catch (error) {
    console.error('Error updating character:', error);
    return null;
  }
}

export const deleteCharacter = async (id: string, userId: string) => {
  if (!id || !userId) return false;
  
  try {
    // First check if the character exists
    // @ts-ignore - Prisma client has this model at runtime
    const existingCharacter = await prisma.character.findUnique({
      where: { id },
      include: {
        DndBeyond: true
      }
    });
    
    if (!existingCharacter) {
      return false; // Character not found
    }
    
    // Check if user is the player or a game master
    const isPlayer = existingCharacter.player === userId;
    const isGM = await isGameMasterForCharacter(id, userId);
    
    if (!isPlayer && !isGM) {
      // User is neither the player nor a GM for this character
      return false;
    }
    
    try {
      // First delete the DndBeyond record if it exists
      if (existingCharacter.DndBeyond && existingCharacter.dd_beyond) {
        // @ts-ignore - Prisma client has this model at runtime
        await prisma.characterDndBeyond.delete({
          where: { id: existingCharacter.dd_beyond }
        });
      }
      
      // Then delete the character
      // @ts-ignore - Prisma client has this model at runtime
      await prisma.character.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting character and related records:', error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting character:', error);
    return false;
  }
}

// Helper function to check if a user is a GM for a character's campaign
export const isGameMasterForCharacter = async (characterId: string, userId: string) => {
  if (!characterId || !userId) return false;
  
  try {
    // Get the character with its campaign
    // @ts-ignore - Prisma client has this model at runtime
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: {
        id: true,
        campaign: true,
        party: true
      },
      include: {
        DndBeyond: true
      }
    });
    
    if (!character) return false;
    
    // Check if the user is a GM for the campaign
    if (character.campaign) {
      // @ts-ignore - Prisma client has this model at runtime
      const campaign = await prisma.campaign.findUnique({
        where: { id: character.campaign },
        select: {
          id: true,
          gms: true
        }
      });
      
      if (campaign && campaign.gms && campaign.gms.includes(userId)) {
        return true;
      }
    }
    
    // Check if the user is a GM for the party
    if (character.party) {
      // @ts-ignore - Prisma client has this model at runtime
      const party = await prisma.party.findUnique({
        where: { id: character.party },
        select: {
          id: true,
          campaign: true
        }
      });
      
      if (party && party.campaign) {
        // @ts-ignore - Prisma client has this model at runtime
        const campaign = await prisma.campaign.findUnique({
          where: { id: party.campaign },
          select: {
            id: true,
            gms: true
          }
        });
        
        if (campaign && campaign.gms && campaign.gms.includes(userId)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if user is GM for character:', error);
    return false;
  }
}
