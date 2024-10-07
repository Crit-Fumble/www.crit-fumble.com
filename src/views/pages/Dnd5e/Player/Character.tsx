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
          <a href={`/play/dnd5e/${party.slug}/${character.slug}/initiative`}>
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
          <a href={`/play/dnd5e/${party.slug}`}>
            Party
          </a>
          <a href={`/play/dnd5e/${party.slug}/${character.slug}/world`}>
            World
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
          <a href={`https://www.dndbeyond.com/characters/${character?.dndBeyond?.id}`} target="_blank">
            DDB
          </a>
          <a href="https://5etools.crit-fumble.com" target="_blank">
            5eTools
          </a>
        </div>
      </div>
      {character?.dndBeyond?.id && <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: '800px',
        }} src={`https://www.dndbeyond.com/characters/${character?.dndBeyond?.id}`} />
      </div>}
      <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: 'calc(100vw - 800px - 128px)',
        }} src={`https://5etools.crit-fumble.com/quickreference.html#bookref-quick,2`} />
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
