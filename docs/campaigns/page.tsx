import Footer from "@/components/layout/footer";
import Image from "next/image";

export default function SelectScreen() {
  // TODO: SEO and things
  
  // TODO: Add controls to allow GM to navigate between screens

  return (
      <div className={'flex flex-col justify-center text-center'}>
        <nav>
          <a href="/campaigns/zompocalypse">
            ☣ Zompocalypse
          </a> | 
          <a href="/campaigns/tidal-waves">
            🌊 The Tidal Waves
          </a> | 
          <a href="/campaigns/coastal-commission">
            ༄ The Coastal Commission
          </a> | 
          <a href="/campaigns/tpks">
            🥊 The Total Party Knockouts
          </a>
          <a href="/">
            Home
          </a>
        </nav>
      </div>
  );
}
