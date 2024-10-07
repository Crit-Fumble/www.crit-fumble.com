"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, characters, compendium, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col">
      {compendium?.['rule-sections']?.results?.map((section: any) => (
        <div>
          <h2>{section.name}</h2>
          <p>{section.desc}</p>
        </div>
      ))}
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
