"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import type { UserData, User } from '@crit-fumble/core/models/user';

// Extended interface for persisted user data with additional properties
interface PersistedUserData extends Partial<UserData> {
  campaignsCount?: number;
  hasAdmin?: boolean;
}
import useDarkMode from '../../../controllers/hooks/useDarkMode';
import { useUserData } from '../../../controllers/providers';
import useUserPersistence from '../../../controllers/hooks/useUserPersistence';
import createLogger from '../../../../core/utils/ClientLogger';
import Image from 'next/image';
import Link from 'next/link';

const logger = createLogger('NavigationMenu');

// Memoized loading spinner component with size options
const LoadingSpinner = React.memo(({ size = 'default' }: { size?: 'small' | 'default' }) => {
  const sizeClasses = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex items-center">
      <div className={`${sizeClasses} border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin mr-2`}></div>
      {size !== 'small' && <span className="text-sm">Loading...</span>}
    </div>
  );
});

// Memoized user avatar component
const UserAvatar = ({ user }: { user: any }) => (
  user?.image ? (
    <Image 
      src={user.image} 
      alt={`${user.name || 'User'}'s profile`}
      width={32}
      height={32}
      className="rounded-full"
    />
  ) : (
    <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
      <span className="text-white text-xs">{user?.name?.[0] || 'U'}</span>
    </div>
  )
);

