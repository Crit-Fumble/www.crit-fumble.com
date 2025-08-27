import prisma from '@cfg/next/services/DatabaseService';
import { getCharactersByPlayerId } from '@cfg/next/services/GameSystem/Base/Character/CharacterService';

export const getParty = async ( party: any ) => {
  let result = {};

  if (party?.id) {
    result = await getPartyById(party?.id);
  }
  if (party?.slug) {
    result = await getPartyBySlug(party?.slug);
  }
  if (party?.name) {
    result = await getPartyByName(party?.name);
  }

  return result;
}

export const getPartyBySlug = async ( slug: string ) => {
  if (!slug) return {};
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.party.findFirst({
    where: { slug }
  });

  return response ?? {};
}

export const getPartyById = async ( id: string ) => {
  if (!id) {
    console.log("PartyService: getPartyById called with empty ID");
    return {};
  }
  
  try {
    console.log(`PartyService: Attempting to get party with ID: ${id}`);
    
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.party.findUnique({
      where: { id }
    });

    if (!response) {
      console.log(`PartyService: No party found with ID: ${id}`);
      return {};
    }
    
    console.log(`PartyService: Successfully retrieved party with ID: ${id}`, 
               { name: response.name, id: response.id });
    return response;
  } catch (error) {
    console.error(`PartyService: Error retrieving party with ID: ${id}`, error);
    return {};
  }
}

export const getPartyByName = async ( name: string ) => {
  if (!name) return {};
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.party.findFirst({
    where: { name }
  });

  return response ?? {};
}

export const getPartiesByCampaignId = async ( campaignId: string ) => {
  if (!campaignId) return [];
  
  // @ts-ignore - Prisma client has this model at runtime
  // TODO: get parties from campaign

  return [];
}

export const getPartiesByParentPartyId = async ( parentParty: string ) => {
  if (!parentParty) return [];
  
  // @ts-ignore - Prisma client has this model at runtime
  const response = await prisma.party.findMany({
    where: { parentParty }
  });

  return response ?? [];
}

export const getPartiesByPlayerId = async ( playerId: string ) => {
  if (!playerId) return [];
  
  try {
    // Use a more efficient JOIN query to get parties directly
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.$queryRaw`
      SELECT DISTINCT p.*
      FROM "Party" p
      INNER JOIN "PartyCharacter" pc ON p.id = pc.party_id
      INNER JOIN "Character" c ON pc.character_id = c.id
      WHERE c.player = ${playerId}
      ORDER BY p.name ASC
    `;
    
    return response ?? [];
  } catch (error) {
    console.error('Error in getPartiesByPlayerId:', error);
    return [];
  }
}

/**
 * Get all parties that a character belongs to
 * Uses the PartyCharacter junction table to find relationships
 */
export const getPartiesByCharacterId = async ( characterId: string ) => {
  if (!characterId) return [];
  
  try {
    console.log(`PartyService: Attempting to get parties for character ID: ${characterId}`);
    
    // Use JOIN query to get parties for this character
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.$queryRaw`
      SELECT DISTINCT p.*
      FROM "Party" p
      INNER JOIN "PartyCharacter" pc ON p.id = pc.party_id
      WHERE pc.character_id = ${characterId}
      ORDER BY p.name ASC
    `;
    
    console.log(`PartyService: Found ${Array.isArray(response) ? response.length : 0} parties for character ID: ${characterId}`);
    return response ?? [];
  } catch (error) {
    console.error(`Error in getPartiesByCharacterId for character ${characterId}:`, error);
    return [];
  }
}
