import Image from "next/image";

export default function Dnd5eScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a className="p-2" href="https://5etools.crit-fumble.com/quickreference.html#bookref-quick,2" target="_blank">
            5eTools
          </a> | <a className="p-2" href="/">
            Back to Home
          </a>
        </nav>
        <iframe src="https://5etools.crit-fumble.com/quickreference.html#bookref-quick,2" className={'h-screen'}></iframe>
      </div>
  );
}
