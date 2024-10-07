"use server";

import { getCharacterPageProps } from "@/controllers/character";
import Dnd5eTravelView from "@/views/pages/Dnd5e/Player/Travel";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eTravelView {...props}/>);
};

export default Page;
