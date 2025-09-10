"use server";

import { getCharacterPageProps } from "@crit-fumble/next/controllers/Character/CharacterController";
import CharacterDashboard from "../../../../next/client/views/Character/CharacterDashboard";

const Page = async ({ params: {characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    character: { slug: characterSlug }
  });

  return (<CharacterDashboard {...props}/>);
};

export default Page;
