'use server';

import { getServerSession } from "../../next/services/AuthService";
import { DEFAULT } from "../config/views";

/**
 * Server action to fetch home page data
 * Can be imported and used by page.tsx
 */
export async function getHomePageData() {
  // Fetch session
  const session = await getServerSession();
  
  // Fetch any other server-side data here
  // This could include announcements, featured campaigns, etc.
  
  // Return all data needed by client components
  return {
    session,
    config: {
      twClasses: DEFAULT.TW_CLASSES,
      isLoggedIn: !!session?.user,
      userData: session?.user || null
    }
  };
}
