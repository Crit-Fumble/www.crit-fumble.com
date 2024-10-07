"use server";

import { getCharacterPageProps } from "@/controllers/character";
import Dnd5eWorldView from "@/views/pages/Dnd5e/World";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eWorldView {...props}/>);
};

export default Page;
