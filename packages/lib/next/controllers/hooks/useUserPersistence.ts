'use client';

import { useEffect } from 'react';
import { useUserData } from '@cfg/next/controllers/providers';
import { useSession } from 'next-auth/react';

/**
 * Custom hook to handle persistence of user data across page loads
 * This improves the initial loading experience by allowing components to
 * immediately render with previously loaded data while fresh data loads
 */
export function useUserPersistence() {
  const { userData, isLoading } = useUserData();
  const { status } = useSession();
  
  // Update user data in sessionStorage when it changes
  useEffect(() => {
    // Only store data when it's loaded and valid
    if (userData && !isLoading && status === 'authenticated') {
      try {
        // Store minimal data needed for immediate rendering
        const essentialData = {
          lastUpdated: Date.now(),
          user: userData.user,
          campaignsCount: userData.campaigns?.length || 0,
          charactersCount: userData.characters?.length || 0,
          hasAdmin: !!userData.user?.admin
        };
        
        sessionStorage.setItem('user_essential_data', JSON.stringify(essentialData));
      } catch (error) {
        console.warn('Failed to persist user data to sessionStorage', error);
      }
    }
  }, [userData, isLoading, status]);
  
  // Get essential user data from sessionStorage
  const getEssentialUserData = () => {
    try {
      const data = sessionStorage.getItem('user_essential_data');
      if (data) {
        const parsed = JSON.parse(data);
        // Only use cached data if it's less than 15 minutes old
        if (Date.now() - parsed.lastUpdated < 15 * 60 * 1000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve user data from sessionStorage', error);
    }
    return null;
  };
  
  return { getEssentialUserData };
}

export default useUserPersistence;
