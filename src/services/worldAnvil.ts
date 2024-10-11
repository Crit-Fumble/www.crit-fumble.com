"use server";
import campaigns from '../data/campaigns';
import { worldAnvil as config} from '@/services/config';

type WorldAnvilId = string;
type Granularity = -1 | 0 | 1 | 2 | number;

// https://www.worldanvil.com/api/external/boromir/documentation
// https://www.worldanvil.com/api/external/boromir/swagger-documentation

const headers = {
  'x-application-key': config.key ?? '',
  'x-auth-token': config.token ?? '',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
////////////////////////////////////////////////////////////////////////////////
// User
////////////////////////////////////////////////////////////////////////////////
export const getIdentity = async(id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/identity?id=${id}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const getUserById = async(id: WorldAnvilId, granularity: Granularity = 1) => {
  const rawResponse = await fetch(`${config.endpoint}/user?id=${id}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const patchUserById = async(id: WorldAnvilId, user: any) => {
  const rawResponse = await fetch(`${config.endpoint}/user?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(user),
    headers,
  });

  const response = rawResponse?.json();

  return response;
};

////////////////////////////////////////////////////////////////////////////////
// RPG Systems
////////////////////////////////////////////////////////////////////////////////
// TODO: get
// TODO: post

////////////////////////////////////////////////////////////////////////////////
// Worlds
////////////////////////////////////////////////////////////////////////////////
export const getWorld = async (world: any, granularity: Granularity = -1) => getWorldById(world?.id, granularity);
export const getWorldBySlug = async (slug: string, granularity: Granularity = -1) => {
  const campaign = campaigns.find(campaign => campaign?.worldAnvil?.slug == slug);

  if (!campaign?.worldAnvil?.id) {
    return;
  }

  return getWorldById(campaign.worldAnvil.id, granularity);
};
export const getWorldById = async(id: WorldAnvilId, granularity: Granularity = -1) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}&granularity=${granularity}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const putWorld = async(world: any) => {
  const rawResponse = await fetch(`${config.endpoint}/world`, {
    method: 'PUT',
    body: JSON.stringify(world),
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const patchWorldById = async(id: WorldAnvilId, world: any) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(world),
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const deleteWorldById = async(id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'DELETE',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};

////////////////////////////////////////
// Block Folders
export const getBlocksByBlockFolderId = async (id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/blockfolder/blocks?id=${id}`, {
    method: 'POST',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const getBlockFoldersByWorldId = async (id: WorldAnvilId, granularity: number = 1) => {

  const rawResponse = await fetch(`${config.endpoint}/world/blockfolders?id=${id}&granularity=${granularity}`, {
    method: 'POST',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
// Blocks
export const getBlockById = async (id: WorldAnvilId, granularity: number = 1) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}&granularity=${granularity}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const putBlock = async (block:any) => {
  const rawResponse = await fetch(`${config.endpoint}/block`, {
    method: 'PUT',
    body: JSON.stringify(block),
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const patchBlockById = async (id: WorldAnvilId, block:any) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(block),
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const deleteBlockById = async (id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}`, {
    method: 'DELETE',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
////////////////////////////////////////
// Subscriber Groups

////////////////////////////////////////
// Variable Collections

// Variables
////////////////////////////////////////
// Secrets

////////////////////////////////////////
// Notebooks

// Note Sections

// Notes
////////////////////////////////////////
// Images

// export const getWorldHandler = async (path: string) => {
//   const session = await getServerSession();
//   if (!session) {
//     return new Response('No Soup for You!', { status: 401 });
//   }
//   const apiPath = path.slice('/play/dnd5e/world/'.length);
//   const response = await fetch(`${config.endpoint}${apiPath}`);

//   // TODO: merge CFG data into list and modify results

//   return response;
// }