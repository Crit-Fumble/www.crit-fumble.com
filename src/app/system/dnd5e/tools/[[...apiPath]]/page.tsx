"use client";

import { useRouter } from "next/navigation";
// import { getUserPageProps } from "@/controllers/user";
// import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Page = ({ params: { apiPath = '/' }, searchParams }: { params:{ apiPath?: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const iframeRef = useRef(null);
  const router = useRouter();
  const queryKeys = Object.keys(searchParams);
  const queryString = queryKeys.length ? `?${queryKeys?.map(k => `${k}=${searchParams[k]}`)?.join('&')}` : '';

  // useEffect(() => {
  //   // window.removeEventListener('message');

  //   // console.log('Updated:', iframeRef?.current);
  //   // console.log(iframeRef?.current?.contentWindow?.parent?.location?.href);
  //   // if (iframeRef?.current?.contentWindow?.location) {
  //   //  // TODO: the thing
  //   //   router.push(`/system/dnd5e/tools/${iframeRef?.current?.src}`);
  //   // }
  // }, [apiPath, router, searchParams]);

  function handleIframeLoad() {
    
    // window.addEventListener('onclick', event => {
    //   // 👇️ check the origin of the data
    //       console.log(event);
    //   // if (event.origin === 'https://2014.5e.tools/') {
    //   //     // If this runs, the data was sent from your site
    //   //     // The data sent with postMessage() is accessed via
    //   //     // event.data
    //   //     console.log(event);
    //   // } else {
    //   //     // If this runs, the data was NOT sent from your site
    //   //     // Make sure to not use this data
    //   //     // You can remove the `else` statement
    //   //     return;
    //   // }
    // });
    // console.log('Loaded:', iframeRef?.current);
    // if (iframeRef?.current?.contentWindow) {
    //   Object.keys(iframeRef.current.contentWindow).forEach(key => {
    //     if (/^on/.test(key)) {
    //         window.addEventListener(key.slice(2), event => {
    //             console.log(event);
    //         });
    //     }
    //   });
    // }
  }

  return (<iframe style={{
    width: '100vw',
    height: 'calc(100vh - 92px)',
  }} onLoad={handleIframeLoad} ref={iframeRef} src={`https://2014.5e.tools/${apiPath}${queryString}`} />);
};

export default Page;

