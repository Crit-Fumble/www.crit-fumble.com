"use client";

import Dnd5ePartyRoster from "@/views/components/blocks/Dnd5ePartyRoster";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

const PageInner = ({ ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <Dnd5ePartyRoster {...props} />
    </div>
  )
}

const Page = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <PageInner {...props} />
    </SessionProvider>
  );
};

export default Page;
