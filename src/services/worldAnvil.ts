"use server";
import campaigns from './data/campaigns';
import { worldAnvil as config} from '@/services/config';

type WorldAnvilId = string;
type Trinary = -1 | 0 | 1;

// https://www.worldanvil.com/api/external/boromir/documentation
// https://www.worldanvil.com/api/external/boromir/swagger-documentation#/

export const getWorld = async (world: any) => getWorldById(world?.id);

export const getWorldBySlug = async (slug: string) => {
  const campaign = campaigns.find(campaign => campaign?.worldAnvil?.slug == slug);

  if (!campaign?.worldAnvil?.id) {
    return;
  }

  return getWorldById(campaign.worldAnvil.id);
};

export const getWorldById = async(id: WorldAnvilId, granularity?: Trinary) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'GET',
    headers: {
      'x-application-key': config.key ?? '',
      'x-auth-token': config.token ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  const response = rawResponse?.json();

  return response;
};

export const getBlocksByBlockFolderId = async (id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/blockfolder/blocks?id=${id}`, {
    method: 'POST',
    headers: {
      'x-application-key': config.key ?? '',
      'x-auth-token': config.token ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  const response = rawResponse?.json();

  return response;
}

export const getBlockFoldersByWorldId = async (id: WorldAnvilId, granularity: number = 1) => {

  const rawResponse = await fetch(`${config.endpoint}/world/blockfolders?id=${id}&granularity=${granularity}`, {
    method: 'POST',
    headers: {
      'x-application-key': config.key ?? '',
      'x-auth-token': config.token ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  const response = rawResponse?.json();

  return response;
}

export const getBlockById = async (id: WorldAnvilId, granularity: number = 1) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}&granularity=${granularity}`, {
    method: 'GET',
    headers: {
      'x-application-key': config.key ?? '',
      'x-auth-token': config.token ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  const response = rawResponse?.json();

  return response;
}

// export const getWorldHandler = async (path: string) => {
//   const session = await getServerSession();
//   if (!session) {
//     return new Response('No Soup for You!', { status: 401 });
//   }

//   // TODO: check cfg data first

//   const apiPath = path.slice('/play/dnd5e/world/'.length);
//   const response = await fetch(`${config.endpoint}${apiPath}`);

//   // TODO: merge CFG data into list and modify results

//   return response;
// }