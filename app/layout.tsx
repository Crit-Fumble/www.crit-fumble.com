import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Initialize Discord commands and other startup tasks
import "../lib/startup.js";
import Bottombar from './components/Bottombar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crit-Fumble Gaming",
  description: "Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark min-h-screen overflow-x-hidden flex flex-col`} suppressHydrationWarning>
        <main className={'flex-grow w-full flex flex-col items-stretch'}>
          {children}
        </main>
        <Bottombar />
      </body>
    </html>
  );
}
