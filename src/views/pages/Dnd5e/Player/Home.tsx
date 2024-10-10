"use client";

import { DND_5E } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";


const PageInner = ({ characters }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col align-middle items-center">
      <div className="flex flex-row align-middle items-center">
        {/* {JSON.stringify(data, null, 2)} */}
        {characters?.map(
          (character: any) => (<a  className={DND_5E.TW_CLASSES.LINK} key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
            Play as {character.name} ({character?.party?.name})
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
