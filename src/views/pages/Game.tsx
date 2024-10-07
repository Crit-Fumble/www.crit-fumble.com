"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ user, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <a href="/game/satisfactory">Play Satisfactory</a>
    </div>
  )
}

const Page = ({ session }: any) => {
  const [iframeUrl, setIframeUrl] = useState()

  return (
    <SessionProvider session={session}>
      <PageInner />
    </SessionProvider>
  );
};

export default Page;
