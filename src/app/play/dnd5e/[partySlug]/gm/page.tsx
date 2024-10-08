"use server";

import { getPartyPageProps } from "@/controllers/party";
import Dnd5eGmView from "@/views/pages/Dnd5e/GM/Home";

const Page = async ({ params: { partySlug } }: any) => {
  const props = await getPartyPageProps({
    party: { slug: partySlug },
  });

  return (<Dnd5eGmView {...props} />);
};

export default Page;

