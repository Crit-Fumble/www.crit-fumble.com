import prisma from '@cfg/next/services/DatabaseService';
import { randomUUID } from 'crypto';

export const getCharacterSheetById = async (id: string) => {
  if (!id) return null;
  
  try {
    // @ts-ignore - Prisma client has this model at runtime
    const characterSheet = await prisma.characterSheet.findUnique({
      where: { id }
    });
    
    return characterSheet;
  } catch (error) {
    console.error('Error in getCharacterSheetById:', error);
    return null;
  }
};

export const getCharacterSheetsByCharacterId = async (characterId: string) => {
  if (!characterId) return [];
  
  try {
    // @ts-ignore - Prisma client has this model at runtime
    const characterSheets = await prisma.characterSheet.findMany({
      where: { character_id: characterId },
      include: {
        game_system: true
      }
    });
    
    return characterSheets;
  } catch (error) {
    console.error('Error in getCharacterSheetsByCharacterId:', error);
    return [];
  }
};

export const getCharacterSheetBySystem = async (characterId: string, gameSystemId: string) => {
  if (!characterId || !gameSystemId) return null;
  
  try {
    // First try to find a primary sheet for this system
    // @ts-ignore - Prisma client has this model at runtime
    const primarySheet = await prisma.characterSheet.findFirst({
      where: {
        character_id: characterId,
        game_system_id: gameSystemId,
      }
    });
    
    if (primarySheet) return primarySheet;
    
    // If no primary sheet found, return any sheet for this system
    // @ts-ignore - Prisma client has this model at runtime
    const anySheet = await prisma.characterSheet.findFirst({
      where: {
        character_id: characterId,
        game_system_id: gameSystemId
      }
    });
    
    return anySheet;
  } catch (error) {
    console.error('Error in getCharacterSheetBySystem:', error);
    return null;
  }
};

export const createCharacterSheet = async (sheetData: any) => {
  if (!sheetData?.character_id || !sheetData?.game_system_id) {
    throw new Error('Character ID and game system ID are required');
  }

  try {
    console.log('Creating character sheet with data:', sheetData);
    
    // Generate a unique ID for the character sheet
    const id = sheetData.id || randomUUID();
    
    const createData = {
      id,
      character_id: sheetData.character_id,
      game_system_id: sheetData.game_system_id,
      sheet_data: sheetData.sheet_data || {},
      summary: sheetData.summary,
      description: sheetData.description,
      is_active: sheetData.is_active !== undefined ? sheetData.is_active : false,
    };
    
    // @ts-ignore - Prisma client has this model at runtime
    const characterSheet = await prisma.characterSheet.create({
      data: createData
    });
    
    console.log('Character sheet created successfully:', characterSheet);
    return characterSheet;
  } catch (error) {
    console.error('Error creating character sheet:', error);
    throw error;
  }
};

export const updateCharacterSheet = async (id: string, sheetData: any) => {
  if (!id) {
    throw new Error('Character sheet ID is required');
  }

  try {
    console.log(`Updating character sheet ${id} with data:`, sheetData);
    
    // Prepare update data
    const updateData: any = {};
    
    if (sheetData.sheet_data !== undefined) updateData.sheet_data = sheetData.sheet_data;
    if (sheetData.summary !== undefined) updateData.summary = sheetData.summary;
    if (sheetData.description !== undefined) updateData.description = sheetData.description;
    if (sheetData.is_active !== undefined) updateData.is_active = sheetData.is_active;
    
    // Handle is_primary specially
    if (sheetData.is_primary !== undefined) {
      updateData.is_primary = sheetData.is_primary;
      
      if (sheetData.is_primary) {
        // Get the character sheet to find character_id and game_system_id
        // @ts-ignore - Prisma client has this model at runtime
        const sheet = await prisma.characterSheet.findUnique({
          where: { id }
        });
        
        if (sheet) {
          // If we're setting this sheet as primary, unset any other primary sheets for this character in this system
          // @ts-ignore - Prisma client has this model at runtime
          await prisma.characterSheet.updateMany({
            where: {
              character_id: sheet.character_id,
              game_system_id: sheet.game_system_id,
              is_active: true,
              id: { not: id }
            },
            data: {
              is_active: false
            }
          });
        }
      }
    }
    
    // Update the character sheet
    // @ts-ignore - Prisma client has this model at runtime
    const updatedSheet = await prisma.characterSheet.update({
      where: { id },
      data: updateData
    });
    
    console.log('Character sheet updated successfully:', updatedSheet);
    return updatedSheet;
  } catch (error) {
    console.error(`Error updating character sheet ${id}:`, error);
    throw error;
  }
};

export const deleteCharacterSheet = async (id: string) => {
  if (!id) {
    throw new Error('Character sheet ID is required');
  }

  try {
    console.log(`Deleting character sheet ${id}`);
    
    // Delete the character sheet
    // @ts-ignore - Prisma client has this model at runtime
    await prisma.characterSheet.delete({
      where: { id }
    });
    
    console.log(`Character sheet ${id} deleted successfully`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting character sheet ${id}:`, error);
    throw error;
  }
};
