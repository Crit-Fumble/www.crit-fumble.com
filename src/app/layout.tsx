import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/topBar";
import { Session } from "next-auth";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Crit-Fumble Gaming",
  description: "Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

export default function RootLayout({
  children,
  session,
}: any) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <TopBar session={session} />
      </body>
    </html>
  );
}
