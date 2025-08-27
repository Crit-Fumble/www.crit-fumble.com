import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@cfg/next/services/AuthService";
import { getCharactersByPlayerId } from "@cfg/next/services/GameSystem/Base/Character/CharacterService";
import { getCampaignsByGmId, getCampaignsByPlayerId } from "@cfg/next/services/GameSystem/Base/Campaign/CampaignService";
import { getPartiesByPlayerId } from "@cfg/next/services/GameSystem/Base/Party/PartyService";
import { Session } from "next-auth";
import prisma from "@cfg/next/services/DatabaseService";
import { withDb } from "@cfg/next/services/DatabaseService";
import { DndBeyondService } from "@cfg/next/services/GameSystem/Dnd5e/Player/DndBeyondPlayerService";
import createLogger from "@cfg/utils/logger";

const logger = createLogger('api:user');

// Type for updating user information
type UpdateUserData = {
  roll20?: string;
  dd_beyond?: string;
  world_anvil?: string;
};

// Configure this route as dynamic to prevent static rendering errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the session using the getServerSession helper
    const session = await getServerSession() as Session;
    
    if (!session || session.user?.id === undefined || session.user?.id === null) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Use withDb to manage database connections
    const userData = await withDb(async () => {
      try {
        // Use a raw SQL query to get both the Discord user and main user record in a single query
        // This avoids the separate queries Prisma might be generating with the relational approach
        // Define a type for our raw query results
        type UserQueryResult = {
          id: string;
          name: string;
          user_id?: string;
          user_name?: string;
          slug?: string;
          user_email?: string;
          user_image?: string;
          createdAt?: Date;
          updatedAt?: Date;
          admin?: boolean;
          roll20?: string;
          dd_beyond?: string;
          world_anvil?: string;
          sheet_data?: any;
          [key: string]: any; // For other Discord user fields
        };
        
        const userResults = await prisma.$queryRaw<UserQueryResult[]>`
          SELECT 
            d.*, 
            u.id as user_id, 
            u.name as user_name, 
            u.slug, 
            u.email as user_email, 
            u.image as user_image, 
            u."createdAt", 
            u."updatedAt",
            u.admin,
            u.roll20,
            u.dd_beyond,
            u.world_anvil,
            u.sheet_data
          FROM "UserDiscord" d
          LEFT JOIN "User" u ON d.id = u.discord
          WHERE d.id = ${userId}
          LIMIT 1
        `;
        
        logger.debug('User query results:', userResults);
        
        // Handle case where Discord user doesn't exist
        if (!userResults || userResults.length === 0) {
          logger.info(`No Discord user found with ID: ${userId}`);
          return {
            user: session.user,
            characters: [],
            campaigns: [],
            parties: []
          };
        }
        
        const discordUser = userResults[0];
        const userRecord = discordUser.user_id ? {
          id: discordUser.user_id,
          name: discordUser.user_name,
          slug: discordUser.slug,
          email: discordUser.user_email,
          image: discordUser.user_image,
          createdAt: discordUser.createdAt,
          updatedAt: discordUser.updatedAt,
          admin: discordUser.admin,
          discord: discordUser.id,
          roll20: discordUser.roll20,
          dd_beyond: discordUser.dd_beyond,
          world_anvil: discordUser.world_anvil,
          sheet_data: discordUser.sheet_data
        } : null;
        
        if (!userRecord) {
          logger.info(`No main User record found for Discord ID: ${userId}`);
          return {
            user: {
              ...session.user,
              discord: discordUser
            },
            characters: [],
            campaigns: [],
            parties: []
          };
        }
        
        // Fetch all user data in parallel for better performance
        const [characters, campaignsAsGm, parties] = await Promise.all([
          userRecord ? getCharactersByPlayerId(userRecord.id) : [],  // Use the database User ID, not the Discord ID
          userRecord ? getCampaignsByGmId(userRecord.id) : [],
          userRecord ? getPartiesByPlayerId(userRecord.id) : []
        ]);
        
        // Ensure campaignsAsGm and parties are arrays before spreading
        const campaignsArray = Array.isArray(campaignsAsGm) ? campaignsAsGm : [];
        const partiesArray = Array.isArray(parties) ? parties : [];
        
        // Combine and deduplicate campaigns
        const campaignMap = new Map();
        [...campaignsArray, ...partiesArray].forEach(campaign => {
          if (!campaignMap.has(campaign.id)) {
            campaignMap.set(campaign.id, {
              ...campaign,
              isGm: campaignsAsGm.some((c: { id: string }) => c.id === campaign.id)
            });
          }
        });
        const campaigns = Array.from(campaignMap.values());
        
        return {
          user: {
            ...userRecord,         // Database user record (includes slug, etc)
            ...session.user,       // Session data (includes image URL, name)
            discord: discordUser   // Discord profile data
          },
          characters,
          campaigns: Array.from(campaignMap.values()),
          parties
        };
      } catch (error) {
        logger.error("Error fetching user data:", error);
        // Return basic user data from session if error occurs
        return {
          user: session.user,
          characters: [],
          campaigns: [],
          parties: []
        };
      }
    });
    
    // Return all the data with cache headers
    return NextResponse.json(userData, {
      headers: {
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes on client
        'Vary': 'Cookie' // Vary cache by cookies (session)
      }
    });
  } catch (error) {
    logger.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    logger.info("Updating user information");
    
    // Get the session using the getServerSession helper
    const session = await getServerSession() as Session;
    
    if (!session || !session.user?.id) {
      logger.warn("No authenticated user found for update request");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Parse and validate request body
    let updateData: UpdateUserData;
    try {
      updateData = await request.json();
      
      // Validate that at least one field is being updated
      if (!updateData.roll20 && !updateData.dd_beyond && !updateData.world_anvil) {
        return NextResponse.json(
          { error: "At least one field (roll20, dd_beyond, or world_anvil) must be provided" },
          { status: 400 }
        );
      }
    } catch (error) {
      logger.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    // Use withDb to manage database connections
    const updatedUser = await withDb(async () => {
      try {
        // First find the user by their discord ID
        const discordUser = await prisma.userDiscord.findUnique({
          where: { id: userId }
        });
        
        if (!discordUser) {
          throw new Error("Discord user not found");
        }
        
        // Find the main user record
        const user = await prisma.user.findFirst({
          where: { discord: userId }
        });
        
        if (!user) {
          throw new Error("User not found");
        }
        
        // Prepare the update data
        const updatePayload: any = {
          updatedAt: new Date()
        };

        // Handle roll20 update if provided
        if (updateData.roll20 !== undefined) {
          updatePayload.roll20 = updateData.roll20;
        }

        // Handle D&D Beyond update if provided
        if (updateData.dd_beyond !== undefined) {
          // Use DndBeyondService to handle the D&D Beyond user creation and linking
          await DndBeyondService.linkDndBeyondAccount(user.id, updateData.dd_beyond);
          updatePayload.dd_beyond = updateData.dd_beyond;
        } else if (updateData.dd_beyond === '') {
          // Handle D&D Beyond account removal
          await DndBeyondService.unlinkDndBeyondAccount(user.id);
          updatePayload.dd_beyond = null;
        }

        // Handle World Anvil update if provided
        if (updateData.world_anvil !== undefined) {
          updatePayload.world_anvil = updateData.world_anvil;
        }

        // Update the user with the prepared data
        return await prisma.user.update({
          where: { id: user.id },
          data: updatePayload,
          select: {
            id: true,
            roll20: true,
            dd_beyond: true,
            world_anvil: true,
            updatedAt: true
          }
        });
      } catch (error) {
        logger.error("Error updating user:", error);
        throw error;
      }
    });
    
    logger.info("API: Successfully updated user information");
    return NextResponse.json(updatedUser);
    
  } catch (error) {
    logger.error("Error in user update:", error);
    return NextResponse.json(
      { error: "Failed to update user information" },
      { status: 500 }
    );
  }
}
