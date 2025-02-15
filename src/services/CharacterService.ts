import data from '@lib/data/characters';

export const getCharacter = async ( character: any ) => {
  let result = {};

  if (character?.id) {
    result = await getCharacterById(character?.id);
  }
  if (character?.slug) {
    result = await getCharacterById(character?.slug);
  }
  if (character?.name) {
    result = await getCharacterById(character?.name);
  }

  return result;
}

export const getCharacterBySlug = async ( slug: string ) => {
  if (!slug) return {};
  const response = data.find(character => character?.slug === slug);

  return response ?? {};
}

export const getCharacterById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find(character => character?.id === id);

  return response ?? {};
}
export const getCharactersByPlayerId = async ( userId: string ) => {
  const response = data.filter(character => character?.player === userId);

  return response ?? [];
}

export const getCharactersByCampaignId = async ( campaignId: string ) => {
  if (!campaignId) return [];

  const response = data.filter(character => character?.campaign === campaignId);

  return response ?? [];
}

export const getCharactersByPartyIds = async ( partyIds: string[] ) => {
  if (!partyIds || !partyIds?.length) return [];

  const response = data.filter(character => partyIds.includes(character?.party ?? ''));

  return response ?? [];
}
