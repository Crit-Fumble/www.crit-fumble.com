import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '../../../../../lib/auth';
import { prisma } from '@crit-fumble/core';
import SheetEditClient from './SheetEditClient';

export const metadata: Metadata = {
  title: 'Edit Character Sheet | Crit-Fumble Gaming',
  description: 'Edit your character sheet in World Anvil',
};

// This page uses dynamic features
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
    sheetId: string;
  };
}

export default async function SheetEditPage({ params }: PageProps) {
  // Get session
  const userData = await getSession();

  // Redirect to home if not logged in
  if (!userData) {
    redirect('/');
  }

  const { slug, sheetId } = params;

  // Fetch the sheet and verify ownership by slug
  const sheet = await prisma.rpgSheet.findUnique({
    where: { id: sheetId },
    include: {
      rpg_character: {
        select: {
          id: true,
          slug: true,
          user_id: true,
          name: true,
        },
      },
    },
  });

  if (!sheet) {
    redirect('/dashboard/player');
  }

  if (sheet.rpg_character?.slug !== slug) {
    redirect('/dashboard/player');
  }

  if (sheet.rpg_character?.user_id !== userData.userId) {
    redirect('/dashboard/player');
  }

  if (!sheet.worldanvil_block_id) {
    redirect(`/character/${slug}`);
  }

  return (
    <SheetEditClient
      sheet={{
        id: sheet.id as string,
        title: (sheet.title as string) || 'Untitled Sheet',
        worldanvil_block_id: sheet.worldanvil_block_id as string,
      }}
      character={{
        slug: (sheet.rpg_character.slug as string) || slug,
        name: (sheet.rpg_character.name as string) || 'Unnamed Character',
      }}
    />
  );
}
