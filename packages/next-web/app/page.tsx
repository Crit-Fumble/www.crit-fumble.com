import { Metadata } from "next";
import { getHomePageData } from "./server";
import HomePageClient from "./client";

export const metadata: Metadata = {
  title: "Crit-Fumble Gaming  |  Home",
  description: "Welcome to Crit Fumble Gaming! We're a gaming group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

/**
 * Main page component that:
 * 1. Imports server-side functionality from server.tsx
 * 2. Gets data from server actions
 * 3. Passes data to client components
 */
export default async function Page() {
  // Get data from server-side functionality
  const { session, config } = await getHomePageData();
  
  // Pass the data to the client component
  return <HomePageClient session={session} config={config} />;
}
