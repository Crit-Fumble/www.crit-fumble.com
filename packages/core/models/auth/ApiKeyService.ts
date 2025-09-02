import { ApiKey, ApiProvider, ApiKeyCreateInput, ApiKeyUpdateInput } from './ApiKey';

/**
 * Service interface for API key management
 */
export interface IApiKeyService {
  /**
   * Get an API key by ID
   */
  getById(id: string): Promise<ApiKey | null>;
  
  /**
   * Get API keys for a user and provider
   */
  getForUser(userId: string, provider?: ApiProvider): Promise<ApiKey[]>;
  
  /**
   * Create a new API key
   */
  create(input: ApiKeyCreateInput): Promise<ApiKey>;
  
  /**
   * Update an API key
   */
  update(id: string, input: ApiKeyUpdateInput): Promise<ApiKey>;
  
  /**
   * Delete an API key
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Validate an API key (tests connection with provider)
   */
  validate(id: string): Promise<{ valid: boolean; message?: string }>;
}
