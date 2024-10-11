"use client";

// import { getUserPageProps } from "@/controllers/user";
// import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Page = ({ params: { apiPath }, searchParams }: { params:{ apiPath?: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const iframeRef = useRef(null);
  // const router = useRouter();
  // const path = apiPath; //?.slice('/play/dnd5e/tools/'.length);
  // const queryString = ''; //searchParams;

  // useEffect(() => {
  //   console.log(iframeRef?.current?.contentWindow);
  //   console.log(iframeRef?.current?.contentWindow?.parent?.location?.href);
  //   console.log(apiPath, searchParams);
  //   // console.log(queryString);

  //   // if (iframeRef?.current?.contentWindow?.location) {
  //   //  // TODO: the thing
  //   //   router.push(`/play/dnd5e/pdfr/${iframeRef?.current?.src}`);
  //   // }
  // }, [router, iframeRef.current?.src]);

  return (<iframe style={{
    width: '100vw',
    height: 'calc(100vh - 92px)',
  }} ref={iframeRef} src={`https://pdfr.foundryserver.com`} />);
};

export default Page;

