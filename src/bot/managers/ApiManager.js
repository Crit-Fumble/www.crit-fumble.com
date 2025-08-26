import fetch from 'node-fetch';
import config from '../config.js';

export default class ApiManager {
  constructor(logger) {
    this.logger = logger;
    this.baseUrl = `${config.api.url}/api`;
    this.apiKey = config.api.key;
  }

  /**
   * Make an authenticated API call to the main application
   * @param {string} endpoint - API endpoint to call
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {object} data - Data to send in the request body
   * @returns {Promise<object>} API response
   */
  async callApi(endpoint, method = 'GET', data = null) {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : ''
      };
      
      const options = {
        method,
        headers
      };
      
      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }
      
      this.logger.debug(`API Call: ${method} ${url}`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      this.logger.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Convenience methods for common API operations
  async get(endpoint) {
    return this.callApi(endpoint, 'GET');
  }
  
  async post(endpoint, data) {
    return this.callApi(endpoint, 'POST', data);
  }
  
  async put(endpoint, data) {
    return this.callApi(endpoint, 'PUT', data);
  }
  
  async delete(endpoint) {
    return this.callApi(endpoint, 'DELETE');
  }

  /**
   * Check if the API is available
   * @returns {Promise<boolean>} Whether the API is available
   */
  async isApiAvailable() {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      this.logger.warn(`API health check failed: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Get campaign information
   * @param {string} campaignId - The ID of the campaign to fetch
   * @returns {Promise<object>} Campaign data
   */
  async getCampaign(campaignId) {
    return this.get(`/campaign/${campaignId}`);
  }
  
  /**
   * Get scheduled events for a campaign
   * @param {string} campaignId - The ID of the campaign to fetch events for
   * @returns {Promise<Array>} List of scheduled events
   */
  async getCampaignEvents(campaignId) {
    return this.get(`/campaign/${campaignId}/events`);
  }
  
  /**
   * Notify the web application about a Discord event
   * @param {string} eventType - Type of event (voice_channel_joined, message_sent, etc)
   * @param {object} eventData - Event data
   */
  async notifyDiscordEvent(eventType, eventData) {
    return this.post('/discord/events', {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Update user presence in the database
   * @param {string} userId - Discord user ID
   * @param {string} status - User status (online, offline, etc)
   * @param {object} activity - User activity data
   */
  async updateUserPresence(userId, status, activity = null) {
    return this.put(`/users/${userId}/presence`, {
      status,
      activity,
      lastSeen: new Date().toISOString()
    });
  }
}
