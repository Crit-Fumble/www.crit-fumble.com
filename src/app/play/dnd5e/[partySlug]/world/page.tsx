"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import WorldView from "@/views/pages/World/View";

const Page = async ({ params: { partySlug } }: any) => {
  const props = await getWorldViewPageProps({
    party: { slug: partySlug },
  });

  return (<WorldView {...props}/>);
};

export default Page;
