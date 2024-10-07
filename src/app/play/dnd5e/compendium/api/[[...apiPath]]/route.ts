import { getServerSession } from "@/controllers/auth";
import { NextRequest } from "next/server";


const API_URL = 'https://www.dnd5eapi.co/';

const handler = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    return new Response('No Soup for You!', { status: 401 });
  }

  // TODO: check cfg data first

  const path = req?.nextUrl?.pathname;
  const apiPath = path.slice('/play/dnd5e/'.length);
  const response = await fetch(`${API_URL}${apiPath}`);

  // TODO: merge CFG data into list and modify results

  return response;
}

export const GET = handler;
export const POST = handler;