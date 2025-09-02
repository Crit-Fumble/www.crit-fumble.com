import { PrismaClient } from '@prisma/client';
import { prisma } from '../../models/database/prisma';
import { User } from 'models';

/**
 * Fetch user data by ID (which could be a database ID or a Discord ID)
 */
export async function getUserById(userId: string): Promise<User | null> {
  // Try to get user directly by ID
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserWorldAnvil: true // Include WorldAnvil data if available
    }
  });

  // If not found and it might be a Discord ID, look for user by Discord ID
  if (!user) {
    const discordUser = await prisma.userDiscord.findUnique({
      where: { id: userId }
    });

    if (discordUser) {
      user = await prisma.user.findFirst({
        where: { discord: discordUser.id },
      });
    }
  }

  // Also try to find by WorldAnvil ID if not found yet
  if (!user) {
    const worldAnvilUser = await prisma.userWorldAnvil.findUnique({
      where: { id: userId }
    });

    if (worldAnvilUser) {
      user = await prisma.user.findFirst({
        where: { world_anvil: worldAnvilUser.id },
        include: {
          UserWorldAnvil: true
        }
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
    where: { email },
    include: {
      UserWorldAnvil: true // Include WorldAnvil data if available
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
    user,
  };
}
