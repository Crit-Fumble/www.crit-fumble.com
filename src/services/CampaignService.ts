import { getCharactersByPlayerId } from './CharacterService';
import DatabaseService from './DatabaseService';

export const getCampaign = async ( campaign: any ) => {
  if (campaign?.id) {
    return getCampaignById(campaign?.id);
  }
  if (campaign?.slug) {
    return getCampaignById(campaign?.slug);
  }
  if (campaign?.name) {
    return getCampaignById(campaign?.name);
  }

  return {} as any;
}

export const getCampaignBySlug = async ( slug: string ) => {
  if (!slug) return {} as any;
  
  const response = await DatabaseService.campaign.findFirst({
    where: {
      slug: slug
    }
  })

  return response ?? {};
}

export const getCampaignById = async ( id: string ) => {
  if (!id) return {} as any;

  const response = await DatabaseService.campaign.findFirst({
    where: {
      id: id
    }
  })

  return response ?? {};
}

export const getCampaignByName = async ( name: string ) => {
  if (!name) return {} as any;

  const response = await DatabaseService.campaign.findFirst({
    where: {
      name: name
    }
  })  

  return response ?? {} as any;
}

export const getCampaignsByGmId = async ( id: string ) => {
  if (!id) return [] as any;

  const response = await DatabaseService.campaign.findMany({
    where: {
      gms: {
        has: id
      }
    }
  });

  return response ?? [] as any;
}
export const getCampaignsByPlayerId = async ( id: string ) => {
  if (!id) return [] as any;
  const characters = await getCharactersByPlayerId(id);
  const campaignIds = characters.map(char => char?.campaign);

  const response = await DatabaseService.campaign.findMany({
    where: {
      id: {
        in: campaignIds
       }
    }
  });

  return response ?? [] as any;
}