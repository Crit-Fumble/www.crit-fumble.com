"use client";

import Dnd5ePartyRoster from "@lib/components/blocks/CampaignView";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@lib/next/controllers/providers";

const PartyHomeInner = ({ ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <Dnd5ePartyRoster {...props} />
    </div>
  )
}

const PartyHome = ({ session, ...props }: any) => {

  return (
    <Providers session={session}>
      <PartyHomeInner {...props} />
    </Providers>
  );
};

export default PartyHome;
