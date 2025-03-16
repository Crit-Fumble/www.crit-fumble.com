import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/services/AuthService";
import { getCharactersByPlayerId } from "@/services/CharacterService";
import { getCampaignsByGmId, getCampaignsByPlayerId } from "@/services/CampaignService";
import { getPartiesByPlayerId } from "@/services/PartyService";
import { Session } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching user data including characters, campaigns, and parties");
    const session = await getServerSession() as Session;
    console.log("API: Session data:", JSON.stringify({
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
    }));
    
    if (!session || !session.user?.id) {
      console.log("API: No authenticated user found");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Fetch all user data in parallel for better performance
    const [characters, campaignsAsGm, campaignsAsPlayer, parties] = await Promise.all([
      getCharactersByPlayerId(userId),
      getCampaignsByGmId(userId),
      getCampaignsByPlayerId(userId),
      getPartiesByPlayerId(userId)
    ]);
    
    // Combine and deduplicate campaigns
    const campaignMap = new Map();
    [...campaignsAsGm, ...campaignsAsPlayer].forEach(campaign => {
      if (!campaignMap.has(campaign.id)) {
        campaignMap.set(campaign.id, {
          ...campaign,
          isGm: campaignsAsGm.some((c: { id: string }) => c.id === campaign.id)
        });
      }
    });
    const campaigns = Array.from(campaignMap.values());
    
    console.log(`API: Found ${characters.length} characters, ${campaigns.length} campaigns, ${parties.length} parties`);
    
    return NextResponse.json({
      characters,
      campaigns,
      parties,
      user: session.user
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
