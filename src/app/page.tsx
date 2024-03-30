import Image from "next/image";

export default function Page() {
  // TODO: SEO and things
  
  return (
    <div>
      <div className={'flex justify-center'}>
          <div className={'p-8 flex flex-col items-center text-center'} >
              <div className={'p-4 flex justify-center'}>
                <Image className={'rounded-full'} alt="CFG Logo" src='/img/cfg-logo.jpg' height={'256'} width={'256'}/>
              </div>

              <h1>Crit Fumble Gaming</h1>

              <p className={'p-4 italic'}>If the GM doesn&apos;t kill you, the dice will.</p>

              <p className={'p-4'}>Welcome to Crit Fumble Gaming! We&apos;re a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and &quot;mini-campaigns&quot; that only last a few sessions.</p>

              <p className={'p-4'}>To find out more, chat with us, or find a group to play with, join our <a className="text-green-600" href={'https://discord.gg/dZzsst6TdG'} target="_blank">Discord Server</a>.</p>
          </div>
      </div>
    </div>
  );
}
