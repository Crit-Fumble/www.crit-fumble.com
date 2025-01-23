"use server";

import { getCharacterPageProps } from "@/controllers/CharacterController";
import Dnd5eDowntimeView from "@/views/pages/Dnd5e/Player/Downtime";

const Page = async ({ params: {partySlug, characterSlug} }: any) => {
  const props = await getCharacterPageProps({
    party: { slug: partySlug },
    character: { slug: characterSlug }
  });

  return (<Dnd5eDowntimeView {...props}/>);
};

export default Page;
