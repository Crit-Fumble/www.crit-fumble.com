import { getServerSession } from '@/services/AuthService';
import { getCharacterBySlug } from '@/services/GameSystem/Base/Character/CharacterService';
import { 
  getCharacterSheetById, 
  getCharacterSheetsByCharacterId,
  getCharacterSheetBySystem,
  createCharacterSheet,
  updateCharacterSheet,
  deleteCharacterSheet 
} from '@/services/GameSystem/Base/CharacterSheet/CharacterSheetService';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

/**
 * Get D&D5e character sheet page props
 */
export const getDnd5eCharacterSheetPageProps = async (characterSlug: string) => {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  try {
    // Get character by slug
    const character = await getCharacterBySlug(characterSlug) as any;
    if (!character) {
      console.error(`Character with slug '${characterSlug}' not found`);
      return { notFound: true };
    }

    // Check if user is authorized to view this character
    // (For now just check if user is the player or a GM of the campaign)
    if (character.player !== session?.user?.id) {
      const campaign = character.campaign;
      if (!campaign || !campaign.gms?.includes(session?.user?.id)) {
        console.error(`User ${session?.user?.id} is not authorized to view character ${characterSlug}`);
        return { notFound: true };
      }
    }

    // Get D&D5e game system ID (this would be a constant or from a configuration)
    const DND5E_SYSTEM_ID = 'dnd5e'; // Assuming this is the ID used in GameSystem table

    // Get the character's D&D5e sheet
    const dnd5eSheet = await getCharacterSheetBySystem(character.id || '', DND5E_SYSTEM_ID);

    return {
      character,
      characterSheet: dnd5eSheet,
      user: session.user,
    };
  } catch (error) {
    console.error('Error in getDnd5eCharacterSheetPageProps:', error);
    return { error };
  }
};

/**
 * Create or update D&D5e character sheet
 */
export const handleDnd5eCharacterSheetSubmission = async (request: Request) => {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { characterId, sheetData, sheetId } = data;

    // Verify the user has permission to update this character
    const character = await getCharacterBySlug(data.characterSlug) as any;
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (character.player !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get D&D5e game system ID
    const DND5E_SYSTEM_ID = 'dnd5e';

    // If sheetId is provided, update existing sheet
    if (sheetId) {
      const updatedSheet = await updateCharacterSheet(sheetId, {
        sheet_data: sheetData,
        // Update other fields as needed
      });
      
      return NextResponse.json({ success: true, characterSheet: updatedSheet });
    } 
    // Otherwise create new sheet
    else {
      const newSheet = await createCharacterSheet({
        character_id: characterId,
        game_system_id: DND5E_SYSTEM_ID,
        sheet_data: sheetData,
        summary: data.summary,
        description: data.description,
        is_primary: data.isPrimary !== false, // Default to true if not specified
      });
      
      return NextResponse.json({ success: true, characterSheet: newSheet });
    }
  } catch (error) {
    console.error('Error in handleDnd5eCharacterSheetSubmission:', error);
    return NextResponse.json({ error: 'Failed to save character sheet' }, { status: 500 });
  }
};

/**
 * Delete D&D5e character sheet
 */
export const handleDeleteDnd5eCharacterSheet = async (request: Request) => {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { sheetId, characterSlug } = data;

    if (!sheetId) {
      return NextResponse.json({ error: 'Sheet ID is required' }, { status: 400 });
    }

    // Verify the user has permission to delete this character sheet
    const character = await getCharacterBySlug(characterSlug) as any;
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (character.player !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the sheet to verify it belongs to this character
    const sheet = await getCharacterSheetById(sheetId);
    if (!sheet || sheet.character_id !== character?.id) {
      return NextResponse.json({ error: 'Sheet not found or does not belong to this character' }, { status: 404 });
    }

    await deleteCharacterSheet(sheetId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in handleDeleteDnd5eCharacterSheet:', error);
    return NextResponse.json({ error: 'Failed to delete character sheet' }, { status: 500 });
  }
};