// Memoized dropdown menu item component
const DropdownMenuItem = ({ href, onClick, className, children }: { 
  href?: string; 
  onClick?: () => void; 
  className?: string;
  children: React.ReactNode;
}) => {
  const baseClass = "block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center";
  
  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClass} text-left w-full ${className || ''}`}>
        {children}
      </button>
    );
  }
  
  return (
    <Link href={href || '#'} className={`${baseClass} ${className || ''}`}>
      {children}
    </Link>
  );
};

const NavigationMenu = () => {
  const { data: session, status } = useSession();
  const { userData, isLoading: isLoadingUserData, refetch } = useUserData() as { userData: UserData | null, isLoading: boolean, refetch: () => Promise<any> };
  const { getEssentialUserData } = useUserPersistence();
  const { isDark, toggleDark } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [persistedUserData, setPersistedUserData] = useState<PersistedUserData | null>(null);
  
  // Memoize derived state to prevent recalculations on each render
  const isLoading = status === "loading" || isLoadingUserData;
  const isLoggedIn = status === "authenticated" && session?.user?.id != null;
  
  // Refetch user data if session is authenticated but user data is missing
  useEffect(() => {
    const refetchData = async () => {
      if (isLoggedIn && !userData && !isLoadingUserData) {
        try {
          await refetch();
        } catch (err) {
          logger.error("Failed to refetch user data:", err);
        }
      }
    };
    
    refetchData();
  }, [isLoggedIn, userData, isLoadingUserData, refetch]);
  
  // Load persisted data on initial render to prevent flicker
  useEffect(() => {
    if (isInitialLoad && status === 'authenticated') {
      const essentialData = getEssentialUserData();
      if (essentialData) {
        setPersistedUserData(essentialData);
      }
    }
    // Removing getEssentialUserData from dependencies to avoid infinite loop
    // Since it's only needed on initial load when status becomes authenticated
  }, [status, isInitialLoad]);
  
  // Handle initial load state
  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);
  
  // Memoize user data to prevent unnecessary re-renders
  const userName = session?.user?.name || "User";
  const campaigns = useMemo(() => 
    userData?.campaigns?.filter?.((campaign: any) => campaign?.active) || [], 
    [userData?.campaigns]
  );
  
  // Memoize event handlers
  const handleLogout = useCallback(() => signOut({ callbackUrl: "/" }), []);
  const handleLogin = useCallback(async () => {
    try {
      logger.info('User initiating login');
      await signIn('discord');
    } catch (error) {
      logger.error('Login failed:', error);
    }
  }, []);
  const handleDarkModeToggle = useCallback(() => {
    logger.debug('Dark mode toggled');
    toggleDark();
  }, [toggleDark]);

  // Memoize campaign dropdown
  const campaignElements = useMemo(() => {
    if (isLoading || !userData) return null;
    
    return campaigns?.length > 0 ? (
      <li className="group relative flex items-center">
        <span className="py-2 hover:underline cursor-pointer font-medium flex items-center">Campaigns</span>
        <div className="hidden group-hover:block absolute left-0 top-10 w-48 bg-white dark:bg-gray-800 shadow-lg z-50 rounded">
          <ul className="py-1">
            {campaigns.map((campaign: any) => (
              <li key={campaign.id}>
                <DropdownMenuItem href={`/campaign/${campaign.slug}`}>
                  {campaign.name}
                </DropdownMenuItem>
              </li>
            ))}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <DropdownMenuItem 
                href="/campaign/create"
                className="text-blue-600 dark:text-blue-400"
              >
                + New Campaign
              </DropdownMenuItem>
            </li>
          </ul>
        </div>
      </li>
    ) : null;
  }, [campaigns, isLoading, userData]);

  // Memoize character dropdown
  const characterElements = useMemo(() => {
    if (isLoading || !userData) return null;
    
    return (
      <li className="group relative flex items-center">
        <span className="py-2 hover:underline cursor-pointer font-medium flex items-center">Characters</span>
        <div className="hidden group-hover:block absolute left-0 top-10 w-48 bg-white dark:bg-gray-800 shadow-lg z-50 rounded">
          <ul className="py-1">
            {(userData?.characters && userData.characters.length > 0) ? (
              userData?.characters?.map((character: any) => (
                <li key={character.id}>
                  <DropdownMenuItem href={`/character/${character.slug}`}>
                    {character.name}
                  </DropdownMenuItem>
                </li>
              ))
            ) : (
              <li>
                <span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No characters found
                </span>
              </li>
            )}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <DropdownMenuItem 
                href="/character/create"
                className="text-blue-600 dark:text-blue-400"
              >
                + Create Character
              </DropdownMenuItem>
            </li>
          </ul>
        </div>
      </li>
    );
  }, [userData, isLoading]);

  return (
    <nav className={`h-14 py-3 flex flex-row items-center ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800'} shadow-md font-sans`}>
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/img/cfg-logo.jpg" 
              alt="Crit Fumble Gaming" 
              width={40} 
              height={40} 
              className="mr-3 rounded-md"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold">Crit-Fumble</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Navigation links and user controls */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 md:items-center`}>
          {/* Left side navigation */}
          <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 mb-4 md:mb-0 md:mr-8 md:items-baseline">
            {/* Home link commented out as redundant - logo serves as home link */}
            {/* <li className="flex items-baseline">
              <Link 
                href="/" 
                className="flex items-center h-10 py-2 border-b-2 border-transparent hover:border-primary-light font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </li> */}

            {/* Campaign and Character elements - use persisted data during initial load */}
            {isLoggedIn && (
              isInitialLoad ? (
                persistedUserData ? (
                  <>
                    {persistedUserData?.campaignsCount && persistedUserData.campaignsCount > 0 && (
                      <li className="group relative flex items-baseline">
                        <span className="py-2 hover:underline cursor-pointer font-medium flex items-center h-10">Campaigns</span>
                      </li>
                    )}
                    <li className="group relative flex items-baseline">
                      <span className="py-2 hover:underline cursor-pointer font-medium flex items-center h-10">Characters</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded"></li>
                    <li className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded"></li>
                  </>
                )
              ) : userData && (
                <>
                  {/* FUTURE: add Game System menu */}
                  {/* FUTURE: add World menu */}
                  {campaignElements}
                  {/* FUTURE: add Party menu */}
                  {characterElements}
                  {/* FUTURE: add Compendium menu */}
                </>
              )
            )}
          </ul>

          {/* Right side user menu */}
          <div className="flex flex-row md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:ml-auto">
            {/* Dark mode toggle */}
            <button 
              onClick={handleDarkModeToggle}
              className="m-0 p-4 rounded-full hover:bg-gray-600/20 transition-colors flex items-center justify-center"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? '🌙' : '☀️'}
            </button>

            {/* User menu */}
            {isLoggedIn ? (
              <div className="group relative">
                {isLoading && isInitialLoad ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {/* User avatar/profile picture with name */}
                    <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-600/20 transition-colors">
                      <UserAvatar user={session?.user} />
                      <span className="hidden md:inline">{userName}</span>
                      {isLoading && !isInitialLoad ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* User dropdown menu */}
                    <div className="hidden group-hover:block absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 shadow-lg z-50 rounded-md">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>
                        {isLoading && !isInitialLoad && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <LoadingSpinner size="small" /> 
                            <span className="ml-1">Refreshing data...</span>
                          </div>
                        )}
                        {persistedUserData?.hasAdmin === true && !userData?.user?.admin && (
                          <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <ul className="py-2">
                        <li>
                          <DropdownMenuItem href="/dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                          </DropdownMenuItem>
                        </li>
                        {userData?.user?.slug && (
                          <li>
                            <DropdownMenuItem href={`/user/${userData.user.slug}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profile
                            </DropdownMenuItem>
                          </li>
                        )}
                        {userData?.user?.admin && (
                          <li>
                            <DropdownMenuItem href={`/admin/${userData.user.slug}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Admin
                            </DropdownMenuItem>
                          </li>
                        )}
                        <li className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <DropdownMenuItem 
                            onClick={handleLogout}
                            className="text-red-600 dark:text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </DropdownMenuItem>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : isLoading ? (
              <LoadingSpinner />
            ) : (
              <button 
                type="button"
                onClick={() => signIn('discord')}
                aria-label="Login with Discord"
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-600/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer" 
              >
                <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden md:inline font-medium">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;