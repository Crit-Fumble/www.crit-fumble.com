"use server";

import { getCharacterPageProps } from "@/controllers/character";
import Dnd5eShopView from "@/views/pages/Dnd5e/Shop";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eShopView {...props}/>);
};

export default Page;
