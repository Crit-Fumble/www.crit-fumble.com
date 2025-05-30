'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { Session } from "next-auth";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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
  
  const fetchUserData = useCallback(async () => {
    console.log('UserDataProvider: Fetching user data...');
    
    if (status !== "authenticated" || !session?.user?.id) {
      console.log('UserDataProvider: Not authenticated or missing user ID');
      setUserData(null);
      setIsLoading(false);
      return;
    }
    
    console.log('UserDataProvider: Making fetch request to /api/user');
    setIsLoading(true);
    
    try {
      const timestamp = new Date().getTime();
      const response = await window.fetch(`/api/user?t=${timestamp}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log("UserDataProvider: Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("UserDataProvider: User data fetched successfully");
      
      const mergedUserData = {
        ...data,
        user: {
          ...session.user,
          ...(data.user || {})
        }
      };
      
      setUserData(mergedUserData);
      setError(null);
    } catch (err) {
      console.error("UserDataProvider: Error fetching user data", err);
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
  }, [session, status]);
  
  // Handle session changes and initial load
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "authenticated" && session?.user?.id) {
      if (!initialFetchDone.current) {
        console.log('UserDataProvider: Initial load with authenticated session');
      } else {
        console.log('UserDataProvider: Session changed, refetching user data');
      }
      fetchUserData();
    } else if (status === "unauthenticated") {
      console.log('UserDataProvider: Session unauthenticated, clearing user data');
      setUserData(null);
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [status, session, fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, error, refetch: fetchUserData }}>
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
