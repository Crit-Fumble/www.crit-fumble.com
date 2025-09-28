import { Metadata } from "next";
import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import LinkedAccountsClient from '../lib/components/LinkedAccountsClient';

export const metadata: Metadata = {
  title: "Linked Accounts | Crit-Fumble Gaming",
  description: "Manage your connected accounts and integrations",
};

// This page uses dynamic features (cookies)
export const dynamic = 'force-dynamic';

export default async function LinkedAccountsPage() {
  // Get session from auth utility
  const userData = await getSession();

  // Redirect to home if not logged in
  if (!userData) {
    redirect('/');
  }

  return <LinkedAccountsClient userData={userData} />;
}