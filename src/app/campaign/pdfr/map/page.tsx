"use client";

import { getCompendiumPageProps } from "@/controllers/Dnd5eController";
import Dnd5eHomePage from "@/views/pages/System/Dnd5e/Compendium/Rules";
import { useRef } from "react";

const Page = () => {
  const iframeRef = useRef(null);

  return (<iframe style={{
    width: '100vw',
    height: 'calc(100vh - 92px)',
  }} ref={iframeRef} src={`https://uploads.worldanvil.com/uploads/maps/b3748138e95d767e87697da8f7e35c25.jpg`} />);
};

export default Page;

