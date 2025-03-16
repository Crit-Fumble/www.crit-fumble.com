"use client";

import Dnd5ePartyRoster from "@lib/components/blocks/CampaignView";
import Dnd5eGmView from "@lib/components/blocks/GmView";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@/controllers/providers";

const PageInner = ({ ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);



  return (
    <div className="flex flex-col align-middle items-center">
      {/* {JSON.stringify(data, null, 2)} */}
      <Dnd5ePartyRoster {...props} />
      <Dnd5eGmView />
    </div>
  )
}

const Page = ({ session, ...props }: any) => {

  return (
    <Providers session={session}>
      <PageInner {...props} />
    </Providers>
  );
};

export default Page;
