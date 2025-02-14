import data from '../data/users';
// import DatabaseService from './DatabaseService';

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
// export const getUserBySlug = async ( slug: string ) => {
//   if (!slug) return {};
 
//   const response = await DatabaseService.user.findFirst({
//     where: {
//       slug: slug
//     }
//   })

//   console.log('getUserBySlug', response);

//   return response ?? {};
// }

export const getUserById = async ( id: string ) => {
  if (!id) return {};
  const response = data.find((user: any) => user?.id === id);

  return response ?? {};
}
// export const getUserById = async ( id: string ) => {
//   if (!id) return {};
 
//   const response = await DatabaseService.user.findFirst({
//     where: {
//       id: id
//     }
//   })

//   console.log('getUserById', response);

//   return response ?? {};
// }

export const getUserByDiscordId = async ( discordId: string ) => {
  if (!discordId) return {};

  const response = data.find((user: any) => user?.discord?.id === discordId);

  return response ?? {};
}
// export const getUserByDiscordId = async ( discordId: string ) => {
//   if (!discordId) return {};

//   const response = await DatabaseService.user.findFirst({
//     where: {
//       discord: discordId
//     }
//   })

//   console.log('getUserByDiscordId', response);

//   return response ?? {};
// }


export const getUserByDiscordName = async ( discordName: string ) => {
  if (!discordName) return {} as any;

  const response = data.find((user: any) => user?.discord?.name === discordName);

  return response ?? {} as any;
}
// export const getUserByDiscordName = async ( discordName: string ) => {
//   if (!discordName) return {} as any;

//   const userDiscord = await DatabaseService.userDiscord.findFirst({
//     where: {
//       name: discordName
//     },
//   })

//   console.log('getUserByDiscordName', discordName, userDiscord);

//   if (!userDiscord) return {} as any;

//   const response = getUserByDiscordId(userDiscord?.id);

//   return response ?? {} as any;
// }
