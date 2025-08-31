"use client";
import { SessionProvider as _SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProps {
  children?: ReactNode;
  pageProps?: {
    session?: any;
    [key: string]: any;
  };
}

export default function SessionProvider({
  children,
  pageProps = {},
}: SessionProps) {
  const { session, ...restPageProps } = pageProps;
  
  return (
    <_SessionProvider session={session}>
      {children}
    </_SessionProvider>
  );
}
