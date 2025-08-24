import prisma, { withDb } from '@/services/DatabaseService';
import { randomUUID } from 'crypto';

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
      campaign: true,
      party: true,
      characterSheets: {
        include: {
          game_system: true
        }
      }
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
      where: { slug }
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
    where: { id }
  });

  return response ?? {};
}

export const getCharactersByPlayerId = async (userId: string) => {
  if (!userId) return [] as any;

  return await withDb(async () => {
    // Based on the schema, we only have the 'player' field, not 'creator'
    const response = await prisma.character.findMany({
      where: {
        player: userId
      },
      orderBy: {
        name: 'asc'
      }
    });

    return response ?? [] as any;
  });
}

export const getCharactersByCampaignId = async ( campaignId: string ) => {
  if (!campaignId) return [];
  
  try {
    // Using raw query
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.$queryRaw`
      SELECT * FROM "Character"
      WHERE "campaign_id" = ${campaignId}
    `;

    return response ?? [];
  } catch (error) {
    console.error('Error in getCharactersByCampaignId:', error);
    return [];
  }
}

export const getCharactersByPartyId = async ( partyId: string ) => {
  if (!partyId) return [];
  
  try {
    // Using raw query
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.$queryRaw`
      SELECT * FROM "Character"
      WHERE "party_id" = ${partyId}
    `;

    return response ?? [];
  } catch (error) {
    console.error('Error in getCharactersByPartyId:', error);
    return [];
  }
}

export const createCharacter = async (characterData: any) => {
  if (!characterData) {
    throw new Error('Character data is required');
  }

  try {
    console.log('Attempting to create character with data:', characterData);
    
    // Generate a unique ID for the character
    const id = randomUUID();
    console.log(`Generated UUID for character: ${id}`);
    
    // Prepare the data for creating a new character
    const createData: any = {
      id,
      name: characterData.name,
      slug: characterData.slug,
      player: characterData.player
    };
    
    // Add D&D Beyond ID directly to the character if provided
    if (characterData.dnd_beyond_id !== undefined) {
      createData.dnd_beyond_id = characterData.dnd_beyond_id;
      console.log(`Using D&D Beyond ID: ${characterData.dnd_beyond_id}`);
    }
    
    // Add campaign relation if provided
    if (characterData.campaignId) {
      createData.campaign_id = characterData.campaignId;
    }
    
    // Add party relation if provided
    if (characterData.partyId) {
      createData.party_id = characterData.partyId;
    }
    
    // Add game system relation if provided
    if (characterData.gameSystemId) {
      createData.game_system_id = characterData.gameSystemId;
    }
    
    // Add World Anvil ID if provided
    if (characterData.worldAnvilId) {
      createData.world_anvil_id = characterData.worldAnvilId;
    }
    
    // Add PDF URL if provided
    if (characterData.pdfUrl) {
      createData.pdf_url = characterData.pdfUrl;
    }
    
    // Add sheet data if provided
    if (characterData.sheetData) {
      createData.sheet_data = characterData.sheetData;
    }
    
    console.log('Character create data:', createData);
    
    // Create the character in the database
    const character = await prisma.character.create({
      data: createData
    });
    
    console.log('Character created successfully:', character);
    return character;
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
}

export const updateCharacter = async (id: string, characterData: any) => {
  if (!id || !characterData) {
    throw new Error('Character ID and update data are required');
  }

  try {
    console.log(`Attempting to update character ${id} with data:`, characterData);
    
    // Check if the character exists
    const existingCharacter = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!existingCharacter) {
      throw new Error(`Character with ID ${id} not found`);
    }
    
    // Prepare update data
    const updateData: any = {};
    
    // Update basic fields if provided
    if (characterData.name !== undefined) updateData.name = characterData.name;
    if (characterData.slug !== undefined) updateData.slug = characterData.slug;
    if (characterData.player !== undefined) updateData.player = characterData.player;
    
    // Update D&D Beyond ID if provided
    if (characterData.dnd_beyond_id !== undefined) {
      updateData.dnd_beyond_id = characterData.dnd_beyond_id;
    }
    
    // Update PDF URL if provided
    if (characterData.pdf_url !== undefined) {
      updateData.pdf_url = characterData.pdf_url;
      console.log('Updating PDF URL to:', characterData.pdf_url);
    }
    
    // Update campaign relation if provided
    if (characterData.campaignId !== undefined) {
      updateData.campaign_id = characterData.campaignId;
    }
    
    // Update party relation if provided
    if (characterData.partyId !== undefined) {
      updateData.party_id = characterData.partyId;
    }
    
    // Update game system relation if provided
    if (characterData.gameSystemId !== undefined) {
      updateData.game_system_id = characterData.gameSystemId;
    }
    
    // Update World Anvil ID if provided
    if (characterData.worldAnvilId !== undefined) {
      updateData.world_anvil_id = characterData.worldAnvilId;
    }
    
    // Update PDF URL if provided
    if (characterData.pdf_url !== undefined) {
      updateData.pdf_url = characterData.pdf_url;
      console.log('Setting PDF URL in database to:', characterData.pdf_url);
    } else if (characterData.pdfUrl !== undefined) {
      // Also handle camelCase version for backward compatibility
      updateData.pdf_url = characterData.pdfUrl;
      console.log('Setting PDF URL from camelCase pdfUrl to:', characterData.pdfUrl);
    }
    
    // Update sheet data if provided
    if (characterData.sheetData !== undefined) {
      updateData.sheet_data = characterData.sheetData;
    }
    
    console.log('Character update data:', updateData);
    
    // Update the character in the database
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: updateData
    });
    
    console.log('Character updated successfully:', updatedCharacter);
    return updatedCharacter;
  } catch (error) {
    console.error(`Error updating character ${id}:`, error);
    throw error;
  }
}

export const deleteCharacter = async (id: string) => {
  if (!id) {
    throw new Error('Character ID is required');
  }

  try {
    console.log(`Attempting to delete character ${id}`);
    
    // Delete the character
    await prisma.character.delete({
      where: { id }
    });
    
    console.log(`Character ${id} deleted successfully`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting character ${id}:`, error);
    throw error;
  }
}
