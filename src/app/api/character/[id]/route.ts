import { updateCharacterHandler, deleteCharacterHandler } from "@/controllers/CharacterController";
import { NextRequest } from "next/server";

// PUT endpoint to update an existing character
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateCharacterHandler(request, { params });
}

// DELETE endpoint to delete a character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteCharacterHandler(request, { params });
}
