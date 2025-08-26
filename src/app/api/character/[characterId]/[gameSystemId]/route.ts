/**
 * Character Sheet API - ID-based routes for game system specific character sheets
 * 
 * IMPORTANT: These routes use character ID for all operations on game system specific character sheets.
 * - GET: Retrieve character sheet data using characterId and gameSystemId 
 * - POST: Create/Update character sheet data using characterId and gameSystemId
 * - DELETE: Delete character sheet using characterId and gameSystemId
 *
 * Character ID must be used for all mutation operations (POST, DELETE) for character sheets
 * as it provides a stable identifier that won't change if the character's name/slug changes.
 *
 * The gameSystemId parameter determines which game system's sheet format is being used.
 * Currently supported: 'dnd5e'
 */
import { 
  handleDnd5eCharacterSheetSubmission, 
  handleDeleteDnd5eCharacterSheet 
} from '@lib/next/controllers/Character/Dnd5eCharacterSheetController';
import { NextRequest, NextResponse } from 'next/server';
import { getCharacterById } from '@/services/GameSystem/Base/Character/CharacterService';
import { Character } from '@lib/models/Character/Character';

export async function GET(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  // This would fetch a character's D&D5e sheet
  // Currently GET requests are handled by the page component in this app
  return new Response(JSON.stringify({ message: "Use page component for GET requests" }), {
    status: 400
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  // Create or update a character sheet
  // The controller will handle authorization and validation
  const characterId = params.characterId;
  
  // Check if characterId is valid
  const character = await getCharacterById(characterId);
  
  // Check if character exists
  if (!character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }
  
  // Add characterId to request for the controller
  const updatedRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    signal: request.signal
  });
  
  // Append characterId to the request object
  Object.defineProperty(updatedRequest, 'characterId', {
    value: characterId,
    writable: false
  });
  
  return handleDnd5eCharacterSheetSubmission(updatedRequest);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  // Delete a character sheet
  const characterId = params.characterId;
  
  // Check if characterId is valid
  const character = await getCharacterById(characterId);
  
  // Check if character exists
  if (!character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }
  
  // Add characterId to request for the controller
  const updatedRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    signal: request.signal
  });
  
  // Append characterId to the request object
  Object.defineProperty(updatedRequest, 'characterId', {
    value: characterId,
    writable: false
  });
  
  return handleDeleteDnd5eCharacterSheet(updatedRequest);
}
