import data from '../data/users';

export const getUser = async ( user: any ) => {
  let result = {};

  if (user?.id) {
    result = await getUserById(user?.id);
  }
  if (user?.slug) {
    result = await getUserById(user?.slug);
  }
  if (user?.name) {
    result = await getUserById(user?.name);
  }

  return result;
}

export const getUserBySlug = async ( slug: string ) => {
  if (!slug) return {};
  const response = data.find((user: any) => user?.slug === slug);

  return response ?? {};
}

export const getUserById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find((user: any) => user?.id === id);

  return response ?? {};
}
export const getUserByDiscordId = async ( discordId: string ) => {
  if (!discordId) return {};

  const response = data.filter((user: any) => user?.discord?.id === discordId);

  return response ?? {};
}

export const getUserByDiscordName = async ( discordName: string ) => {
  if (!discordName) return {};

  const response = data.find((user: any) => user?.discord?.name === discordName);

  return response ?? {};
}
