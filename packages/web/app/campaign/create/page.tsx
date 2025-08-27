"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@cfg/next/views/components/blocks/Card";

export default function CreateCampaignPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    system: "D&D 5E", // Default value
  });

  // Remove admin check - allow any authenticated user to create campaigns

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkboxInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkboxInput.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Campaign name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success("Campaign created successfully!");
        router.push(`/campaign/${data.campaign.slug}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Campaign</h1>
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>Create New Campaign</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium">
                Campaign Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="system" className="mb-1 font-medium">
                Game System
              </label>
              <select
                id="system"
                name="system"
                value={formData.system}
                onChange={handleChange}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="dnd5e">D&D 5E</option>
                <option value="cypher">Cypher</option>
                <option value="swade">Savage Worlds</option>
                <option value="Other">Other</option>
              </select>
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
