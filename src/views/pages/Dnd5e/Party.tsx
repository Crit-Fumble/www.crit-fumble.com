"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, campaign, party, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-row gap-2">
      <div>
        {JSON.stringify(player, null, 2)}
        {JSON.stringify(campaign, null, 2)}
        {JSON.stringify(party, null, 2)}
        {JSON.stringify(props, null, 2)}
      </div>
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
