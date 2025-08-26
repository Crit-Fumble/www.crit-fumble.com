import { Card, CardContent, CardHeader } from "./Card";

export const PartyCard = ({partyId, parties, characters, player, children} : any) => {
  const party = parties?.find((party: any) => party?.id === partyId);
  const subParties = parties?.filter((party: any) => (party?.parentParty === partyId && party?.active));

  // Instead of using character.party_id which is removed,
  // we should get characters for this party from a different source
  // This should be updated to use PartyCharacter junction table or getCharactersByPartyId function
  const filteredCharacters = characters ?? [];

  return (
    <Card className="flex-1">
      <CardHeader>{party.name}</CardHeader>

      {party?.playtime?.day && <CardContent>
        <p>{party?.playtime?.day}</p>
        {party?.playtime?.times && <p>{party?.playtime?.times?.join(' / ')}</p>}
      </CardContent>}
      
      <CardContent>
        <ul className="underline">
          {party?.roll20?.join && <li>
            <a href={`https://app.roll20.net/join/${party?.roll20?.join}`} target="_blank">Roll 20 Join Link</a>
          </li>}
          {party?.discord?.sideChatThreadId && <li>
            <a href={`https://discord.com/channels/1002008886137589771/${party?.discord?.sideChatThreadId}`} target="_blank">Discord Side Chat Thread</a>
          </li>}
          {party?.discord?.questLogThreadId && <li>
            <a href={`https://discord.com/channels/1002008886137589771/${party?.discord?.questLogThreadId}`} target="_blank">Discord Quest Log</a>
          </li>}
          {party?.discord?.gameplayThreadId && <li>
            <a href={`https://discord.com/channels/1002008886137589771/${party?.discord?.gameplayThreadId}`} target="_blank">Discord Play-by-Post Thread</a>
          </li>}
          {party?.dndBeyond?.id && <li>
            <a href={`https://www.dndbeyond.com/campaigns/join/${party?.dndBeyond?.id}`} target="_blank">D&D Beyond Join link (Optional)</a>
          </li>}
        </ul>
      </CardContent>

      {children}

      {(!!filteredCharacters?.length || !!subParties?.length) && <CardContent>
        <Card>
          <CardHeader>
          Party Roster
          </CardHeader>
          <CardContent>
            <ul>
            {
              filteredCharacters.map(
                (character: any, idx: number) => {
                  const { name, slug } = character;
                  return (
                    <li key={`${slug}-${idx}`} className="flex-1">
                      {name}
                    </li>
                  );
                }
              )
            }
            </ul>

            {!!subParties?.length && 
              subParties.map(
                (subParty: any, idx: number) => (
                  <div key={`${idx}-${subParty?.id}`} className="flex-1">
                    <p><strong>{subParty.name}</strong></p>
                    <ul>
                    {
                      characters.filter((c: any) => c.party_id === subParty.id).map(
                        (character: any, idx: number) => {
                          const { name, slug } = character;
                          return (
                            <li key={`${slug}-${idx}`} className="flex-1">
                              {name}
                            </li>
                          );
                        }
                      )
                    }
                    </ul>
                  </div>
                )
              )
            }
          </CardContent>
        </Card>
      </CardContent>}
    </Card>
  );
};