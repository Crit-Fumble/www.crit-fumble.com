"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@cfg/next/views/components/blocks/Card";
import { slugify } from '@cfg/utils/textUtils';
import { Providers } from "@cfg/next/controllers/providers";

// Character Create Form Component
const CharacterCreateForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dndBeyondUrl: '',
    slug: ''
  });

  // Fetch parties when component mounts
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('/api/party/list');
        if (response.ok) {
          const data = await response.json();
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
            // Add the extracted ID directly to dnd_beyond_id to match database field
            submissionData.dnd_beyond_id = match[1];
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

      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create character');
      }

      // Redirect to the new character page
      router.push(`/character/${data.character.slug}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>Create New Character</CardHeader>
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
            <label htmlFor="slug" className="mb-1 font-medium">URL Slug (auto-generated)</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
              readOnly
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
              {loading ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Character Create View with Providers
const CharacterCreateView = ({ session }: { session: any }) => {
  return (
    <Providers session={session}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Character</h1>
        <CharacterCreateForm />
      </div>
    </Providers>
  );
};

export default CharacterCreateView;
