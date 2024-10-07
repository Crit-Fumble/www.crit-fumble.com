"use server";

import { getCharacterPageProps } from "@/controllers/character";
import Dnd5eInitiativeView from "@/views/pages/Dnd5e/Initiative";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eInitiativeView {...props}/>);
};

export default Page;
