"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, campaign, party, character, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col p-2 gap-2 justify-start">
        <div className="width-[100%] flex flex-col justify-center text-center">
          <a>
            Initiative
          </a>
          <a href={`/play/dnd5e/${party.slug}/${character.slug}/adventure`}>
            Adventure
          </a>
          <a href={`/play/dnd5e/${party.slug}/${character.slug}/travel`}>
            Travel
          </a>
          <a href={`/play/dnd5e/${party.slug}/${character.slug}/downtime`}>
            Downtime
          </a>
          -
          <a href={`/play/dnd5e/${party.slug}/${character.slug}`}>
            Character
          </a>
        </div>
      </div>
      {/* {character?.dndBeyond?.id && <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: '800px',
        }} src={`https://www.dndbeyond.com/characters/${character?.dndBeyond?.id}`} />
      </div>} */}
      <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: 'calc(100vw - 128px)',
        }} src={`https://5etools.crit-fumble.com/quickreference.html#bookref-quick,3`} />
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
