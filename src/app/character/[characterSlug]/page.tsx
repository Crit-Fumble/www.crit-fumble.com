"use server";

import { getCharacterPageProps } from "@/controllers/GameSystem/Base/Character/CharacterController";
import CharacterDashboard from "@/views/GameSystem/Dnd5e/Character/CharacterDashboard";

const Page = async ({ params: {characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    character: { slug: characterSlug }
  });

  return (<CharacterDashboard {...props}/>);
};

export default Page;
