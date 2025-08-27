'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import CronJobManager from './CronJobManager';
import BotStatusCard from './BotStatusCard';
import { useToast } from '@/hooks/useToast';

export default function BotDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [botStatus, setBotStatus] = useState({
    online: false,
    uptime: '',
    memory: '',
    guilds: 0,
    version: '',
  });
  const [cronJobs, setCronJobs] = useState([]);
  const { toast } = useToast();

  const fetchBotStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/bot/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bot status');
      }
      
      const data = await response.json();
      setBotStatus(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bot status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCronJobs = async () => {
    try {
      const response = await fetch('/api/admin/bot/cronjobs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cron jobs');
      }
      
      const data = await response.json();
      setCronJobs(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cron jobs. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleCronJob = async (jobId, active) => {
    try {
      const response = await fetch('/api/admin/bot/cronjobs/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, active }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle cron job');
      }
      
      await fetchCronJobs();
      toast({
        title: 'Success',
        description: `Cron job ${active ? 'started' : 'stopped'} successfully.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to toggle cron job. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const restartBot = async () => {
    try {
      const response = await fetch('/api/admin/bot/restart', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to restart bot');
      }
      
      toast({
        title: 'Success',
        description: 'Bot is restarting. This may take a few moments.',
      });
      
      // Wait a bit before refreshing status
      setTimeout(() => {
        fetchBotStatus();
        fetchCronJobs();
      }, 5000);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to restart bot. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBotStatus();
    fetchCronJobs();
    
    // Set up interval to refresh status every 60 seconds
    const intervalId = setInterval(() => {
      fetchBotStatus();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      <BotStatusCard 
        status={botStatus} 
        isLoading={isLoading} 
        onRefresh={fetchBotStatus}
        onRestart={restartBot}
      />
      
      <Tabs defaultValue="cron-jobs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cron-jobs">Cron Jobs</TabsTrigger>
          <TabsTrigger value="events">Event Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cron-jobs">
          <CronJobManager 
            cronJobs={cronJobs} 
            isLoading={isLoading} 
            onToggle={toggleCronJob}
            onRefresh={fetchCronJobs}
          />
        </TabsContent>
        
        <TabsContent value="events">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Event Logs</h3>
            <p className="text-muted-foreground">
              Bot event logs will be displayed here. (Implementation pending)
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Bot Settings</h3>
            <p className="text-muted-foreground">
              Bot configuration settings will be displayed here. (Implementation pending)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
