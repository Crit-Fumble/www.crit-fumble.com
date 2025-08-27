import { User, Character, Campaign } from '@cfg/models';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

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
 * Fetch user campaigns
 */
export async function getUserCampaigns(userId: string): Promise<Campaign[]> {
  // Implementation depends on your actual schema relationships
  // This is just a placeholder based on common patterns
  const campaigns = await prisma.$queryRaw`
    SELECT c.*
    FROM "Campaign" c
    JOIN "CampaignParticipant" cp ON c.id = cp.campaign_id
    WHERE cp.user_id = ${userId}
  `;

  return campaigns as Campaign[];
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
  campaigns: Campaign[];
  characters: Character[];
}> {
  const user = await getUserById(userId);
  
  if (!user) {
    return {
      user: null,
      campaigns: [],
      characters: []
    };
  }

  // Fetch related data in parallel for better performance
  const [campaigns, characters] = await Promise.all([
    getUserCampaigns(user.id),
    getUserCharacters(user.id)
  ]);

  return {
    user,
    campaigns,
    characters
  };
}
