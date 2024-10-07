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
        <a href="/gm/dnd5e">GM D&D 5e</a>
      </div>
    </div>
  )
}

const Page = ({ session }: any) => {
  const [iframeUrl, setIframeUrl] = useState()

  return (
    <SessionProvider session={session}>
      <PageInner iframeUrl={iframeUrl} />
    </SessionProvider>
  );
};

export default Page;
