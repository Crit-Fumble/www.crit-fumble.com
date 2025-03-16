"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@/controllers/providers";

const PageInner = ({ player, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: '100vw',
        }} src={`https://5etools.crit-fumble.com/`} />
      </div>
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
