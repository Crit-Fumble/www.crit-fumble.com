import { getCampaignPageProps } from "@/controllers/CampaignController";
import { Card, CardContent, CardHeader } from "@/views/components/blocks/Card";
import { PartyCard } from "@/views/components/blocks/PartyCard";

const Page = async () => {
  const props = await getCampaignPageProps({ campaign: { slug: 'pdfr' }});

  const { characters, parties, player } = props;

  return (
    <div className="flex flex-row max-h-[calc(100vh-92px)]">
      <div className="flex flex-col gap-2">
        <div>
          <h3>PDitFR</h3>
        </div>
        <ol>
          <li >
            <a
              href={`#introduction`}
              className="hover:underline"
            >
              <em>Introduction</em>
            </a>
          </li>
          <li >
            <a
              href={`#code-of-conduct`}
              className="hover:underline"
            >
              <em>Code of Conduct</em>
            </a>
          </li>
          <li >
            <a
              href={`#campaign-links`}
              className="hover:underline"
            >
              <em>Campaign Links</em>
            </a>
          </li>
        </ol>
      </div>
      <div className="w-full flex flex-col items-left overflow-y-auto">
        <div className="flex flex-col gap-4">
          <Card id="introduction" className="flex flex-col">
            <CardHeader>Parties Die in the Forgotten Realms</CardHeader>
            <CardContent>
              <p>Welcome, {props?.player?.name}, to a Forgotten Realms-based D&D5e campaign by Crit-Fumble Gaming!</p>
            </CardContent>
          </Card>
          <Card id="code-of-conduct">
            <CardHeader>Code of Conduct</CardHeader>
            <CardContent>
              <p>
                Outside of game mechanics, there will be a few ground rules at our virtual table.
              </p>
              <ol className="flex flex-col gap-1 text-sm">
                <li>
                  1.  You are expected to abide by our agreed upon Lines & Veils throughout the entire campaign. These may be adjusted as necessary, so reference them often to keep them fresh in your memory.
                </li>
                <li>
                  2.  In the lower right of the VTT, you'll notice a deck of safety cards. These are an optional alternative to interjecting verbally. At any time, you may signal "slow down" (yellow card) or "stop" (red card) to signal to other players (including the GM) that you're uncomfortable with the direction they're taking the narrative. Once you're issue has been addressed and you're comfortable, you can signal "good to go" (green card). See <a href="https://wiki.roll20.net/Cards" target="_blank">https://wiki.roll20.net/Cards</a> for documentation of how card decks work.
                </li>
                <li>
                  3.  Put yourself on push-to-talk, set a key bind for mute, or otherwise leave yourself muted when it's not your turn. If you don't have a physical mute/push-to-talk button, get one. See <a href="https://linuxhint.com/mute-discord-with-button" target="_blank">https://linuxhint.com/mute-discord-with-button</a> to learn how to set a key bind for mute toggle. Personally, I like that my headset has a mute button built in and an LED on the microphone arm that lights up to indicate when I'm muted. Find what works for you.
                </li>
                <li>
                  4.  Be mindful that there are other players in the group who may enjoy a different style of play than you. Do not interrupt dialog or exposition, as other players may be interested. "It's what my character would do" is not an excuse to ruin the fun for other players.
                </li>
                <li>
                  5.  Try not to take too long on your turn in combat. A combat round is six seconds in-game, so try to limit your turn to a minute or two irl. The heat of combat is not the time to try and figure out how your character's spells and features work. Pay attention to what other players are doing so you can be prepared when its your turn.
                </li>
                <li>
                  6.  Strategizing during combat isn't necessarily "metagaming". Your characters are seasoned adventurers with honed instincts. It makes sense they intuitively know how to strategize, even in the heat of combat. It's more fun when everyone works together. Unless there is a roleplaying reason for two characters to be competitive, please coordinate your moves as this will help preserve resources. It's incredibly annoying when a player expends a spell slot only to have another player derail their strategy. Spend a few moments at the start of combat or the top of the round to collaborate with your fellow players. Text chat works great for this too.
                </li>
                <li>
                  7.  Moderate your use of alcohol and THC during play. Refrain from other psychoactive drugs unless prescribed by a physician. Its fine to loosen up a bit, but if your intoxication becomes a distraction, you will be asked to leave the session. Everyone's body and mind are different, so pace yourself in the way that works best for you.
                </li>
                <li>
                  8.  We will not "estimate" your current XP, gold, items, or other resources. You are expected to keep track of these things. If there is a discrepancy, we will round down or use the lowest number. If you choose to use a PDF or paper character sheet, please send me a up-to-date copy at the end of each session.
                </li>
                <li>
                  9.  D&D Beyond is optional and I will not offer support for that platform. The Beyond20 browser extension is highly recommended if you choose to use D&D Beyond. I'll also ask that you join the DDB campaign (see link in "Campaign Intro") so I can reference your sheet between and during sessions.
                </li>
                <li>
                  10. Please do not DM me with questions or comments pertaining to this campaign. Questions can be posted in Discord or addressed at the beginning of the session. You can still DM me to send your copy of the RPG Consent Checklist or to address concerns pertaining to sensitive topics such as Lines & Veils.
                </li>
              </ol>
            </CardContent>
          </Card>
          <Card id="campaign-links" className="overflow:hidden">
            <CardHeader>Campaign Links</CardHeader>
            <CardContent>
              <ul className="underline">
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1175910585020448768" target="_blank">Discord Voice Chat</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1305943118796947528" target="_blank">Discord Campaign Chat Thread</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1072401844594286633" target="_blank">Discord Campaign Logs Forum</a>
                </li>
                <li>
                  <a href="/campaign/pdfr/map" target="_blank">View World Map <small>(House Rule: 6 mile hexes)</small></a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/0B8XAiXpOfz9cMWt1RTBicmpmUDg/view?resourcekey=0-ceHUken0_UhQ3Apa6g4SJA" target="_blank">Sane Magical Item Prices</a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/0B8XAiXpOfz9cMWt1RTBicmpmUDg/view?resourcekey=0-ceHUken0_UhQ3Apa6g4SJA" target="_blank">Sane Magical Item Prices</a>
                </li>
                <li>
                  <a href="https://forgottenrealms.fandom.com/wiki" target="_blank">Forgotten Realms Fandom Wiki</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-grid gap-2">
            {parties?.filter((party: any) => (party.campaign === '0' && !party.parentParty && party.active))?.map((party: any) => (
              <PartyCard partyId={party?.id} parties={parties} characters={characters} player={player} className="flex-1"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // return (<iframe style={{
  //   width: '100vw',
  //   height: 'calc(100vh - 92px)',
  // }} ref={iframeRef} src={`https://pdfr.foundryserver.com`} />);
};

export default Page;

