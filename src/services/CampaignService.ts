import { getCharactersByPlayerId } from './CharacterService';
import DatabaseService from './DatabaseService';

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
  
  const response = await DatabaseService.campaign.findFirst({
    where: {
      slug: slug
    }
  })

  return response ?? {};
}

export const getCampaignById = async ( id: string ) => {
  if (!id) return {};

  const response = await DatabaseService.campaign.findFirst({
    where: {
      id: id
    }
  })

  return response ?? {};
}

export const getCampaignByName = async ( name: string ) => {
  if (!name) return {};

  const response = await DatabaseService.campaign.findFirst({
    where: {
      name: name
    }
  })  

  return response ?? {};
}

export const getCampaignsByGmId = async ( id: string ) => {
  if (!id) return [];

  const response = await DatabaseService.campaign.findMany({
    where: {
      gms: {
        has: id
      }
    }
  });

  return response ?? [];
}
export const getCampaignsByPlayerId = async ( id: string ) => {
  if (!id) return [];
  const characters = await getCharactersByPlayerId(id);
  const campaignIds = characters.map(char => char?.campaign);

  const response = await DatabaseService.campaign.findMany({
    where: {
      id: {
        in: campaignIds
       }
    }
  });

  return response ?? [];
}