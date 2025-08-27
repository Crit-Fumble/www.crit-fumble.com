"use client";
import { Providers } from "@cfg/next/controllers/providers"

export default function Session({
  children,
  pageProps: { session, ...pageProps },
}: any) {
  return (
    <Providers session={session}>
      {children ?? undefined}
    </Providers>
  )
}
