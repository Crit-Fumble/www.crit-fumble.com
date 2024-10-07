import data from './data/players';

export const getPlayer = async ( player: any ) => {
  let result = {};

  if (player?.id) {
    result = await getPlayerById(player?.id);
  }
  if (player?.slug) {
    result = await getPlayerById(player?.slug);
  }
  if (player?.name) {
    result = await getPlayerById(player?.name);
  }

  return result;
}

export const getPlayerBySlug = async ( slug: string ) => {
  if (!slug) return {};
  const response = data.find((player: any) => player?.slug === slug);

  return response ?? {};
}

export const getPlayerById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find((player: any) => player?.id === id);

  return response ?? {};
}
export const getPlayerByDiscordId = async ( discordId: string ) => {
  if (!discordId) return {};

  const response = data.filter((player: any) => player?.discord?.id === discordId);

  return response ?? {};
}

export const getPlayerByDiscordName = async ( discordName: string ) => {
  if (!discordName) return {};

  const response = data.find((player: any) => player?.discord?.name === discordName);

  return response ?? {};
}
