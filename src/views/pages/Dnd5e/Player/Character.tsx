"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, campaign, party, character, world, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex flex-col p-2 gap-2 justify-start">
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
      </div> */}
      {/* {character?.dndBeyond?.id && <div>
        <iframe style={{
          height: 'calc(100vh - 92px)',
          width: '800px',
        }} src={`https://www.dndbeyond.com/characters/${character?.dndBeyond?.id}`} />
      </div>} */}
      <div className="flex flex-col gap-2 p-2 justify-start text-center">
        {character?.name && <h1>{character.name}</h1>}
        {character?.description && <p>{character.description}</p>}
        {party?.name && <p><a href={`/play/dnd5e/${party.slug}`}>{party.name}</a></p>}
      </div>
      <div className="flex flex-col p-2 gap-2 justify-center text-center">
        <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.voiceChannelId}`} target="_blank">
          Discord Voice
        </a>
        <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.sideChatThreadId}`} target="_blank">
          Discord Side Chat
        </a>
        <a href={`https://app.roll20.net/campaigns/details/${party?.roll20?.id}`} target="_blank">
          Roll20 Campaign
        </a>
        {character?.dndBeyond?.id && <a href={`https://www.dndbeyond.com/characters/${character?.dndBeyond?.id}`} target="_blank">
          DDB Sheet
        </a>}
        {world?.title && <a href={world.url} target="_blank">{world?.title} World Anvil</a>}
        <a href="https://forgottenrealms.fandom.com/wiki/" target="_blank">
          FR Wiki
        </a>
        <a href="https://5etools.crit-fumble.com" target="_blank">
          5eTools
        </a>
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
