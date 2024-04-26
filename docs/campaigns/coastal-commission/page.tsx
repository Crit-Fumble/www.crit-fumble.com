import Image from "next/image";

export default function PlayerScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a className="p-2" href="https://discord.com/channels/1002008886137589771/1111854956165734471" target="_blank">
            Gameplay Chat
          </a> | 
          <a className="p-2" href="https://discord.com/channels/1002008886137589771/1210861800476770326" target="_blank">
            Side Chat
          </a> | 
          <a className="p-2" href="https://5etools.crit-fumble.com/quickreference.html#bookref-quick,2" target="_blank">
            5eTools
          </a> | 
          <a className="p-2" href="/">
            Home
          </a>
        </nav>
        <iframe src="https://5etools.crit-fumble.com/quickreference.html#bookref-quick,2" className={'h-screen'}></iframe>
      </div>
  );
}
