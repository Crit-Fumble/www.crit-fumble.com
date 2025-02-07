"use client";

// import { getUserPageProps } from "@/controllers/user";
// import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Page = ({ params: { apiPath }, searchParams }: { params:{ apiPath?: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const iframeRef = useRef(null);
  
  return (<iframe style={{
    width: '100vw',
    height: 'calc(100vh - 92px)',
  }} ref={iframeRef} src={`https://forgottenrealms.fandom.com/wiki/`} />);
};

export default Page;

