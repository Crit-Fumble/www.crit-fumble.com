"use server";

import { getCharacterPageProps } from "@/controllers/character";
import Dnd5eCharacterView from "@/views/pages/Dnd5e/Player/Character";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eCharacterView {...props}/>);
};

export default Page;
