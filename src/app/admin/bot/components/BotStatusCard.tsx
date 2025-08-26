'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { RefreshCw, Power, BarChart, Server, Users } from 'lucide-react';

interface BotStatusProps {
  status: {
    online: boolean;
    uptime: string;
    memory: string;
    guilds: number;
    version: string;
  };
  isLoading: boolean;
  onRefresh: () => void;
  onRestart: () => void;
}

export default function BotStatusCard({ status, isLoading, onRefresh, onRestart }: BotStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bot Status</span>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {status.online ? 'Online' : 'Offline'}
          </div>
        </CardTitle>
        <CardDescription>
          Current status and performance metrics for the Discord bot
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uptime */}
        <div className="flex flex-col space-y-1 p-4 bg-secondary/20 rounded-md">
          <div className="flex items-center text-sm text-muted-foreground">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Uptime</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="text-lg font-medium">{status.uptime || 'N/A'}</div>
          )}
        </div>
        
        {/* Memory Usage */}
        <div className="flex flex-col space-y-1 p-4 bg-secondary/20 rounded-md">
          <div className="flex items-center text-sm text-muted-foreground">
            <Server className="mr-2 h-4 w-4" />
            <span>Memory</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="text-lg font-medium">{status.memory || 'N/A'}</div>
          )}
        </div>
        
        {/* Servers */}
        <div className="flex flex-col space-y-1 p-4 bg-secondary/20 rounded-md">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>Discord Servers</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="text-lg font-medium">{status.guilds || '0'}</div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span>Version: {status.version || 'unknown'}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRestart}
            disabled={isLoading}
          >
            <Power className="mr-2 h-4 w-4" />
            Restart Bot
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
