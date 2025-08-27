import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/services/AuthService';
import prisma from '@/services/DatabaseService';

export async function POST(request: Request) {
  // Check authentication
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const characterId = searchParams.get('characterId');
    const uploadType = searchParams.get('type') || 'pdf'; // Default to 'pdf' if not specified
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    if (!characterId) {
      return NextResponse.json({ error: 'Character ID is required' }, { status: 400 });
    }

    // Get file data from request
    const file = await request.blob();
    
    // Validate file type based on upload type
    if (uploadType === 'pdf' && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed for character sheets' }, { status: 400 });
    }
    
    if ((uploadType === 'portrait' || uploadType === 'token') && 
        !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed for character portraits and tokens' }, { status: 400 });
    }

    // Generate folder path based on upload type
    let folderPath = '';
    switch(uploadType) {
      case 'portrait':
        folderPath = 'character-portraits';
        break;
      case 'token':
        folderPath = 'character-tokens';
        break;
      default: // pdf
        folderPath = 'character-sheets';
    }
    
    // Generate a unique filename based on character ID and current timestamp
    const uniqueFilename = `${folderPath}/${characterId}/${Date.now()}-${filename}`;
    
    // Upload to Vercel Blob Storage
    // The third parameter sets the access level to 'public' so the file can be viewed directly
    const blob = await put(uniqueFilename, file, { access: 'public' });

    // Update the character record in the database with the new URL
    if (uploadType === 'portrait' || uploadType === 'token') {
      const fieldToUpdate = uploadType === 'portrait' ? 'portrait_url' : 'token_url';
      
      await prisma.character.update({
        where: { id: characterId },
        data: {
          [fieldToUpdate]: blob.url
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      type: uploadType
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
