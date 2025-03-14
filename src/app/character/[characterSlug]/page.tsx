"use server";

import { getCharacterPageProps } from "@/controllers/CharacterController";
import CharacterDashboard from "@/views/Character/CharacterDashboard";

const Page = async ({ params: {characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    character: { slug: characterSlug }
  });

  return (<CharacterDashboard {...props}/>);
};

export default Page;
