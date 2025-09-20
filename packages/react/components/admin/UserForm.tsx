/**
 * User Form Component
 * 
 * Provides a form interface for creating and editing users
 * with autocomplete, JSON editing, and validation.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { UserAutocomplete } from './UserAutocomplete';
import { JsonEditor } from './JsonEditor';
import type { User } from './UserManagementTable';

interface UserFormData {
  id?: string;
  discord_id?: string;
  worldanvil_id?: string;
  name?: string;
  slug?: string;
  email?: string;
  admin?: boolean;
  data?: any;
}

interface UserFormProps {
  user?: User | null;
  onSave?: (userData: UserFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function UserForm({
  user,
  onSave,
  onCancel,
  mode = 'create'
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({});
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        discord_id: user.discord_id || '',
        worldanvil_id: user.worldanvil_id || '',
        name: user.name || '',
        slug: user.slug || '',
        email: user.email || '',
        admin: user.admin || false,
        data: user.data
      });
    } else {
      setFormData({
        admin: false
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Slug validation
    if (formData.slug) {
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(formData.slug)) {
        newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
      }
    }

    // ID validation for create mode
    if (mode === 'create' && formData.id) {
      if (formData.id.length < 1) {
        newErrors.id = 'ID must not be empty';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      // Clean up data - remove empty strings
      const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      await onSave?.(cleanData);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save user' });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">
        {mode === 'create' ? 'Create User' : 'Edit User'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID (only for create mode) */}
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID (optional)
              </label>
              <input
                type="text"
                value={formData.id || ''}
                onChange={(e) => handleFieldChange('id', e.target.value)}
                placeholder="Leave empty to auto-generate"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.id && (
                <p className="text-red-600 text-sm mt-1">{errors.id}</p>
              )}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => handleFieldChange('slug', e.target.value)}
              placeholder="user-friendly-url"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.slug ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
            )}
          </div>
        </div>

        {/* Integration IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord ID
            </label>
            <input
              type="text"
              value={formData.discord_id || ''}
              onChange={(e) => handleFieldChange('discord_id', e.target.value)}
              placeholder="Discord user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WorldAnvil ID
            </label>
            <input
              type="text"
              value={formData.worldanvil_id || ''}
              onChange={(e) => handleFieldChange('worldanvil_id', e.target.value)}
              placeholder="WorldAnvil user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Admin Status */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.admin || false}
              onChange={(e) => handleFieldChange('admin', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Admin User
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Grant administrative privileges to this user
          </p>
        </div>

        {/* JSON Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Data (JSON)
          </label>
          <JsonEditor
            value={formData.data}
            onChange={(value) => handleFieldChange('data', value)}
            placeholder="Enter additional user data as JSON..."
          />
        </div>

        {/* Form Errors */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}