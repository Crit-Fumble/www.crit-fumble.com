"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ gamer, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div className="flex flex-row align-middle items-center">
        <a href="/game/satisfactory/map">View Map</a>
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
