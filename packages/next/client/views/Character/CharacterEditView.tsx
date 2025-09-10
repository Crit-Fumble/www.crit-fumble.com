"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "../components/blocks/Card";
import { slugify } from '@crit-fumble/core/utils/textUtils';
import { Providers } from "../../controllers/providers";
import Link from 'next/link';

// Character Edit Form Component
const CharacterEditForm = ({ characterData }: { characterData: any }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [tokenUploading, setTokenUploading] = useState(false);
  const [portraitUploadError, setPortraitUploadError] = useState('');
  const [tokenUploadError, setTokenUploadError] = useState('');
  const [currentPortraitUrl, setCurrentPortraitUrl] = useState(characterData?.portrait_url || '');
  const [currentTokenUrl, setCurrentTokenUrl] = useState(characterData?.token_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    id: characterData?.id || '',
    name: characterData?.name || '',
    slug: characterData?.slug || '',
    title: characterData?.title || '',
    summary: characterData?.summary || '',
    description: characterData?.description || '',
    portrait_url: characterData?.portrait_url || '',
    token_url: characterData?.token_url || ''
  });

  // Set up the character data when component loads
  useEffect(() => {
    console.log('Character data received in EditView:', characterData);
    
    // If the character has a portrait URL, make sure it's set correctly
    if (characterData?.portrait_url) {
      console.log('Portrait URL found in character data:', characterData.portrait_url);
      setFormData(prev => ({
        ...prev,
        portrait_url: characterData.portrait_url
      }));
    } else {
      console.log('No portrait URL found in character data');
    }

    // If the character has a token URL, make sure it's set correctly
    if (characterData?.token_url) {
      console.log('Token URL found in character data:', characterData.token_url);
      setFormData(prev => ({
        ...prev,
        token_url: characterData.token_url
      }));
    } else {
      console.log('No token URL found in character data');
    }

  }, [characterData]);

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

  const handlePortraitChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setPortraitUploadError('Only image files are allowed');
      return;
    }
    
    // Clear previous errors
    setPortraitUploadError('');
    setPortraitUploading(true);
    
    try {
      // Create FormData object
      const filename = file.name.replace(/\s+/g, '-').toLowerCase();
      
      // Upload file to Vercel Blob Storage
      const response = await fetch(
        `/api/character/upload?filename=${encodeURIComponent(filename)}&characterId=${formData.id}&type=portrait`,
        {
          method: 'POST',
          body: file,
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload portrait');
      }
      
      // Update form data with the portrait URL
      setFormData(prev => ({ ...prev, portrait_url: result.url }));
      setCurrentPortraitUrl(result.url);
      
      // Reset file input
      if (portraitInputRef.current) {
        portraitInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error uploading portrait:', err);
      setPortraitUploadError(err.message || 'Failed to upload portrait');
    } finally {
      setPortraitUploading(false);
    }
  };

  const handleTokenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setTokenUploadError('Only image files are allowed');
      return;
    }
    
    // Clear previous errors
    setTokenUploadError('');
    setTokenUploading(true);
    
    try {
      // Create FormData object
      const filename = file.name.replace(/\s+/g, '-').toLowerCase();
      
      // Upload file to Vercel Blob Storage
      const response = await fetch(
        `/api/character/upload?filename=${encodeURIComponent(filename)}&characterId=${formData.id}&type=token`,
        {
          method: 'POST',
          body: file,
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload token');
      }
      
      // Update form data with the token URL
      setFormData(prev => ({ ...prev, token_url: result.url }));
      setCurrentTokenUrl(result.url);
      
      // Reset file input
      if (tokenInputRef.current) {
        tokenInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error uploading token:', err);
      setTokenUploadError(err.message || 'Failed to upload token');
    } finally {
      setTokenUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process the form data before submission
      const submissionData: Record<string, any> = { ...formData };

      console.log('Submitting form data:', submissionData);
      
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

      const response = await fetch(`/api/character/${formData.id}`, {
        method: 'POST', // Using POST as the API expects POST for updates
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update character');
      }

      // Extract character from the response and redirect to its page
      if (data.character) {
        console.log('Character updated successfully:', data.character);
        router.push(`/character/${data.character.slug}`);
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', data);
        throw new Error('Invalid server response format');
      }
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

          <div className="flex flex-col">
            <label htmlFor="portraitUpload" className="mb-1 font-medium">Character Portrait</label>
            <div className="space-y-2">
              {currentPortraitUrl && (
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-20 border rounded overflow-hidden">
                    <img 
                      src={currentPortraitUrl} 
                      alt="Character Portrait" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Link 
                    href={currentPortraitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    View Full Size
                  </Link>
                </div>
              )}
              
              <input
                type="file"
                id="portraitUpload"
                ref={portraitInputRef}
                accept="image/*"
                onChange={handlePortraitChange}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 w-full"
                disabled={portraitUploading}
              />
              
              {portraitUploading && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading portrait... Please wait.
                </div>
              )}
              
              {portraitUploadError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {portraitUploadError}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                Upload your character portrait. Recommended size: 500x500px.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="tokenUpload" className="mb-1 font-medium">Character Token</label>
            <div className="space-y-2">
              {currentTokenUrl && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-16 border rounded-full overflow-hidden">
                    <img 
                      src={currentTokenUrl} 
                      alt="Character Token" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Link 
                    href={currentTokenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    View Full Size
                  </Link>
                </div>
              )}
              
              <input
                type="file"
                id="tokenUpload"
                ref={tokenInputRef}
                accept="image/*"
                onChange={handleTokenChange}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 w-full"
                disabled={tokenUploading}
              />
              
              {tokenUploading && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading token... Please wait.
                </div>
              )}
              
              {tokenUploadError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {tokenUploadError}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                Upload your character token for virtual tabletops. Recommended size: 256x256px.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center justify-middle">
            <label htmlFor="title">Title</label>
            <p className="text-sm text-gray-500 mt-1">The title for this character's profile. Usually includes their name.</p>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 w-full"
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-middle">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 w-full"
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-middle">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 w-full"
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

// Character Edit View with Providers
const CharacterEditView = ({ session, character }: { session: any, character: any }) => {
  return (
    <Providers session={session}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Character</h1>
        <CharacterEditForm characterData={character} />
      </div>
    </Providers>
  );
};

export default CharacterEditView;
