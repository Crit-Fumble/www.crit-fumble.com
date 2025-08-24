'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { Session } from "next-auth";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

// Cache keys
const USER_DATA_CACHE_KEY = 'user_data_cache';

// Types for user data
type UserData = {
  characters: any[];
  campaigns: any[];
  parties: any[];
  user?: any;
};

// Context type for user data
type UserDataContextType = {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

// Create context with default values
const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  isLoading: true,
  error: null,
  refetch: () => {},
});

// User data provider
function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialFetchDone = useRef(false);
  
  // Try to load cached user data from localStorage
const loadCachedUserData = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cachedData = localStorage.getItem(USER_DATA_CACHE_KEY);
      if (cachedData) {
        const { userData: cachedUserData, timestamp, userId } = JSON.parse(cachedData);
        
        // Only use cache if it's for the current user and less than 5 minutes old
        const isRecent = (Date.now() - timestamp) < 5 * 60 * 1000;
        const isCurrentUser = userId === session?.user?.id;
        
        if (isRecent && isCurrentUser && cachedUserData) {
          return cachedUserData;
        }
      }
    } catch (err) {
      console.warn('Failed to load cached user data:', err);
    }
    
    return null;
  }, [session?.user?.id]);

  // Cache the user data to localStorage
  const cacheUserData = useCallback((data: UserData) => {
    if (typeof window === 'undefined' || !session?.user?.id) return;
    
    try {
      const cacheData = {
        userData: data,
        timestamp: Date.now(),
        userId: session.user.id
      };
      localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to cache user data:', err);
    }
  }, [session?.user?.id]);

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    if (status !== "authenticated" || !session?.user?.id) {
      setUserData(null);
      setIsLoading(false);
      return;
    }
    
    // Check for cached data unless force refresh is requested
    if (!forceRefresh) {
      const cachedData = loadCachedUserData();
      if (cachedData) {
        setUserData(cachedData);
        setIsLoading(false);
        initialFetchDone.current = true;
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const response = await window.fetch(`/api/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
      
      const data = await response.json();
      
      const mergedUserData = {
        ...data,
        user: {
          ...session.user,
          ...(data.user || {})
        }
      };
      
      setUserData(mergedUserData);
      cacheUserData(mergedUserData);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data", err);
      // If API fails, still keep session user data
      if (session?.user) {
        setUserData({
          user: session.user,
          characters: [],
          campaigns: [],
          parties: []
        });
      }
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [session, status, loadCachedUserData, cacheUserData]);
  
  // Handle session changes and initial load
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(false); // Use cache if available
    } else if (status === "unauthenticated") {
      setUserData(null);
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [status, session, fetchUserData]);

  // Create a refetch function that forces a fresh fetch
  const refetchUserData = useCallback(() => {
    return fetchUserData(true);
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, error, refetch: refetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

// Root provider that combines all providers
export function Providers({ 
  children,
  session
}: { 
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <UserDataProvider>
        {children}
      </UserDataProvider>
    </SessionProvider>
  );
}

// Custom hook to use the user data
export function useUserData() {
  return useContext(UserDataContext);
}
