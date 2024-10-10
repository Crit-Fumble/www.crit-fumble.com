import { DND_5E } from '@/views/config';

const Dnd5eGmView = ({party, subParties, parentParty, characters, campaign, world}: any) => {
  const dndBeyondId = party?.dndBeyond?.id ?? parentParty?.dndBeyond?.id;
  const discordServerId = campaign?.discord?.serverId;
  const sideChatThreadId = party?.discord?.sideChatThreadId ?? parentParty?.discord?.sideChatThreadId;
  const voiceChannelId = party?.discord?.voiceChannelId ?? parentParty?.discord?.voiceChannelId;
  const roll20Id = party?.roll20?.id ?? parentParty?.roll20?.id;

  return (
    <div className="flex flex-col align-middle items-center">
      <h2 className="text-lg border-b-2">Companions</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        WIP. Familiars, pets, and other creatures which are part of a party member&apos;s Character Build
      </div>
      
      <h2 className="text-lg border-b-2">Sidekicks</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        WIP. Sidekicks are CR 1/2 or lower NPCs which can progress through training as Warriors, Experts, or Spellcasters.
      </div>

      <h2 className="text-lg border-b-2">Units</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        WIP. Units are NPCs which can be hired as Skilled Hirelings (CR 1/2 or less) or Specialists (CR 1 or higher).
      </div>

      <h2 className="text-lg border-b-2">Assets</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        WIP. Assets are things like real estate, magic items, vehicles, or business holdings.
      </div>

      <h2 className="text-lg border-b-2">Loot</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        WIP. Coins, Gems, and Art Objects.
      </div>
    </div>
  );
}

export default Dnd5eGmView;