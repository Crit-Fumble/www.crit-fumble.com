import { 
  handleDnd5eCharacterSheetSubmission, 
  handleDeleteDnd5eCharacterSheet 
} from '@/controllers/GameSystem/Dnd5e/Character/Dnd5eCharacterSheetController';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { characterSlug: string } }
) {
  // This would fetch a character's D&D5e sheet
  // Currently GET requests are handled by the page component in this app
  return new Response(JSON.stringify({ message: "Use page component for GET requests" }), {
    status: 400
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { characterSlug: string } }
) {
  // Create or update a character sheet
  // The controller will handle authorization and validation
  return handleDnd5eCharacterSheetSubmission(request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { characterSlug: string } }
) {
  // Delete a character sheet
  // The controller will handle authorization and validation
  return handleDeleteDnd5eCharacterSheet(request);
}
