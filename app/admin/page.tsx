/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with user management interface.
 * Requires admin authentication via database admin flag.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { UserManagementTable, UserForm, type User } from '@crit-fumble/react/components';
import RPGSystemsAdmin from './components/RPGSystemsAdmin';

type ViewMode = 'table' | 'create' | 'edit';
type AdminTab = 'users' | 'rpg-systems';

interface UserData {
  id: string;
  displayName: string;
  roles: { id: string; name: string }[];
}

export default function AdminDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Discord user fetch states
  const [discordId, setDiscordId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Make a simple request to test admin access
        const response = await fetch('/api/admin/users?limit=1');
        
        if (response.status === 401) {
          // Not authenticated
          window.location.href = '/';
          return;
        }
        
        if (response.status === 403) {
          // Not admin
          setIsAdmin(false);
        } else if (response.ok) {
          // Is admin
          setIsAdmin(true);
        } else {
          // Other error
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setViewMode('create');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setViewMode('edit');
  };

  const handleDeleteUser = (user: User) => {
    // The table component handles deletion
    console.log('User deleted:', user.id);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (viewMode === 'create') {
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create user');
        }
      } else if (viewMode === 'edit' && selectedUser) {
        const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update user');
        }
      }

      // Return to table view
      setViewMode('table');
      setSelectedUser(null);
    } catch (error) {
      // Re-throw to let the form handle the error
      throw error;
    }
  };

  const handleCancel = () => {
    setViewMode('table');
    setSelectedUser(null);
  };

  const handleFetchUser = async () => {
    setError(null);
    try {
      const response = await fetch('/api/discord/import-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to fetch user');
      }

      const data: UserData = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

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

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need admin privileges to access this page.
          </p>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Manage user accounts and site administration
              </p>
            </div>
            <div className="flex space-x-4">
              {viewMode !== 'table' && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Back to Users
                </button>
              )}
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
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('rpg-systems')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rpg-systems'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              RPG Systems
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div>
            {viewMode === 'table' && (
              <UserManagementTable
                onCreateUser={handleCreateUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {(viewMode === 'create' || viewMode === 'edit') && (
              <UserForm
                user={selectedUser}
                mode={viewMode}
                onSave={handleSaveUser}
                onCancel={handleCancel}
              />
            )}

            {/* Discord User Fetch Form - only show in users tab */}
            {viewMode === 'table' && (
              <div className="mt-8 p-4 bg-white rounded shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Fetch Discord User</h2>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter Discord ID"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleFetchUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Fetch User
                  </button>
                </div>

                {error && <p className="mt-2 text-red-600">{error}</p>}

                {userData && (
                  <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">User Details</h3>
                    <p className="text-gray-700">Display Name: {userData.displayName}</p>
                    <p className="text-gray-700">Roles:</p>
                    <ul className="list-disc list-inside">
                      {userData.roles.map((role) => (
                        <li key={role.id} className="text-gray-700">{role.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
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