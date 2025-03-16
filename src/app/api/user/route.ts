import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/services/AuthService";
import { getCharactersByPlayerId } from "@/services/CharacterService";
import { getCampaignsByGmId, getCampaignsByPlayerId } from "@/services/CampaignService";
import { getPartiesByPlayerId } from "@/services/PartyService";
import { Session } from "next-auth";
import prisma from "@/services/DatabaseService";
import { withDb } from "@/services/DatabaseService";

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching user data including characters, campaigns, and parties");
    
    // Get the session using the getServerSession helper
    const session = await getServerSession() as Session;
    
    console.log("API: Session data:", JSON.stringify({
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id
    }, null, 2));
    
    if (!session || session.user?.id === undefined || session.user?.id === null) {
      console.log("API: No authenticated user found or missing user ID");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log(`API: Found user ID: ${userId}, fetching data...`);
    
    // Use withDb to manage database connections
    const userData = await withDb(async () => {
      try {
        console.log(`API: Fetching user record for ID: ${userId}`);
        
        // First, try to find the UserDiscord record
        const discordUser = await prisma.userDiscord.findUnique({
          where: { id: userId }
        });
        
        if (!discordUser) {
          console.log(`API: No Discord user record found for ID: ${userId}`);
          // Return basic user data from session if no Discord record exists
          return {
            user: session.user,
            characters: [],
            campaigns: [],
            parties: []
          };
        }
        
        console.log(`API: Found Discord user record:`, JSON.stringify(discordUser, null, 2));
        
        // Now find the User record that links to this Discord profile
        const userRecord = await prisma.user.findFirst({
          where: { discord: discordUser.id }
        });
        
        if (!userRecord) {
          console.log(`API: No User record found linked to Discord ID: ${discordUser.id}`);
          // Return basic user data with Discord info
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
        
        console.log(`API: Found main User record:`, JSON.stringify(userRecord, null, 2));
        
        // Fetch Discord profile information if available
        let discordProfile = discordUser;  // We already have the Discord profile
        
        // Fetch all user data in parallel for better performance
        const [characters, campaignsAsGm, parties] = await Promise.all([
          getCharactersByPlayerId(userRecord.id),  // Use the database User ID, not the Discord ID
          getCampaignsByGmId(userRecord.id),
          getPartiesByPlayerId(userRecord.id)
        ]);
        
        console.log(`API: Fetched ${characters.length} characters, ${campaignsAsGm.length} campaigns as GM, ${parties.length} parties`);
        
        // Combine and deduplicate campaigns
        const campaignMap = new Map();
        [...campaignsAsGm, ...parties].forEach(campaign => {
          if (!campaignMap.has(campaign.id)) {
            campaignMap.set(campaign.id, {
              ...campaign,
              isGm: campaignsAsGm.some((c: { id: string }) => c.id === campaign.id)
            });
          }
        });
        const campaigns = Array.from(campaignMap.values());
        
        console.log(`API: Combined campaigns: ${campaigns.length}`);
        
        return {
          user: {
            ...userRecord,         // Database user record (includes slug, etc)
            ...session.user,       // Session data (includes image URL, name)
            discord: discordProfile // Discord profile data
          },
          characters,
          campaigns,
          parties
        };
      } catch (error) {
        console.error("Error fetching user record or Discord profile:", error);
        // Return basic user data from session if error occurs
        return {
          user: session.user,
          characters: [],
          campaigns: [],
          parties: []
        };
      }
    });
    
    // Return all the data
    console.log("API: Returning user data");
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
