import { NextRequest } from "next/server";
import { getServerSession } from "./auth";

const API_URL = 'https://www.dnd5eapi.co/';

export const handler = async (path: string) => {

  // TODO: check cfg data first

  const apiPath = path.slice('/play/dnd5e/'.length);

  console.log(apiPath);

  const rawResponse = await fetch(`${API_URL}${apiPath}`);

  const response = (await rawResponse?.json());

  // TODO: merge CFG data into list and modify results

  return response;
}