"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { DND_5E } from "../config";


const PageInner = ({ user, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center gap-2">
      {/* <div className="flex flex-grid align-middle items-center g-2"> */}
        <a className={DND_5E.TW_CLASSES.LINK} href="/play/dnd5e">Play D&D 5e</a>

        {/* <div className="flex flex-col align-middle items-center">
          <div className="flex flex-row align-middle items-center gap-2">
            {characters?.map(
              (character: any) => (<a  className={DND_5E.TW_CLASSES.LINK} key={character.id} href={`/play/{someVariableThatHasSystem}/${character?.party?.slug}/${character?.slug}`}>
                Play as {character.name} ({character?.party?.name})
              </a>)
            )}
          </div>
        </div> */}
      </div>
    // </div>
  )
}

const Page = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <PageInner {...props}/>
    </SessionProvider>
  );
};

export default Page;
