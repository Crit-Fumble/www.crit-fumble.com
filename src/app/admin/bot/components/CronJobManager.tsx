'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { MoreVertical, RefreshCw, Plus, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useToast } from '@/hooks/useToast';

interface CronJob {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  active: boolean;
}

interface CronJobManagerProps {
  cronJobs: CronJob[];
  isLoading: boolean;
  onToggle: (id: string, active: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function CronJobManager({ 
  cronJobs, 
  isLoading, 
  onToggle, 
  onRefresh 
}: CronJobManagerProps) {
  const [processingJobs, setProcessingJobs] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleToggle = async (job: CronJob) => {
    try {
      setProcessingJobs(prev => [...prev, job.id]);
      await onToggle(job.id, !job.active);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: `Failed to ${job.active ? 'stop' : 'start'} the job.`,
        variant: 'destructive',
      });
    } finally {
      setProcessingJobs(prev => prev.filter(id => id !== job.id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Scheduled Jobs
            </CardTitle>
            <CardDescription>
              Manage scheduled tasks and cron jobs for the Discord bot
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Job
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : cronJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No cron jobs found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                cronJobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">
                        {job.schedule}
                      </code>
                    </TableCell>
                    <TableCell>{job.lastRun || 'Never'}</TableCell>
                    <TableCell>{job.nextRun || 'Not scheduled'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={job.active}
                          disabled={processingJobs.includes(job.id)}
                          onCheckedChange={() => handleToggle(job)}
                        />
                        <span className="ml-2 text-sm">
                          {job.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {}}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => {}}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
