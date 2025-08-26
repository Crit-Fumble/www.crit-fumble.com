"use server";

import { getCharacterPageProps } from "@lib/next/controllers/Character/CharacterController";
import CharacterDashboard from "@/views/GameSystem/Base/Character/CharacterDashboard";

const Page = async ({ params: {characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    character: { slug: characterSlug }
  });

  return (<CharacterDashboard {...props}/>);
};

export default Page;
