"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function CreateCampaignPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    system: "D&D 5E", // Default value
    active: true
  });

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (status === "authenticated" && !session?.user?.admin) {
      toast.error("You must be an admin to create campaigns");
      router.push("/dashboard");
    }
  }, [status, session, router]);

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
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">
            Campaign Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter campaign name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="system" className="block font-medium">
            Game System
          </label>
          <select
            id="system"
            name="system"
            value={formData.system}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="D&D 5E">D&D 5E</option>
            <option value="Pathfinder">Pathfinder</option>
            <option value="Call of Cthulhu">Call of Cthulhu</option>
            <option value="Vampire: The Masquerade">Vampire: The Masquerade</option>
            <option value="Star Wars">Star Wars</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="active" className="font-medium">
            Active Campaign
          </label>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
