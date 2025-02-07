import { getCampaignPageProps } from "@/controllers/CampaignController";
import { Card, CardContent, CardHeader } from "@/views/components/blocks/Card";
import { PartyCard } from "@/views/components/blocks/PartyCard";

const Page = async () => {
  const props = await getCampaignPageProps({ campaign: { slug: 'pdfr' }});

  const { characters, parties, player } = props;

  return (<div className="flex flex-col gap-4">
      <Card>
        <CardHeader>Parties Die in the Forgotten Realms</CardHeader>
        <CardContent>
          <p>Welcome, {props?.player?.name}, to a Forgotten Realms-based D&D5e campaign by Crit-Fumble Gaming!</p>
        </CardContent>
      </Card>
      <Card>
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
              <a href="https://forgottenrealms.fandom.com/wiki" target="_blank">Forgotten Realms Fandom Wiki</a>
            </li>
            <li>
              <a href="https://uploads.worldanvil.com/uploads/maps/b3748138e95d767e87697da8f7e35c25.jpg" target="_blank">View World Map <small>(House Rule: 6 mile hexes)</small></a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-grid gap-2">
        {parties?.filter((party: any) => (party.campaign === '0' && !party.parentParty && party.active))?.map((party: any) => (
          <PartyCard partyId={party?.id} parties={parties} characters={characters} player={player} className="flex-1"/>
        ))}
      </div>
  </div>);

  // return (<iframe style={{
  //   width: '100vw',
  //   height: 'calc(100vh - 92px)',
  // }} ref={iframeRef} src={`https://pdfr.foundryserver.com`} />);
};

export default Page;

