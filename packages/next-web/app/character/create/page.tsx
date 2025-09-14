"use server";

import { getServerSession } from '../../../../next/services/AuthService';
import { redirect } from 'next/navigation';
import CharacterCreateView from '../../../../next/client/views/Character/CharacterCreateView';

const Page = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // Redirect to login if user is not authenticated
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent('/character/create')}`);
  }

  return (
    <CharacterCreateView session={session} />
  );
};

export default Page;
