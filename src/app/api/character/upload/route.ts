import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/services/AuthService';

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
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    if (!characterId) {
      return NextResponse.json({ error: 'Character ID is required' }, { status: 400 });
    }

    // Generate a unique filename based on character ID and current timestamp
    const uniqueFilename = `character-sheets/${characterId}/${Date.now()}-${filename}`;
    
    // Get file data from request
    const file = await request.blob();
    
    // Validate file is a PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }
    
    // Upload to Vercel Blob Storage
    // The third parameter sets the access level to 'public' so the PDF can be viewed directly
    const blob = await put(uniqueFilename, file, { access: 'public' });

    return NextResponse.json({ 
      success: true, 
      url: blob.url
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
