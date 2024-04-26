import Image from "next/image";

export default function Page() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center'}>
      <nav>
        <a href="https://og-csrd.crit-fumble.com/og-cspg.html" target="_blank">Open in New Tab</a> | <a href="/">Back to Home</a>
      </nav>
        <iframe src="https://og-csrd.crit-fumble.com/og-cspg.html" className={'w-full h-screen'}></iframe>
      </div>
  );
}
