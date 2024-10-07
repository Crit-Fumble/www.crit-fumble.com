"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ user, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center">
      <div className="flex flex-row align-middle items-center">
        <a href="/play/dnd5e">Play D&D 5e</a>
      </div>
    </div>
  )
}

const Page = ({ session }: any) => {

  return (
    <SessionProvider session={session}>
      <PageInner />
    </SessionProvider>
  );
};

export default Page;
