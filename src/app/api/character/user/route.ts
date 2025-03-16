import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/services/AuthService";
import { getCharactersByPlayerId } from "@/services/CharacterService";

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching user characters");
    const session = await getServerSession();
    console.log("API: Session data:", JSON.stringify({
      hasSession: !!session,
      hasUser: !!session?.user,
      hasProfile: !!session?.user,
      profileId: session?.user?.id,
      characters: 0, // Will be populated after query
    }));
    
    if (!session || !session.user?.id) {
      console.log("API: No authenticated user found");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log(`API: Fetching characters for user ID: ${userId}`);
    const characters = await getCharactersByPlayerId(userId);
    console.log(`API: Found ${characters.length} characters:`, 
      characters.map((char: any) => ({ id: char.id, name: char.name, slug: char.slug }))
    );
    
    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Error fetching user characters:", error);
    return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
  }
}
