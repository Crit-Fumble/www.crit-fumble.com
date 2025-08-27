// use WorldAnvilService.ts to communicate /w WorldAnvil; facilitates all World Anvil integration

// child classes may be derived from this one, for specific systems

"use server";
import { worldAnvil as config} from '@cfg-web/config/services';
import { getCampaignBySlug } from '../Campaign/CampaignService';

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
export const getWAIdentity = async(id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/identity?id=${id}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const getWAUserById = async(id: WorldAnvilId, granularity: Granularity = 1) => {
  const rawResponse = await fetch(`${config.endpoint}/user?id=${id}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const patchWAUserById = async(id: WorldAnvilId, user: any) => {
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
export const getWAWorld = async (world: any, granularity: Granularity = -1) => getWAWorldById(world?.id, granularity);
export const getWAWorldBySlug = async (slug: string, granularity: Granularity = -1) => {
  const campaign = await getCampaignBySlug(slug);

  if (!campaign?.worldAnvil?.id) {
    return;
  }

  return getWAWorldById(campaign.worldAnvil.id, granularity);
};
export const getWAWorldById = async(id: WorldAnvilId, granularity: Granularity = -1) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}&granularity=${granularity}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const putWAWorld = async(world: any) => {
  const rawResponse = await fetch(`${config.endpoint}/world`, {
    method: 'PUT',
    body: JSON.stringify(world),
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const patchWAWorldById = async(id: WorldAnvilId, world: any) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(world),
    headers,
  });

  const response = rawResponse?.json();

  return response;
};
export const deleteWAWorldById = async(id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'DELETE',
    headers,
  });

  const response = rawResponse?.json();

  return response;
};

////////////////////////////////////////
// Block Folders
export const getWABlocksByBlockFolderId = async (id: WorldAnvilId) => {
  const rawResponse = await fetch(`${config.endpoint}/blockfolder/blocks?id=${id}`, {
    method: 'POST',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const getWAWorldBlockFoldersByWorldId = async (id: WorldAnvilId, granularity: number = 1) => {

  const rawResponse = await fetch(`${config.endpoint}/world/blockfolders?id=${id}&granularity=${granularity}`, {
    method: 'POST',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
// Blocks
export const getWAWorldBlockById = async (id: WorldAnvilId, granularity: number = 1) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}&granularity=${granularity}`, {
    method: 'GET',
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const putWAWorldBlock = async (block:any) => {
  const rawResponse = await fetch(`${config.endpoint}/block`, {
    method: 'PUT',
    body: JSON.stringify(block),
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const patchWAWorldBlockById = async (id: WorldAnvilId, block:any) => {
  const rawResponse = await fetch(`${config.endpoint}/block?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify(block),
    headers,
  });

  const response = rawResponse?.json();

  return response;
}
export const deleteWAWorldBlockById = async (id: WorldAnvilId) => {
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