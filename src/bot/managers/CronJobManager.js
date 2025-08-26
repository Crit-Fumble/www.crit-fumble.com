import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CronJobManager {
  constructor(client, logger) {
    this.client = client;
    this.logger = logger;
    this.jobs = new Map();
    this.cronJobsPath = path.join(__dirname, '..', 'cronJobs');
  }

  async startAll() {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(this.cronJobsPath)) {
        this.logger.info(`Cron jobs directory ${this.cronJobsPath} not found, creating it.`);
        fs.mkdirSync(this.cronJobsPath, { recursive: true });
        return;
      }
      
      const jobFiles = fs.readdirSync(this.cronJobsPath).filter(file => file.endsWith('.js'));
      
      this.logger.info(`Found ${jobFiles.length} cron job files.`);
      
      for (const file of jobFiles) {
        try {
          const filePath = path.join(this.cronJobsPath, file);
          const jobModule = await import(`file://${filePath}`);
          
          if ('schedule' in jobModule.default && 'execute' in jobModule.default && 'name' in jobModule.default) {
            const { name, schedule, execute } = jobModule.default;
            
            if (!cron.validate(schedule)) {
              this.logger.error(`Invalid cron schedule "${schedule}" for job "${name}" in file ${file}`);
              continue;
            }
            
            const job = cron.schedule(schedule, async () => {
              this.logger.info(`Running cron job: ${name}`);
              try {
                await execute(this.client, this.logger);
              } catch (error) {
                this.logger.error(`Error in cron job ${name}: ${error.message}`);
              }
            });
            
            this.jobs.set(name, job);
            this.logger.info(`Scheduled cron job: ${name} with schedule ${schedule}`);
          } else {
            this.logger.warn(`Cron job file ${file} is missing required properties (name, schedule, or execute).`);
          }
        } catch (error) {
          this.logger.error(`Error loading cron job from file ${file}: ${error.message}`);
        }
      }
      
      this.logger.info(`Started ${this.jobs.size} cron jobs.`);
    } catch (error) {
      this.logger.error(`Error starting cron jobs: ${error.message}`);
    }
  }

  stopAll() {
    for (const [name, job] of this.jobs.entries()) {
      job.stop();
      this.logger.info(`Stopped cron job: ${name}`);
    }
    this.jobs.clear();
  }

  stopJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      this.logger.info(`Stopped cron job: ${name}`);
      return true;
    }
    return false;
  }

  startJob(name) {
    // Find the job file and start it if it exists but isn't running
    if (this.jobs.has(name)) {
      this.logger.warn(`Cron job ${name} is already running.`);
      return false;
    }

    try {
      const jobFiles = fs.readdirSync(this.cronJobsPath).filter(file => file.endsWith('.js'));
      
      for (const file of jobFiles) {
        const filePath = path.join(this.cronJobsPath, file);
        import(`file://${filePath}`).then(jobModule => {
          if (jobModule.default.name === name) {
            const { schedule, execute } = jobModule.default;
            
            if (!cron.validate(schedule)) {
              this.logger.error(`Invalid cron schedule "${schedule}" for job "${name}"`);
              return false;
            }
            
            const job = cron.schedule(schedule, async () => {
              this.logger.info(`Running cron job: ${name}`);
              try {
                await execute(this.client, this.logger);
              } catch (error) {
                this.logger.error(`Error in cron job ${name}: ${error.message}`);
              }
            });
            
            this.jobs.set(name, job);
            this.logger.info(`Started cron job: ${name} with schedule ${schedule}`);
            return true;
          }
        }).catch(error => {
          this.logger.error(`Error importing cron job file ${file}: ${error.message}`);
        });
      }
    } catch (error) {
      this.logger.error(`Error starting cron job ${name}: ${error.message}`);
      return false;
    }
    
    this.logger.warn(`Cron job ${name} not found.`);
    return false;
  }

  getRunningJobs() {
    return Array.from(this.jobs.keys());
  }
}
