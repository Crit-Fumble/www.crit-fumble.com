"use client";

import { SATISFACTORY } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ gamer, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div className="flex flex-grid align-middle gap-2 text-center">
        <a className={SATISFACTORY.TW_CLASSES.LINK} href="https://dashboard.indifferentbroccoli.com/" target="tab-satisfactory-server">Server Dashboard</a>
        <a className={SATISFACTORY.TW_CLASSES.LINK} href="http://ficsit.crit-fumble.com:27100" target="tab-satisfactory-server-steam">SteamCmd</a>
        <a className={SATISFACTORY.TW_CLASSES.LINK} href="http://ficsit.crit-fumble.com:30602/fs/steamcmd/satisfactory/FactoryGame/Saved/Config/LinuxServer/" target="tab-satisfactory-server-files">File Manager</a>
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
