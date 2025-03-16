"use client";

import { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define types for our user data
export type UserData = {
  characters: any[];
  campaigns: any[];
  parties: any[];
  user?: any;
};

// Create context type for user data
type UserDataContextType = {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

// Create context for user data with default values
const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  isLoading: true,
  error: null,
  refetch: () => {},
});

// Custom hook to access user data
export function useUserData() {
  return useContext(UserDataContext);
}

// Enhanced SessionProvider component
export const SessionProvider = ({ 
  children, 
  session 
}: { 
  children: React.ReactNode; 
  session?: Session | null;
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = () => {
    setIsLoading(true);
    fetch("/api/user")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserData(data);
        setError(null);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Only fetch user data if we have a session
    if (session) {
      fetchUserData();
    } else {
      // Reset user data if no session
      setUserData(null);
      setIsLoading(false);
    }
  }, [session]);

  const contextValue = {
    userData,
    isLoading,
    error,
    refetch: fetchUserData
  };

  return (
    <NextAuthSessionProvider session={session}>
      <UserDataContext.Provider value={contextValue}>
        {children}
      </UserDataContext.Provider>
    </NextAuthSessionProvider>
  );
};
