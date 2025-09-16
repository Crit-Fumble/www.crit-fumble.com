'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define local interfaces to avoid import path issues
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean | null;
}

interface Character {
  id: string;
  name: string | null;
  player?: string | null;
}

interface Campaign {
  id: string;
  name: string;
  description?: string | null;
}

interface UserData {
  user: User | null;
  campaigns?: Campaign[];
  characters?: Character[];
}

interface UserDataContextType {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Create context with default values
const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

interface UserDataProviderProps {
  children: ReactNode;
  session?: any; // Server-side session
}

export function UserDataProvider({ children, session: serverSession }: UserDataProviderProps) {
  // Still use useSession for client-side reactivity
  const { data: clientSession, status } = useSession();
  
  // Use server session for initial data, then use client session when available
  const session = clientSession || serverSession;
  
  const [userData, setUserData] = useState<UserData | null>(serverSession?.user ? { user: serverSession.user } : null);
  const [isLoading, setIsLoading] = useState<boolean>(!serverSession?.user);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setIsLoading(false);
      setUserData(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user ID from session
      // Note: session.user may not have an id property directly (depends on NextAuth config)
      const userId = session.user.id || '';
      const email = session.user.email || '';
      
      // Call the API endpoint which uses our data layer
      const response = await fetch('/api/user/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data when session changes
  useEffect(() => {
    if (status === 'loading') return;
    fetchUserData();
  }, [status, session]);

  return (
    <UserDataContext.Provider value={{ 
      userData, 
      isLoading, 
      error, 
      refetch: fetchUserData 
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

// Custom hook to use the user data context
export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
