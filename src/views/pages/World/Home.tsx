"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ world, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center">
      <div>
        <h1>Worlds</h1>
        <p>WIP</p>
      </div>
    </div>
  )
}

const Page = ({ session, ...props }: any) => {
  const [iframeUrl, setIframeUrl] = useState()

  return (
    <SessionProvider session={session}>
      <PageInner {...props} />
    </SessionProvider>
  );
};

export default Page;
