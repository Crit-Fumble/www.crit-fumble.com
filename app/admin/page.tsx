/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with user management interface.
 * Requires admin authentication via database admin flag.
 */

'use client';

import React, { useState, useEffect } from 'react';
import RPGSystemsAdmin from './components/RPGSystemsAdmin';
import UserTable from './components/UserTable';

type AdminTab = 'users' | 'rpg-systems';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check session data first
        const sessionResponse = await fetch('/api/auth/session');
        
        if (!sessionResponse.ok) {
          console.error('Failed to get session:', sessionResponse.status);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const sessionData = await sessionResponse.json();
        console.log('Session data:', sessionData);
        
        if (!sessionData.isLoggedIn) {
          // Not authenticated - redirect to home
          window.location.href = '/';
          return;
        }
        
        if (!sessionData.session?.admin) {
          // Not admin
          console.log('User is not admin:', sessionData.session);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // User is admin
        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (isAdmin !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div>Checking admin access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage user accounts and site administration
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Main Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('rpg-systems')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rpg-systems'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              RPG Systems
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <UserTable />
        )}

        {activeTab === 'rpg-systems' && (
          <RPGSystemsAdmin />
        )}
      </div>

      {/* Admin Notice */}
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800 max-w-sm">
        <div className="font-medium">Admin Mode Active</div>
        <div>You are accessing administrative functions</div>
      </div>
    </div>
  );
}