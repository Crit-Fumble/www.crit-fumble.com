import { getCampaignPageProps } from "@/controllers/CampaignController";
import { getServerSession } from "@/services/AuthService";
import { Card, CardContent, CardHeader } from "@/views/components/blocks/Card";

const Page = async () => {
  const props = await getCampaignPageProps({ campaign: { slug: 'pdfr' }});

  console.log(props?.player);

  return (<div className="flex flex-col gap-4">
      <Card>
        <CardHeader>Parties Die in the Forgotten Realms</CardHeader>
        <CardContent>
          <p>Welcome, {props?.player?.name}, to a Forgotten Realms-based campaign by Crit-Fumble Gaming!</p>
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
              <a href="https://discord.com/channels/1002008886137589771/1072401844594286633" target="_blank">Discord Quest Log Forum</a>
            </li>
            <li>
              <a href="https://discord.com/channels/1002008886137589771/1111854956165734471" target="_blank">Discord Play-by-Post Channel</a>
            </li>
            <li>
              <a href="https://forgottenrealms.fandom.com/wiki" target="_blank">Forgotten Realms Fandom Wiki</a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>Current Parties</CardHeader>
        <CardContent className="flex flex-grid gap-2">
        </CardContent>
      </Card> */}
      
      <div className="flex flex-grid gap-2">
          <Card className="flex-1">
            <CardHeader>Barrel of Mayhem</CardHeader> 
            <CardContent>
              <p>Every Tuesday</p>
              <p>7:30pm - 10:00pm CDT</p>
              <p>8:30pm - 11:00pm EDT</p>
            </CardContent>
            <CardContent>
              <ul className="underline">
                <li>
                  <a href="https://app.roll20.net/join/17858042/E_iyPw" target="_blank">Roll 20 Join Link</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1305939321186025513" target="_blank">Discord Side Chat Thread</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1296206616525406409" target="_blank">Discord Quest Log Post</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1306016948651429999" target="_blank">Discord Play-by-Post Thread</a>
                </li>
                <li>
                  <a href="https://www.dndbeyond.com/campaigns/join/48209972621760902" target="_blank">D&D Beyond Join link (Optional)</a>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>The Total Party Knockouts</CardHeader>
            <CardContent>
              <p>Every other Saturday</p>
              <p>5:30pm - 10:00pm CDT</p>
              <p>6:30pm - 11:00pm EDT</p>
            </CardContent>
            <CardContent>
              <ul className="underline">
                <li>
                  <a href="https://app.roll20.net/join/17353381/wX4-tw" target="_blank">Roll 20 Join Link</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1305940098822570004" target="_blank">Discord Side Chat Thread</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1296206495784112128" target="_blank">Discord Quest Log Post</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1306016293811523686" target="_blank">Discord Play-by-Post Thread</a>
                </li>
                <li>
                  <a href="https://www.dndbeyond.com/campaigns/join/57896542422649808" target="_blank">D&D Beyond Join link (Optional)</a>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>The Coastal Commission</CardHeader>
            <CardContent>
              <p>Play-by-post Only</p>
            </CardContent>
            <CardContent>
              <ul className="underline">
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1305940414339092480" target="_blank">Discord Side Chat Thread</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1296206820888674395" target="_blank">Discord Quest Log</a>
                </li>
                <li>
                  <a href="https://discord.com/channels/1002008886137589771/1275257832567996427" target="_blank">Discord Play-by-Post Thread</a>
                </li>
                <li>
                  <a href="https://www.dndbeyond.com/campaigns/join/36839482379429765" target="_blank">D&D Beyond Join link (Optional)</a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
  </div>);

  // return (<iframe style={{
  //   width: '100vw',
  //   height: 'calc(100vh - 92px)',
  // }} ref={iframeRef} src={`https://pdfr.foundryserver.com`} />);
};

export default Page;

