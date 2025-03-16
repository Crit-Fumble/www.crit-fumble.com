"use client";

import Dnd5eCompendiumSearch from "@lib/components/blocks/Dnd5eCompendiumSearch";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Providers } from "@/controllers/providers";

const PageInner = ({ player, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <Dnd5eCompendiumSearch />
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
