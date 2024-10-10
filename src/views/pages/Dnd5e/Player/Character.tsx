"use client";

import Dnd5eCharacterView from "@/views/components/blocks/Dnd5eCharacterView";
import { DND_5E } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";

const PageInner = ({ ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col gap-2">
      <Dnd5eCharacterView {...props} />
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
