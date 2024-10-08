const Dnd5ePartyRoster = ({party, subParties, parentParty, characters, campaign, world}: any) => {

  return (
    <div className="flex flex-col align-middle items-center">
      <h1>{party?.name}</h1>
      {party?.description && <p>{party?.description}</p>}

      {parentParty?.name && (
        <div className="border-t-2 p-2">
          <span>Member of <a href={`/play/dnd5e/${parentParty?.slug}`}>{parentParty?.name}</a></span>
          {/* {parentParty?.description && <p>{parentParty?.description}</p>} */}
        </div>
      )} 

      <h2 className="text-lg border-b-2">Roster</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        {characters?.filter((character: any) => character?.party?.id === party?.id)?.map(
          (character: any) => (
            <div key={character?.slug} className="p-2">
              <p>
                <a key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
                  {character.name}
                </a>
              </p>
            </div>
          )
        )}

        {subParties?.map((subParty: any) => (
          <div key={subParty?.slug} className="p-2">
            <a key={subParty.id} href={`/play/dnd5e/${subParty?.slug}`}>
              <h2>{subParty?.name}</h2>
              {subParty?.description && <p>{subParty?.description}</p>}
            </a>
            <div className="flex flex-col align-middle items-center border-t-2 p-2">
              {characters?.filter((character: any) => character?.party?.id === subParty?.id)?.map(
                (character: any) => (
                  <div key={character?.slug}>
                    <p>
                      <a key={character.id} href={`/play/dnd5e/${character?.party?.slug}/${character?.slug}`}>
                        {character.name}
                      </a>
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

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

      <h2 className="text-lg border-b-2">Links</h2>
      <div className="flex flex-row flex-wrap justify-middle align-middle items-middle gap-2">
        <a href={`https://app.roll20.net/campaigns/details/${party?.roll20?.id}`} target="_blank">Roll20 Campaign</a>
        |
        <a href={`https://www.dndbeyond.com/campaigns/${party?.dndBeyond?.id}`} target="_blank">D&D Beyond Campaign</a>
        {world?.title && '|'}
        {world?.title && <a href={world.url} target="_blank">{world.title} World Anvil</a>}
        |
        <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.voiceChannelId}`} target="_blank">
          Discord Voice
        </a>
        |
        <a href={`https://discord.com/channels/${campaign?.discord?.serverId}/${party?.discord?.sideChatThreadId}`} target="_blank">
          Discord Side Chat
        </a>
        {/* {JSON.stringify({...world, subscribergroups: undefined}, null, 2)} */}
      </div>
    </div>
  );
}

export default Dnd5ePartyRoster;