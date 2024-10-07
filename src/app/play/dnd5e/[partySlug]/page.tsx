"use server";

import { getPartyPageProps } from "@/controllers/party";
import Dnd5ePartyView from "@/views/pages/Dnd5e/Party";

const Page = async ({ params: { partySlug } }: any) => {
  const props = await getPartyPageProps({
    party: { slug: partySlug },
  });

  return (<Dnd5ePartyView {...props}/>);
};

export default Page;
