import { randomUUID } from 'crypto';
import { slugify } from '@/lib/utils/textUtils';
import DatabaseService, { withDb } from '@lib/next/services/DatabaseService';

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

export const getCampaignsByGmId = async (id: string) => {
  if (!id) return [] as any;

  return await withDb(async () => {
    const response = await DatabaseService.campaign.findMany({
      where: {
        gms: {
          has: id
        }
      }
    });

    return response ?? [] as any;
  });
}

export const getCampaignsByPlayerId = async (id: string) => {
  if (!id) return [] as any;
  
  return await withDb(async () => {
    // Use a JOIN query to get campaigns directly from the characters
    const response = await DatabaseService.$queryRaw<any[]>`
      SELECT DISTINCT c.*
      FROM "Campaign" c
      INNER JOIN "Character" ch ON c.id = ch.campaign_id
      WHERE ch.player = ${id}
      ORDER BY c.name ASC
    `;
    
    return response ?? [] as any;
  });
}

export const createCampaign = async (campaignData: any): Promise<any> => {
  if (!campaignData?.name) {
    throw new Error('Campaign name is required');
  }

  try {
    // Generate a unique ID and slug for the campaign
    const id = randomUUID();
    const slug = slugify(campaignData.name);
    
    // Check if a campaign with this slug already exists
    const existingCampaign = await getCampaignBySlug(slug);
    if (existingCampaign?.id) {
      throw new Error('A campaign with this name already exists');
    }
    
    // Create the campaign data object
    const campaignCreateData = {
      id,
      name: campaignData.name,
      slug,
      system: campaignData.system || 'D&D 5E',
      active: campaignData.active !== undefined ? campaignData.active : true,
      gms: campaignData.gms || []
    };
    
    console.log('Creating campaign with data:', campaignCreateData);
    
    // Create the campaign in the database
    const newCampaign = await DatabaseService.campaign.create({
      data: campaignCreateData
    });
    
    console.log('Campaign created successfully:', newCampaign);
    return newCampaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}