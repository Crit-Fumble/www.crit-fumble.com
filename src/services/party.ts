import data from './data/parties';

export const getParty = async ( party: any ) => {
  let result = {};

  if (party?.id) {
    result = await getPartyById(party?.id);
  }
  if (party?.slug) {
    result = await getPartyById(party?.slug);
  }
  if (party?.name) {
    result = await getPartyById(party?.name);
  }

  return result;
}

export const getPartyBySlug = async ( slug: string ) => {
  if (!slug) return {};
  
  const response = data.find(party => party?.slug === slug);

  return response ?? {};
}

export const getPartyById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find(party => party?.id === id);

  return response ?? {};
}

export const getPartyByName = async ( name: string ) => {
  if (!name) return {};
  const response = data.find(party => party?.name === name);

  return response ?? {};
}

export const getPartiesByParentPartyId = async ( parentParty: string ) => {
  if (!parentParty) return {};
  const response = data.filter(party => party?.parentParty === parentParty);

  return response ?? {};
}
