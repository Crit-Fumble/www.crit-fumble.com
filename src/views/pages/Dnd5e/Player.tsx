"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div className="flex flex-row align-middle items-center">
        {/* {JSON.stringify(data, null, 2)} */}
        {characters?.map(
          (character: any) => (<a key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
            Play {character.name} ({character?.party?.name})
          </a>)
        )}
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
