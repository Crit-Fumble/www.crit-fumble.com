"use client";

import Dnd5eCharacterView from "@/views/components/blocks/Dnd5eCharacterView";
import { DEFAULT } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";

// TODO: determine game systems, and load appropriate view for each character sheet
// TODO: characters can have more that one sheet per character, for use in different systems

const CharacterDashboardInner = ({ ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col gap-2">
      <Dnd5eCharacterView {...props} />
    </div>
  )
}

const CharacterDashboard = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <CharacterDashboardInner {...props} />
    </SessionProvider>
  );
};

export default CharacterDashboard;
