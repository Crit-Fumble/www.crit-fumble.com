const SRD_API_URL = 'https://www.dnd5eapi.co/';

export const srdHandler = async (path: string) => {

  // TODO: check cfg data first

  const apiPath = path.slice('/system/dnd5e/'.length);

  const rawResponse = await fetch(`${SRD_API_URL}${apiPath}`);

  const response = (await rawResponse?.json());

  // TODO: merge CFG data into list and modify results

  return response;
}