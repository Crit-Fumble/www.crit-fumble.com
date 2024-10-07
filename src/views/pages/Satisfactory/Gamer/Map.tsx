"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ gamer, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <iframe style={{height: 'calc(100vh - 92px)'}} className="w-[100vw]" src="https://satisfactory-calculator.com/en/interactive-map" />
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
