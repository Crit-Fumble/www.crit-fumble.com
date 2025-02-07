import data from '../data/campaigns';
import { getCharactersByPlayerId } from './CharacterService';

export const getCampaign = async ( campaign: any ) => {
  let result = {};

  if (campaign?.id) {
    result = await getCampaignById(campaign?.id);
  }
  if (campaign?.slug) {
    result = await getCampaignById(campaign?.slug);
  }
  if (campaign?.name) {
    result = await getCampaignById(campaign?.name);
  }

  return result;
}

export const getCampaignBySlug = async ( slug: string ) => {
  if (!slug) return {};
  const response = data.find(campaign => campaign?.slug === slug);

  return response ?? {};
}

export const getCampaignById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find(campaign => campaign?.id === id);

  return response ?? {};
}

export const getCampaignByName = async ( name: string ) => {
  if (!name) return {};
  const response = data.find(campaign => campaign?.name === name);

  return response ?? {};
}

export const getCampaignsByGmId = async ( id: string ) => {
  if (!id) return [];
  const response = data.filter(campaign => campaign?.gms?.includes(id));

  return response ?? [];
}
export const getCampaignsByPlayerId = async ( id: string ) => {
  if (!id) return [];
  const characters = await getCharactersByPlayerId(id);
  const campaignIds = characters.map(char => char?.campaign);
  const response = data.filter(campaign => campaignIds?.includes(campaign?.id) || campaign?.gms?.includes(id) );

  return response ?? [];
}