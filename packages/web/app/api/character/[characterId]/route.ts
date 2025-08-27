/**
 * Character API - ID-based routes
 * 
 * IMPORTANT: These routes use character ID for all operations.
 * - GET: Retrieve character data using characterId
 * - POST: Create/Update base character data using characterId 
 * - PATCH: Update character data using characterId
 * - DELETE: Delete character using characterId
 *
 * Character ID must be used for mutation operations (POST, PATCH, DELETE)
 * as it provides a stable identifier that won't change if the character's
 * name or other properties are updated.
 */
import { createCharacterHandler, deleteCharacterHandler, getCharacterHandler, updateCharacterHandler } from '@cfg/next/controllers/Character/CharacterController';
import { NextRequest, NextResponse } from 'next/server';
import { Character } from '@cfg/models/Character/Character';
import { getServerSession } from '@cfg/next/services/AuthService';

export async function GET(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {  // Verify authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return getCharacterHandler({ id: params.characterId });
  } catch (error) {
    console.error('Error getting character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {
    // Create or update a character sheet
    // The controller will handle authorization and validation
    const characterId = params.characterId;
  
    // Check if characterId is valid
    const character = await getCharacterHandler({ id: characterId });
  
    // Check if character exists
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Parse the request body to get character data
    const characterData = await request.json();
    
    // Add the character ID to the data
    characterData.id = characterId;
    
    // Log the received data for debugging
    console.log('Character update received:', characterData);
  
    // Call the update handler with the character data
    return updateCharacterHandler(characterData);
  } catch (error) {
    console.error('Error in POST character handler:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { character: Character } }
) {
  try {  // Verify authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return updateCharacterHandler(params.character);
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {  // Verify authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return deleteCharacterHandler(params.characterId);
  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

