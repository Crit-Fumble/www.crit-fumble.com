import { Suspense } from 'react';
import { getServerSession } from '@cfg/core/server/config/auth';
import { redirect } from 'next/navigation';
import BotDashboard from './components/BotDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Bot Management - Admin Dashboard',
  description: 'Manage Discord bot settings and scheduled tasks',
};

export default async function BotManagementPage() {
  const session = await getServerSession();

  // Check authentication and admin permissions
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch additional user data to verify admin status
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    redirect('/auth/signin');
  }

  const userData = await response.json();
  
  if (!userData.admin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Bot Management</h1>
      
      <Suspense fallback={<LoadingSpinner />}>
        <BotDashboard />
      </Suspense>
    </div>
  );
}
