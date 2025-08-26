import { createCampaign, getServerSession } from "@lib/next/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("API: Creating new campaign");
    
    // Check authentication and admin status
    const session = await getServerSession();
    console.log("API: Session data:", JSON.stringify({
      hasSession: !!session,
      hasUser: !!session?.user,
      hasProfile: !!session?.user,
      profileId: session?.user?.id,
      isAdmin: !!session?.user?.admin
    }));
    
    // Ensure user is authenticated and has admin privileges
    if (!session || session.user?.id == undefined || session.user?.id == null) {
      console.log("API: No authenticated user found");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (!session.user.admin) {
      console.log("API: User is not an admin");
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    
    // Parse the request body
    const campaignData = await request.json();
    console.log("API: Campaign data received:", campaignData);
    
    if (!campaignData.name) {
      console.log("API: Missing required fields");
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
    }
    
    // Add admin as a GM by default
    const adminId = session.user.id;
    campaignData.gms = [adminId];
    
    // Create the campaign
    try {
      const newCampaign = await createCampaign(campaignData);
      console.log("API: Campaign created successfully:", newCampaign);
      
      return NextResponse.json({ 
        message: "Campaign created successfully", 
        campaign: newCampaign 
      });
    } catch (error: any) {
      console.error("API: Error creating campaign:", error);
      return NextResponse.json({ 
        error: error.message || "Failed to create campaign" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in campaign creation API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
