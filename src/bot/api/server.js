import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from '../config.js';
import { client, logger, cronJobManager } from '../Launcher.js';

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.isProduction
    ? [config.api.url] // In production, only allow the main app
    : '*' // In development, allow all origins
}));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// Authentication middleware
const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers.authorization?.split(' ')[1];
  
  if (!apiKey || apiKey !== config.api.key) {
    logger.warn(`Unauthorized API request from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// API Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Status endpoint - requires authentication
app.get('/status', authenticateRequest, (req, res) => {
  const uptime = process.uptime();
  const uptimeStr = formatUptime(uptime);
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    online: client && client.isReady(),
    uptime: uptimeStr,
    memory: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
    guilds: client?.guilds.cache.size || 0,
    version: config.bot.version
  });
});

// Cron jobs endpoints
app.get('/cronjobs', authenticateRequest, (req, res) => {
  const activeJobs = cronJobManager.getRunningJobs();
  const jobDetailsPromises = activeJobs.map(async (jobName) => {
    try {
      // This would require extending the CronJobManager to provide more details
      // For now, we're returning basic information
      return {
        id: jobName,
        name: jobName,
        description: `Scheduled task: ${jobName}`,
        schedule: '*/30 * * * *', // This would need to come from the actual job
        active: true,
        lastRun: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Mock data
        nextRun: new Date(Date.now() + Math.random() * 3600000).toISOString()  // Mock data
      };
    } catch (error) {
      logger.error(`Error getting details for job ${jobName}: ${error}`);
      return null;
    }
  });
  
  Promise.all(jobDetailsPromises)
    .then(jobDetails => {
      const validJobs = jobDetails.filter(Boolean);
      res.status(200).json(validJobs);
    })
    .catch(error => {
      logger.error(`Error getting cron job details: ${error}`);
      res.status(500).json({ error: 'Failed to get cron job details' });
    });
});

// Toggle cron job
app.post('/cronjobs/toggle', authenticateRequest, async (req, res) => {
  const { jobId, active } = req.body;
  
  if (!jobId || typeof active !== 'boolean') {
    return res.status(400).json({ error: 'Missing required fields: jobId and active' });
  }
  
  try {
    const success = active 
      ? cronJobManager.startJob(jobId)
      : cronJobManager.stopJob(jobId);
    
    if (!success) {
      return res.status(404).json({ error: `Job ${jobId} not found or already in desired state` });
    }
    
    res.status(200).json({ 
      success: true,
      jobId,
      active,
      message: `Job ${jobId} ${active ? 'started' : 'stopped'} successfully` 
    });
  } catch (error) {
    logger.error(`Error toggling cron job ${jobId}: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restart bot
app.post('/restart', authenticateRequest, (req, res) => {
  logger.info('Restart requested via API');
  
  // Send response before restarting
  res.status(200).json({ message: 'Bot restart initiated' });
  
  // Wait a moment before restarting to allow response to be sent
  setTimeout(() => {
    logger.info('Restarting bot');
    
    // In a production environment, this would trigger a process manager
    // such as PM2 to restart the bot process
    process.exit(0);
  }, 1000);
});

// Start the server if API is enabled
export function startApiServer() {
  if (!config.api.enabled) {
    logger.info('Bot API server is disabled');
    return;
  }
  
  const port = config.api.port;
  
  app.listen(port, () => {
    logger.info(`Bot API server listening on port ${port}`);
  });
}

// Helper functions
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}
