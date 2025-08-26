import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the dependencies
jest.mock('../config.js', () => ({
  __esModule: true,
  default: {
    api: {
      enabled: true,
      port: 3001,
      key: 'test-api-key'
    },
    isProduction: false,
    bot: {
      version: '1.0.0'
    }
  }
}));

jest.mock('../Launcher.js', () => ({
  client: {
    isReady: jest.fn(() => true),
    guilds: {
      cache: {
        size: 5
      }
    }
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  },
  cronJobManager: {
    getRunningJobs: jest.fn(() => ['testJob1', 'testJob2']),
    startJob: jest.fn(() => true),
    stopJob: jest.fn(() => true)
  }
}));

// Import the module under test - but isolate the Express app
let app;

// Helper to get the Express app instance
const getApp = async () => {
  if (!app) {
    // This is a bit of a hack to get access to the Express app without starting the server
    // We'll temporarily replace the listen method to capture the app instance
    const originalListen = express.application.listen;
    express.application.listen = function() {
      app = this;
      return { close: jest.fn() };
    };
    
    await import('../api/server.js');
    
    // Restore original listen method
    express.application.listen = originalListen;
  }
  return app;
};

describe('Bot API Server', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    app = await getApp();
  });
  
  describe('Health Endpoint', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
  
  describe('Authentication Middleware', () => {
    test('Protected endpoints should require authentication', async () => {
      // Without authentication
      const response = await request(app).get('/status');
      expect(response.status).toBe(401);
      
      // With incorrect authentication
      const wrongAuthResponse = await request(app)
        .get('/status')
        .set('Authorization', 'Bearer wrong-key');
      expect(wrongAuthResponse.status).toBe(401);
      
      // With correct authentication
      const correctAuthResponse = await request(app)
        .get('/status')
        .set('Authorization', 'Bearer test-api-key');
      expect(correctAuthResponse.status).toBe(200);
    });
  });
  
  describe('Status Endpoint', () => {
    test('GET /status should return bot status', async () => {
      const response = await request(app)
        .get('/status')
        .set('Authorization', 'Bearer test-api-key');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('online', true);
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('guilds', 5);
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });
  
  describe('Cron Jobs Endpoints', () => {
    test('GET /cronjobs should return list of jobs', async () => {
      const response = await request(app)
        .get('/cronjobs')
        .set('Authorization', 'Bearer test-api-key');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2); // We mocked 2 jobs
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('active');
    });
    
    test('POST /cronjobs/toggle should toggle job status', async () => {
      // Test starting a job
      const startResponse = await request(app)
        .post('/cronjobs/toggle')
        .set('Authorization', 'Bearer test-api-key')
        .send({ jobId: 'testJob1', active: true });
      
      expect(startResponse.status).toBe(200);
      expect(startResponse.body).toHaveProperty('success', true);
      expect(startResponse.body).toHaveProperty('jobId', 'testJob1');
      expect(startResponse.body).toHaveProperty('active', true);
      
      // Test stopping a job
      const stopResponse = await request(app)
        .post('/cronjobs/toggle')
        .set('Authorization', 'Bearer test-api-key')
        .send({ jobId: 'testJob2', active: false });
      
      expect(stopResponse.status).toBe(200);
      expect(stopResponse.body).toHaveProperty('success', true);
      expect(stopResponse.body).toHaveProperty('jobId', 'testJob2');
      expect(stopResponse.body).toHaveProperty('active', false);
    });
    
    test('POST /cronjobs/toggle should validate input', async () => {
      // Missing jobId
      const missingIdResponse = await request(app)
        .post('/cronjobs/toggle')
        .set('Authorization', 'Bearer test-api-key')
        .send({ active: true });
      
      expect(missingIdResponse.status).toBe(400);
      
      // Missing active flag
      const missingActiveResponse = await request(app)
        .post('/cronjobs/toggle')
        .set('Authorization', 'Bearer test-api-key')
        .send({ jobId: 'testJob1' });
      
      expect(missingActiveResponse.status).toBe(400);
    });
  });
});
