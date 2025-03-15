"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import { slugify } from '@lib/utils/textUtils';

// Character Edit Form Component
const CharacterEditForm = ({ characterData }: { characterData: any }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: characterData?.id || '',
    name: characterData?.name || '',
    dndBeyondUrl: '',
    slug: characterData?.slug || ''
  });

  // If the character has a D&D Beyond association, set the URL
  useEffect(() => {
    if (characterData?.DndBeyond?.dd_beyond_id) {
      setFormData(prev => ({
        ...prev,
        dndBeyondUrl: `https://www.dndbeyond.com/characters/${characterData.DndBeyond.dd_beyond_id}`
      }));
    }
  }, [characterData]);

  // Fetch parties when component mounts
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('/api/party/list');
        if (response.ok) {
          const data = await response.json();
          // Handle parties data if needed
        }
      } catch (err) {
        console.error('Error fetching parties:', err);
      }
    };

    if (session?.user?.id) {
      fetchParties();
    }
  }, [session?.user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle name changes to auto-generate slug
    if (name === 'name') {
      const newSlug = slugify(value);
      setFormData(prev => ({ ...prev, [name]: value, slug: newSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process the form data before submission
      const submissionData: Record<string, any> = { ...formData };
      
      // Extract D&D Beyond character ID from URL if provided
      if (submissionData.dndBeyondUrl) {
        try {
          // Extract character ID from URL like https://www.dndbeyond.com/characters/12345
          const match = submissionData.dndBeyondUrl.match(/\/characters\/(\d+)/);
          if (match && match[1]) {
            // Add the extracted ID as dndBeyondId
            submissionData.dndBeyondId = match[1];
          } else {
            throw new Error('Invalid D&D Beyond URL format');
          }
        } catch (err) {
          setError('Please provide a valid D&D Beyond character URL (https://www.dndbeyond.com/characters/XXXX)');
          setLoading(false);
          return;
        }
      }
      
      // Remove the URL field as it's not needed in the database
      if ('dndBeyondUrl' in submissionData) {
        delete submissionData.dndBeyondUrl;
      }

      const response = await fetch(`/api/character/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update character');
      }

      // Redirect to the character page
      router.push(`/character/${data.character.slug}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the character');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/character/${formData.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete character');
      }

      // Redirect to the characters list page or dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the character');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>Edit Character</CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">Character Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="dndBeyondUrl" className="mb-1 font-medium">D&D Beyond URL</label>
            <input
              type="text"
              id="dndBeyondUrl"
              name="dndBeyondUrl"
              value={formData.dndBeyondUrl}
              onChange={handleChange}
              placeholder="https://www.dndbeyond.com/characters/12345"
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            <p className="text-sm text-gray-500 mt-1">
              Format: https://www.dndbeyond.com/characters/XXXX
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="slug" className="mb-1 font-medium">URL Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Character'}
            </button>
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Character Edit View with Session Provider
const CharacterEditView = ({ session, character }: { session: any, character: any }) => {
  return (
    <SessionProvider session={session}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Character</h1>
        <CharacterEditForm characterData={character} />
      </div>
    </SessionProvider>
  );
};

export default CharacterEditView;
