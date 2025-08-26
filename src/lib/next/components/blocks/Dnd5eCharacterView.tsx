"use client";
import { DEFAULT } from "@/config/views";
import ButtonBlock from "./LinkButtonBlock";
import { Card, CardContent, CardHeader } from "./Card";
import { useEffect, useState } from "react";

const Dnd5eCharacterView = ({ player, campaign, party, parentParty, character, world }: any) => {
  // Add debugging logs to see what party data is coming in
  useEffect(() => {
    console.log("Character data:", character);
    console.log("Party data:", party);
    console.log("Parent party data:", parentParty);
    console.log("Campaign data:", campaign);
    
    // More detailed debug info
    if (party && party.id) {
      console.log(`Party data successfully loaded with ID: ${party.id}`);
    } else {
      console.log("Character has no associated party");
    }
    
    // Check if party data has expected properties
    if (party) {
      console.log("Party object keys:", Object.keys(party));
      console.log("Party has name?", !!party.name);
      console.log("Party has id?", !!party.id);
    }
  }, [character, party, parentParty, campaign]);

  // Handle all the possible URL configurations
  const discordServerId = campaign?.discord?.id;
  const characterThreadId = character?.discord?.characterThreadId;
  const voiceChannelId = party?.discord?.voiceChannelId ?? parentParty?.discord?.voiceChannelId;
  const sideChatThreadId = party?.discord?.sideChatThreadId ?? parentParty?.discord?.sideChatThreadId;
  const characterThreadUrl = discordServerId && characterThreadId ? 
    `https://discord.com/channels/${discordServerId}/${characterThreadId}` : null;
  const sideChatUrl = discordServerId && sideChatThreadId ? 
    `https://discord.com/channels/${discordServerId}/${sideChatThreadId}` : null;
  const voiceChatUrl = discordServerId && voiceChannelId ? 
    `https://discord.com/channels/${discordServerId}/${voiceChannelId}` : null;
  const roll20Id = party?.roll20?.id ?? parentParty?.roll20?.id;
  const roll20VttUrl = roll20Id ? 
    `https://app.roll20.net/editor/setcampaign/${roll20Id}?desiredrole=player` : null;

  // Access the D&D Beyond ID directly from the character
  const dndBeyondId = character?.dnd_beyond_id;
  const ddbSheetUrl = dndBeyondId ? 
    `https://www.dndbeyond.com/characters/${dndBeyondId}` : null;
    
  // Access the PDF URL directly from the character
  const pdfUrl = character?.pdf_url;
  const FIVEE_TOOLS_URL = `https://2014.5e.tools`;
  const FR_WIKI_URL = `https://forgottenrealms.fandom.com/wiki`;

  return (
    <div className="flex flex-col gap-2 items-center justify-middle">
      <Card className="flex flex-col gap-2 justify-start text-center w-full max-w-2xl">
        {character?.name && <CardHeader>{character.name}</CardHeader>}
        <CardContent>
          {/* Character Portrait and Token */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {character?.portrait_url && (
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 border rounded-md overflow-hidden">
                  <img 
                    src={character.portrait_url} 
                    alt={`${character.name || 'Character'} Portrait`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">Character Portrait</span>
              </div>
            )}
            {character?.token_url && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 border rounded-full overflow-hidden">
                  <img 
                    src={character.token_url} 
                    alt={`${character.name || 'Character'} Token`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">Character Token</span>
              </div>
            )}
          </div>
          
          {/* Party information with enhanced fallback handling */}
          {(party && party.name) ? (
            <p className="my-1">Member of <strong>{party.name}</strong></p>
          ) : (parentParty && parentParty.name) ? (
            <p className="my-1">Member of <strong>{parentParty.name}</strong></p>
          ) : (party && party.id) ? (
            <p className="my-1">Member of a party <em>(party details unavailable)</em></p>
          ) : null}
          
          {campaign?.name && (
            <p className="my-1">
              In campaign: <a className="font-medium hover:underline" href={`/campaign/${campaign?.slug}`}>{campaign.name}</a>
            </p>
          )}
          
          {character?.characterSheets?.[0]?.summary && (
            <p className="my-2 font-medium text-lg">{character.characterSheets[0].summary}</p>
          )}
          
          {character?.description && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h3 className="text-sm font-medium mb-2">Character Description</h3>
              <p className="italic text-gray-700 dark:text-gray-300">{character.description}</p>
            </div>
          )}
          
          {character?.characterSheets?.[0]?.description && (
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h3 className="text-sm font-medium mb-2">Character Sheet Details</h3>
              <p className="italic text-gray-700 dark:text-gray-300">{character.characterSheets[0].description}</p>
            </div>
          )}
        </CardContent>

        {(roll20Id || dndBeyondId || characterThreadId || voiceChannelId || sideChatThreadId || pdfUrl) && (
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
            {pdfUrl && <ButtonBlock title={'CFG Character PDF'} target={'pdf'} options={'height=800, width=800'} url={pdfUrl} />}
              {roll20VttUrl && <ButtonBlock title={'Roll20 VTT'} target={'vtt'} options={'height=1080, width=1152'} url={roll20VttUrl} />}  
              {ddbSheetUrl && <ButtonBlock title={'D&D Beyond Character Sheet'} target={'ddb'} options={'height=1291, width=768'} url={ddbSheetUrl} />}
              {characterThreadUrl && <ButtonBlock title={'Discord Character Thread'} target={'discord'} options={'height=540, width=768'} url={characterThreadUrl} />}
              {voiceChatUrl && <ButtonBlock title={'Discord Voice Channel'} target={'discord-voice'} options={'height=540, width=768'} url={voiceChatUrl} />}
              {sideChatUrl && <ButtonBlock title={'Discord Side Chat'} target={'discord-chat'} options={'height=540, width=768'} url={sideChatUrl} />}
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="flex flex-col gap-2 justify-start text-center w-full max-w-2xl">
        <CardHeader>Rules & Lore</CardHeader>
        <div className="flex flex-col gap-2 justify-center p-4">
          <ButtonBlock title={'5etools'} target={'5etools'} options={'height=720, width=768'} url={FIVEE_TOOLS_URL} />
          {world?.url && <ButtonBlock title={'World Anvil'} target={'world-anvil'} options={'height=720, width=768'} url={world?.url} />}
          <ButtonBlock title={'Forgotten Realms Wiki'} target={'fr-wiki'} options={'height=720, width=768'} url={FR_WIKI_URL} />
        </div>
      </Card>
    </div>
  )
}

export default Dnd5eCharacterView;