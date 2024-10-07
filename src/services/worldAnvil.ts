"use server";
import { worldAnvil as config} from '@/services/config';
import { getServerSession } from './auth';
import { NextRequest } from 'next/server';

type WorldAnvilId = string;
type Trinary = -1 | 0 | 1;

// https://www.worldanvil.com/api/external/boromir/documentation
// https://www.worldanvil.com/api/external/boromir/swagger-documentation#/

export const getWorld = async (world: any) => getWorldById(world?.id);

export const getWorldById = async(id: WorldAnvilId, granularity?: Trinary) => {
  const response = await fetch(`${config.endpoint}/world?id=${id}`, {
    method: 'GET',
    headers: {
      'x-application-key': config.key ?? '',
      'x-auth-token': config.token ?? '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
};

export const getWorldHandler = async (path: string) => {
  const session = await getServerSession();
  if (!session) {
    return new Response('No Soup for You!', { status: 401 });
  }

  // TODO: check cfg data first
  
  const apiPath = path.slice('/play/dnd5e/'.length);
  const response = await fetch(`${config.endpoint}${apiPath}`);

  // TODO: merge CFG data into list and modify results

  return response;
}