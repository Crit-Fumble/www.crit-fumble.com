import Image from "next/image";

export default function PlayerScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a className="p-2" href="https://www.5esrd.com" target="_blank">
            5eSRD
          </a> | <a className="p-2" href="/">
            Home
          </a>
        </nav>
        <iframe src="https://www.5esrd.com" className={'h-screen'}></iframe>
      </div>
  );
}
