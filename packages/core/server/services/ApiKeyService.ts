import { 
  ApiKey, 
  ApiProvider, 
  ApiKeyCreateInput, 
  ApiKeyUpdateInput 
} from '../../models/auth/ApiKey';
import { IApiKeyService } from '../../models/auth/ApiKeyService';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Service implementation for API key management
 */
export class ApiKeyService implements IApiKeyService {
  /**
   * Get an API key by ID
   */
  async getById(id: string): Promise<ApiKey | null> {
    try {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id }
      });
      
      return apiKey as ApiKey | null;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }
  
  /**
   * Get API keys for a user and provider
   */
  async getForUser(userId: string, provider?: ApiProvider): Promise<ApiKey[]> {
    try {
      const apiKeys = await prisma.apiKey.findMany({
        where: { 
          userId,
          provider: provider ? provider : undefined
        }
      });
      
      return apiKeys as ApiKey[];
    } catch (error) {
      console.error('Error getting API keys for user:', error);
      return [];
    }
  }
  
  /**
   * Create a new API key
   */
  async create(input: ApiKeyCreateInput): Promise<ApiKey> {
    try {
      const apiKey = await prisma.apiKey.create({
        data: {
          id: randomUUID(),
          userId: input.userId,
          provider: input.provider,
          key: input.key,
          token: input.token,
          name: input.name || `${input.provider} Key`
        }
      });
      
      return apiKey as ApiKey;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }
  
  /**
   * Update an API key
   */
  async update(id: string, input: ApiKeyUpdateInput): Promise<ApiKey> {
    try {
      const apiKey = await prisma.apiKey.update({
        where: { id },
        data: {
          key: input.key,
          token: input.token,
          name: input.name
        }
      });
      
      return apiKey as ApiKey;
    } catch (error) {
      console.error('Error updating API key:', error);
      throw error;
    }
  }
  
  /**
   * Delete an API key
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.apiKey.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }
  
  /**
   * Validate an API key (tests connection with provider)
   */
  async validate(id: string): Promise<{ valid: boolean; message?: string }> {
    try {
      const apiKey = await this.getById(id);
      if (!apiKey) {
        return { valid: false, message: 'API key not found' };
      }
      
      switch (apiKey.provider) {
        case ApiProvider.WORLD_ANVIL:
          return await this.validateWorldAnvilKey(apiKey);
        case ApiProvider.OPENAI:
          return await this.validateOpenAIKey(apiKey);
        default:
          return { valid: false, message: 'Unsupported provider' };
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      return { valid: false, message: (error as Error).message };
    }
  }
  
  /**
   * Validate a WorldAnvil API key
   */
  private async validateWorldAnvilKey(apiKey: ApiKey): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!apiKey.key || !apiKey.token) {
        return { valid: false, message: 'WorldAnvil requires both API key and token' };
      }
      
      const client = new WorldAnvilApiClient({
        apiKey: apiKey.key,
        apiToken: apiKey.token
      });
      
      // Try to get user profile to validate credentials
      await client.getUserProfile();
      
      return { valid: true };
    } catch (error) {
      return { valid: false, message: (error as Error).message };
    }
  }
  
  /**
   * Validate an OpenAI API key
   */
  private async validateOpenAIKey(apiKey: ApiKey): Promise<{ valid: boolean; message?: string }> {
    try {
      if (!apiKey.key) {
        return { valid: false, message: 'OpenAI API key is required' };
      }
      
      const openai = new OpenAI({ 
        apiKey: apiKey.key,
        organization: apiKey.token // Organization ID is optional
      });
      
      // Try to list models to validate the API key
      await openai.models.list();
      
      return { valid: true };
    } catch (error) {
      return { valid: false, message: (error as Error).message };
    }
  }
}
