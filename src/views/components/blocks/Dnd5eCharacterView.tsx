"use client";
import { DEFAULT } from "@/views/config";
import ButtonBlock from "./LinkButtonBlock";
import { Card, CardContent, CardHeader } from "./Card";

const Dnd5eCharacterView = ({ player, campaign, party, parentParty, character, world }: any) => {
  const discordServerId = campaign?.discord?.id;
  const characterThreadId = character?.discord?.characterThreadId;
  const voiceChannelId = party?.discord?.voiceChannelId ?? parentParty?.discord?.voiceChannelId;
  const sideChatThreadId = party?.discord?.sideChatThreadId ?? parentParty?.discord?.sideChatThreadId;
  const characterThreadUrl = `https://discord.com/channels/${discordServerId}/${characterThreadId}`;
  const sideChatUrl = `https://discord.com/channels/${discordServerId}/${sideChatThreadId}`;
  const voiceChatUrl = `https://discord.com/channels/${discordServerId}/${voiceChannelId}`;
  const roll20Id = party?.roll20?.id ?? parentParty?.roll20?.id;
  const roll20VttUrl = `https://app.roll20.net/editor/setcampaign/${roll20Id}?desiredrole=player`;
  const dndBeyondId = character?.dndBeyond?.id;
  const ddbSheetUrl = `https://www.dndbeyond.com/characters/${dndBeyondId}`;
  const FIVEE_TOOLS_URL = `https://2014.5e.tools`;
  const FR_WIKI_URL = `https://forgottenrealms.fandom.com/wiki`;

  return (
    <div className="flex flex-col gap-2 items-center justify-middle">
      <Card className="flex flex-col gap-2 justify-start text-center">
        {character?.name && <CardHeader>{character.name}</CardHeader>}
        <CardContent>
          {parentParty.name && <p>member of {parentParty.name}</p>}
          {party.name && <p>member of {party.name}</p>}
          {campaign.name && <p>in <a className="hover:underline" href={`/campaign/${campaign?.slug}`}>{campaign.name}</a></p>}
          {character?.description && <p>{character.description}</p>}
          {/* {party?.name && <p><a className={DEFAULT.TW_CLASSES.LINK} href={`/party/${party.slug}`}>View {party.name}</a></p>} */}
        </CardContent>
        <CardContent>
          {roll20Id && <ButtonBlock title={'Roll20 VTT'} target={'vtt'} options={'height=1080, width=1152'} url={roll20VttUrl} />}
          {dndBeyondId && <ButtonBlock title={'D&D Beyond Character Sheet'} target={'ddb'} options={'height=1291, width=768'} url={ddbSheetUrl} />}
          {characterThreadId && <ButtonBlock title={'Discord Character Thread'} target={'ddb'} options={'height=540, width=768'} url={characterThreadUrl} />}
          {voiceChannelId && <ButtonBlock title={'Discord Voice Channel'} target={''} options={'height=540, width=768'} url={voiceChatUrl} />}
          {sideChatThreadId && <ButtonBlock title={'Discord Side Chat'} target={''} options={'height=540, width=768'} url={sideChatUrl} />}
        </CardContent>
      </Card>

      <Card className="flex flex-col gap-2 justify-start text-center">
        <CardHeader>Rules & Lore</CardHeader>
        <div className="flex flex-col gap-2 text-center">
          <ButtonBlock title={'5etools'} target={'5etools'} options={'height=720, width=768'} url={FIVEE_TOOLS_URL} />
          {/* {world?.url && <ButtonBlock title={'World Anvil'} target={'world-anvil'} options={'height=720, width=768'} url={world?.url} />} */}
          <ButtonBlock title={'Forgotten Realms Fandom Wiki'} target={'fr-wiki'} options={'height=720, width=768'} url={FR_WIKI_URL} />
        </div>
      </Card>
    </div>
  )
}

export default Dnd5eCharacterView;