import prisma from './DatabaseService';
import { getCharactersByPlayerId } from './CharacterService';

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
  const response = await prisma.party.findMany({
    where: { campaign: campaignId }
  });

  return response ?? [];
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
    // Get character data to determine which parties the player is in
    const characters = await getCharactersByPlayerId(playerId);
    
    // In Character model, party relationship uses party_id
    const partyIds = characters
      .map((char: any) => char?.party_id)
      .filter(id => id !== null && id !== undefined);
    
    // Only query for parties if we have party IDs
    if (!partyIds.length) return [];
    
    // @ts-ignore - Prisma client has this model at runtime
    const response = await prisma.party.findMany({
      where: {
        id: { in: partyIds }
      }
    });
    
    return response ?? [];
  } catch (error) {
    console.error('Error in getPartiesByPlayerId:', error);
    return [];
  }
}
