// TODO: we need to update this to link a user to their WorldAnvil account as well as their Discord account.
// TODO: all third party integrations are optional for the end user, but at least one is required for SSO and we must have an email address as well.
// TODO: allow users to have an array of characters; each may be a sheet from a third party platform, or a PDF uploaded by the user; each sheet should have some data attached to it regarding campaign, game master, and system


import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma.js';
import { User } from 'models';

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
