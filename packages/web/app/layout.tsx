import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { TopBarSession } from "@cfg/components/sections/topBar";
import "./globals.css";
import { BottomBarSession } from "@cfg/components/sections/bottomBar";
import { Providers } from "../lib/next/controllers/providers";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Crit-Fumble Gaming",
  description: "Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

export default async function RootLayout({
  children,
}: any) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark min-h-screen overflow-x-hidden flex flex-col`} suppressHydrationWarning>
        <Providers session={session}>
          <TopBarSession />
          <main className={'flex-grow pt-16 w-full flex flex-col items-stretch'}>
            {children}
          </main>
          <BottomBarSession />
        </Providers>
      </body>
    </html>
  );
}
