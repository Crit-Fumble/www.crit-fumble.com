import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma.js';
import { Character, User } from 'models';

/**
 * Fetch user data by ID (which could be a database ID or a Discord ID)
 */
export async function getUserById(userId: string): Promise<User | null> {
  // Try to get user directly by ID
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // If not found and it might be a Discord ID, look for user by Discord ID
  if (!user) {
    const discordUser = await prisma.userDiscord.findUnique({
      where: { id: userId }
    });

    if (discordUser) {
      user = await prisma.user.findFirst({
        where: { discord: discordUser.id }
      });
    }
  }

  return user;
}

/**
 * Fetch user data by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * Fetch user characters
 */
export async function getUserCharacters(userId: string): Promise<Character[]> {
  return prisma.character.findMany({
    where: {
      player: userId
    }
  });
}

/**
 * Fetch complete user data including related entities
 */
export async function getUserData(userId: string): Promise<{
  user: User | null;
}> {
  const user = await getUserById(userId);
  
  if (!user) {
    return {
      user: null,
    };
  }

  return {
    user
  };
}
