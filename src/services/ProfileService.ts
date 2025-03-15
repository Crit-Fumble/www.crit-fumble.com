import DatabaseService from './DatabaseService';

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
  
  const response = await DatabaseService.user.findFirst({
    where: {
      slug: slug
    }
  })

  return response ?? {};
}

export const getUserById = async ( id: string ) => {
  if (!id) return {};

  const response = await DatabaseService.user.findFirst({
    where: {
      id: id
    }
  })

  return response ?? {};
}

export const getUserByDiscordId = async ( discordId: string ) => {
  if (!discordId) return {};

  const response = await DatabaseService.user.findFirst({
    where: {
      discord: discordId
    },
    include: {
      UserDiscord: true
    }
  })

  return response ?? {};
}


export const getUserByDiscordName = async ( discordName: string ) => {
  if (!discordName) return {} as any;

  const userDiscord = await DatabaseService.userDiscord.findFirst({
    where: {
      name: discordName
    },
  })

  if (!userDiscord) return {} as any;

  return getUserByDiscordId(userDiscord?.id);
}
