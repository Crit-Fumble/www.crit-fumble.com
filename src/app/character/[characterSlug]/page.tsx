"use server";

import { getCharacterPageProps } from "@/controllers/CharacterController";
import CharacterDashboard from "@/views/pages/Character/CharacterDashboard";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<CharacterDashboard {...props}/>);
};

export default Page;
