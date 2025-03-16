"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@/controllers/providers";

const WorldDashboardInner = ({ world, ...props }: any) => {
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

const WorldDashboardPage = ({ session, ...props }: any) => {
  const [iframeUrl, setIframeUrl] = useState()

  return (
    <Providers session={session}>
      <WorldDashboardInner {...props} />
    </Providers>
  );
};

export default WorldDashboardPage;
