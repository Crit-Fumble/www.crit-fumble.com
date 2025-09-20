/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with user management interface.
 * Requires admin authentication via database admin flag.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { UserManagementTable, UserForm, type User } from '@crit-fumble/react/components';

type ViewMode = 'table' | 'create' | 'edit';

export default function AdminDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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
          <p className="text-sm text-gray-500 mb-6">
            Only users with the admin flag set in the database can access the admin dashboard.
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
      </div>

      {/* Admin Notice */}
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded p-3 text-sm text-red-800 max-w-sm">
        <div className="font-medium">Admin Mode Active</div>
        <div>You are accessing administrative functions</div>
      </div>
    </div>
  );
}