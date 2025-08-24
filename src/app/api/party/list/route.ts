import { getServerSession } from '@/services/AuthService';
import { getPartiesByPlayerId } from '@/services/GameSystem/Base/Party/PartyService';
import { NextResponse } from 'next/server';

// GET endpoint to list parties accessible to the current user
export async function GET() {
  const session = await getServerSession();

  // Verify authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch parties associated with the user
    const parties = await getPartiesByPlayerId(session.user.id);
    
    return NextResponse.json({ parties });
  } catch (error) {
    console.error('Error in parties list handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
