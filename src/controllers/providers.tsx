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
  
  // Initialize userData with session data when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user && (session.user.id !== undefined && session.user.id !== null)) {
      // Set initial userData with just the session user data
      // This ensures we always have at least the basic user data
      setUserData(prevData => ({
        ...prevData,
        user: session.user,
        characters: prevData?.characters || [],
        campaigns: prevData?.campaigns || [],
        parties: prevData?.parties || []
      }));
      
      console.log('UserDataProvider: Initialized userData with session user:', JSON.stringify(session.user, null, 2));
    }
  }, [session, status]);
  
  const fetchUserData = useCallback(() => {
    console.log('UserDataProvider status:', status);
    console.log('UserDataProvider session:', JSON.stringify(session, null, 2));
    
    if (status !== "authenticated" || !session?.user?.id) {
      console.log('UserDataProvider: Not authenticated or missing user ID');
      setUserData(null);
      setIsLoading(false);
      return;
    }
    
    console.log('UserDataProvider: Making fetch request to /api/user');
    setIsLoading(true);
    
    // Add a timestamp query parameter to prevent caching
    const timestamp = new Date().getTime();
    
    // Use window.fetch to ensure browser context
    window.fetch(`/api/user?t=${timestamp}`, {
      method: 'GET',
      credentials: 'include', // Use 'include' to ensure cookies are sent
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(response => {
        console.log("UserDataProvider: Response status:", response.status);
        if (!response.ok) {
          console.log("UserDataProvider: Response not OK", response.statusText);
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("UserDataProvider: User data fetched successfully", JSON.stringify(data, null, 2));
        
        // Ensure we keep the session user data even if API returns different user data
        const mergedUserData = {
          ...data,
          user: {
            ...session.user,  // Start with session user data (has image URL)
            ...(data.user || {})  // Add any additional user data from API
          }
        };
        
        console.log("UserDataProvider: Merged user data:", JSON.stringify(mergedUserData.user, null, 2));
        setUserData(mergedUserData);
        setError(null);
        setIsLoading(false);
        initialFetchDone.current = true;
      })
      .catch(err => {
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
        setIsLoading(false);
        initialFetchDone.current = true;
      });
  }, [session, status]);
  
  // Initial fetch when component mounts
  useEffect(() => {
    if (!initialFetchDone.current && status === "authenticated" && session?.user?.id) {
      console.log('UserDataProvider: Initial mount with authenticated session, fetching user data');
      fetchUserData();
    } else if (status === "unauthenticated") {
      console.log('UserDataProvider: Session unauthenticated, clearing user data');
      setUserData(null);
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [fetchUserData, session, status]);
  
  // Fetch user data when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      console.log('UserDataProvider: Session authenticated, fetching user data');
      fetchUserData();
    } else if (status === "unauthenticated") {
      console.log('UserDataProvider: Session unauthenticated, clearing user data');
      setUserData(null);
      setIsLoading(false);
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
