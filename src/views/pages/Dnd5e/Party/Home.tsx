"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ party, campaign, subParties, parentParty, characters }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col p-2 gap-2 justify-start">
        <div className="width-[100%] flex flex-col justify-center text-center">
          <a href={`/play/dnd5e`}>
            D&D 5e
          </a>
          -
          <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.voiceChannelId}`} target="_blank">
            Voice
          </a>
          <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.sideChatThreadId}`} target="_blank">
            Chat
          </a>
          -
          <a href={`https://app.roll20.net/campaigns/details/${party?.roll20?.id}`} target="_blank">
            Roll20
          </a>
          <a href={`https://www.dndbeyond.com/campaigns/${party?.dndBeyond?.id}`} target="_blank">
            DDB
          </a>
          <a href="https://5etools.crit-fumble.com" target="_blank">
            5eTools
          </a>
        </div>
      </div>
      {!!parentParty.name && <div className="flex flex-col p-2 gap-2 justify-start text-center">
        <div>Parent Party</div>
        <div>-</div>
        <a href={`/play/dnd5e/${parentParty.slug}`}>
          {parentParty?.name}
        </a>
      </div>}
      {!!subParties.length && <div className="flex flex-col p-2 gap-2 justify-start text-center">
        <div>Sub-Parties</div>
        <div>-</div>
        {subParties.map((subParty: any) => 
          <a key={subParty.id} href={`/play/dnd5e/${subParty.slug}`}>
            {subParty?.name}
          </a>
        )}
      </div>}
      {!!characters.length && <div className="flex flex-col p-2 gap-2 justify-start text-center">
        <div>Members</div>
        <div>-</div>
        {characters.map((character: any) => 
          <a key={character.id} href={`/play/dnd5e/${character.party.slug || party.slug}/${character.slug}`}>
            {character?.name}
          </a>
        )}
      </div>}
      {/* <div>
        {JSON.stringify(party, null, 2)}
      </div> */}
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
