import { DEFAULT } from '@/web/config/views';

const Dnd5ePartyRoster = ({party, subParties, parentParty, characters, campaign, world}: any) => {
  const discordServerId = campaign?.discord?.id;
  const voiceChannelId = party?.discord?.voiceChannelId ?? parentParty?.discord?.voiceChannelId;
  const sideChatThreadId = party?.discord?.sideChatThreadId ?? parentParty?.discord?.sideChatThreadId;
  const sideChatUrl = `https://discord.com/channels/${discordServerId}/${sideChatThreadId}`;
  const voiceChatUrl = `https://discord.com/channels/${discordServerId}/${voiceChannelId}`;
  const roll20Id = party?.roll20?.id ?? parentParty?.roll20?.id;
  const roll20CampaignUrl = `https://app.roll20.net/campaigns/${roll20Id}?desiredrole=player`;
  
  // Access the D&D Beyond ID directly from the party if available
  const DndBeyondId = party?.dnd_beyond_id ?? parentParty?.dnd_beyond_id;
  const ddbCampaignUrl = `https://www.dndbeyond.com/campaigns/${DndBeyondId}`;
  const FIVEE_TOOLS_URL = `https://5etools.crit-fumble.com`;
  const FR_WIKI_URL = `https://forgottenrealms.fandom.com/wiki`;

  return (
    <div className="flex flex-col align-middle items-center">
      <h1>{party?.name}</h1>
      {party?.description && <p>{party?.description}</p>}

      {parentParty?.name && (
        <div className="border-t-2 p-6">
          <span><a className={DEFAULT.TW_CLASSES.LINK} href={`/play/dnd5e/${parentParty?.slug}`}>View {parentParty?.name}</a></span>
          {/* {parentParty?.description && <p>{parentParty?.description}</p>} */}
        </div>
      )} 

      <h2 className="text-lg border-b-2">Roster</h2>
      <div className="flex flex-grid flex-wrap justify-middle align-middle items-middle gap-2 m-6">
        {characters?.filter((character: any) => character?.party?.id === party?.id)?.map(
          (character: any) => (
            <div key={character?.slug}>
              <p>
                <a className={DEFAULT.TW_CLASSES.LINK} key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
                  View {character.name}
                </a>
              </p>
            </div>
          )
        )}

        {subParties?.map((subParty: any) => (
          <div key={subParty?.slug} className="p-2">
            <div className="flex flex-col align-middle items-center p-4 gap-4">
              <a className={DEFAULT.TW_CLASSES.LINK} key={subParty.id} href={`/play/dnd5e/${subParty?.slug}`}>
                View {subParty?.name}
              </a>
              {characters?.filter((character: any) => character?.party?.id === subParty?.id)?.map(
                (character: any) => (
                  <a className={DEFAULT.TW_CLASSES.LINK} key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
                    View {character.name}
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="flex flex-grid flex-wrap justify-middle align-middle items-middle gap-2 text-center">
        {roll20Id && <a className={DEFAULT.TW_CLASSES.LINK}  href={`https://app.roll20.net/editor/setcampaign/${roll20Id}?desiredrole=player`} target="_blank">Open Roll20 Campaign</a>}
        {DndBeyondId && <a className={DEFAULT.TW_CLASSES.LINK}  href={`https://www.dndbeyond.com/campaigns/${DndBeyondId}`} target="_blank">Open D&D Beyond Campaign</a>}
        {world?.url && <a className={DEFAULT.TW_CLASSES.LINK} href={world.url} target="_blank">Open {world.title} World Anvil</a>}
        {voiceChannelId && <a className={DEFAULT.TW_CLASSES.LINK}  href={`https://discord.com/channels/${discordServerId}/${voiceChannelId}`} target="_blank">
          Open Discord Voice
        </a>}
        {sideChatThreadId && <a className={DEFAULT.TW_CLASSES.LINK}  href={`https://discord.com/channels/${discordServerId}/${sideChatThreadId}`} target="_blank">
          Open Discord Side Chat
        </a>}
      </div>
    </div>
  );
}

export default Dnd5ePartyRoster;