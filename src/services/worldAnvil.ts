"use server";
import { worldAnvil as config} from '@/services/config';

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
