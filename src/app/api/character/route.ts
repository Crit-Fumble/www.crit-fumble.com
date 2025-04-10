import { createCharacterHandler } from "@/controllers/CharacterController";
import { NextRequest } from "next/server";

// POST endpoint to create a new character
export async function POST(request: NextRequest) {
  return createCharacterHandler(request);
}
