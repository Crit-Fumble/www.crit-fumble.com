"use client";
import { SessionProvider } from "next-auth/react"
export default function Session({
  children,
  pageProps: { session, ...pageProps },
}: any) {
  return (
    <SessionProvider session={session}>
      {children ?? undefined}
    </SessionProvider>
  )
}
