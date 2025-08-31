const SRD_API_URL_2024 = 'https://www.dnd5eapi.co/2024/';
const SRD_API_URL_2014 = 'https://www.dnd5eapi.co/2014/';

export const srdHandler = async (path: string) => {

  // TODO: check cfg compendium data first

  const apiPath = path.slice('/system/dnd5e/'.length);

  const rawResponse = await fetch(`${SRD_API_URL_2024}${apiPath}`);
  if (!rawResponse.ok) {
    const rawResponse2 = await fetch(`${SRD_API_URL_2014}${apiPath}`);
    if (!rawResponse2.ok) {
      throw new Error(`Failed to fetch data from D&D 5e SRD API: ${rawResponse2.statusText}`);
    }
    return (await rawResponse2?.json());
  }

  const response = (await rawResponse?.json());

  return response;
}