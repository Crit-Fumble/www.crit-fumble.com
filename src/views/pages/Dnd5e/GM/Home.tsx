"use client";

import Dnd5ePartyRoster from "@/views/components/blocks/Dnd5ePartyRoster";
import Dnd5eGmView from "@/views/components/blocks/Dnd5eGmView";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

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
    <SessionProvider session={session}>
      <PageInner {...props} />
    </SessionProvider>
  );
};

export default Page;
