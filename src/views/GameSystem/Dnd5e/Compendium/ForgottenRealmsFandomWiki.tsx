"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@/controllers/providers";

const ForgottenRealmsFandomWikiInner = ({ player, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: '100vw',
        }} src={`https://forgottenrealms.fandom.com/wiki/`} />
      </div>
    </div>
  )
}

const ForgottenRealmsFandomWikiPage = ({ session, ...props }: any) => {

  return (
    <Providers session={session}>
      <ForgottenRealmsFandomWikiInner {...props} />
    </Providers>
  );
};

export default ForgottenRealmsFandomWikiPage;
