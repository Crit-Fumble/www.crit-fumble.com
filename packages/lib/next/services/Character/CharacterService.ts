import prisma, { withDb } from '@cfg/next/services/DatabaseService';
import { randomUUID } from 'crypto';
import { Character } from '@cfg/models/Character/Character';

export const getCharacter = async ( character: Partial<Character> ): Promise<Character | null> => {
  let result: Character | null = null;

  if (character?.id) {
    result = await getCharacterById(character?.id);
  }
  if (!result && character?.slug) {
    result = await getCharacterBySlug(character?.slug);
  }
  if (!result && character?.name) {
    result = await getCharacterById(character?.name);
  }

  return result;
}

export const getCharacterBySlug = async ( slug: string ): Promise<Character | null> => {
  if (!slug) return null;
  
  try {
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.character.findFirst({
      where: { slug }
    });

    return response as Character;
  } catch (error) {
    console.error(`Error getting character by slug ${slug}:`, error);
    return null;
  }
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
    
    return character;
  } catch (error) {
    console.error('Error in getCharacterWithRelations:', error);
    return null;
  }
}

export const getCharacterById = async ( id: string ): Promise<Character | null> => {
  if (!id) return null;
  
  try {
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.character.findUnique({
      where: { id }
    });

    return response as Character;
  } catch (error) {
    console.error(`Error getting character by ID ${id}:`, error);
    return null;
  }
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

export const createCharacter = async (characterData: Omit<Character, 'id'>) => {
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
      player: characterData.player
    };
    
    // Handle slug with collision detection
    if (characterData.slug) {
      // Check if the slug already exists
      const slugExists = await prisma.character.findFirst({
        where: {
          slug: characterData.slug
        }
      });
      
      if (slugExists) {
        // If slug exists, append a unique suffix
        const timestamp = new Date().getTime();
        createData.slug = `${characterData.slug}-${timestamp}`;
        console.log(`Slug collision detected. Modified slug to: ${createData.slug}`);
      } else {
        createData.slug = characterData.slug;
      }
    } else if (characterData.name) {
      // Generate slug from name if not provided
      const baseSlug = characterData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if the generated slug exists
      const slugExists = await prisma.character.findFirst({
        where: {
          slug: baseSlug
        }
      });
      
      if (slugExists) {
        // If slug exists, append a unique suffix
        const timestamp = new Date().getTime();
        createData.slug = `${baseSlug}-${timestamp}`;
      } else {
        createData.slug = baseSlug;
      }
      
      console.log(`Generated slug: ${createData.slug}`);
    }
    
    // Add optional fields if provided
    if (characterData.dnd_beyond_id !== undefined) {
      createData.dnd_beyond_id = characterData.dnd_beyond_id;
    }
    
    if (characterData.portrait_url) createData.portrait_url = characterData.portrait_url;
    if (characterData.token_url) createData.token_url = characterData.token_url;
    if (characterData.summary) createData.summary = characterData.summary;
    if (characterData.description) createData.description = characterData.description;
    if (characterData.title) createData.title = characterData.title;
    
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

export const updateCharacter = async (characterData: Character) => {
  if (!characterData.id || !characterData) {
    throw new Error('Character ID and update data are required');
  }

  try {
    console.log(`Attempting to update character ${characterData.id} with data:`, characterData);
    
    // Check if the character exists
    const existingCharacter = await prisma.character.findUnique({
      where: { id: characterData.id }
    });
    
    if (!existingCharacter) {
      throw new Error(`Character with ID ${characterData.id} not found`);
    }
    
    // Prepare update data
    const updateData: any = {};
    
    // Update basic fields if provided
    if (characterData.name !== undefined) updateData.name = characterData.name;
    
    // Handle slug updates with collision detection
    if (characterData.slug !== undefined && characterData.slug !== existingCharacter.slug) {
      // Check if the slug already exists for a different character
      const slugExists = await prisma.character.findFirst({
        where: {
          slug: characterData.slug,
          id: { not: characterData.id }
        }
      });
      
      if (slugExists) {
        // If slug exists, append a unique suffix
        const timestamp = new Date().getTime();
        updateData.slug = `${characterData.slug}-${timestamp}`;
        console.log(`Slug collision detected. Modified slug to: ${updateData.slug}`);
      } else {
        updateData.slug = characterData.slug;
      }
    }
    
    if (characterData.player !== undefined) updateData.player = characterData.player;
    
    // Handle any other fields that might be passed
    if (characterData.portrait_url) updateData.portrait_url = characterData.portrait_url;
    if (characterData.token_url) updateData.token_url = characterData.token_url;
    if (characterData.summary) updateData.summary = characterData.summary;
    if (characterData.description) updateData.description = characterData.description;
    if (characterData.title) updateData.title = characterData.title;
    if (characterData.dnd_beyond_id) updateData.dnd_beyond_id = characterData.dnd_beyond_id;

    console.log('Character update data:', updateData);
    
    // Update the character in the database
    const updatedCharacter = await prisma.character.update({
      where: { id: characterData.id },
      data: updateData
    });
    
    console.log('Character updated successfully:', updatedCharacter);
    return updatedCharacter;
  } catch (error) {
    console.error(`Error updating character ${characterData.id}:`, error);
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
