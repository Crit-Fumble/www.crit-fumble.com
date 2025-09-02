/**
 * OpenAI Configuration Module
 */
import { OpenAiConfig } from '../../models/OpenAiConfig';

/**
 * Default configuration for OpenAI
 */
const defaultConfig: OpenAiConfig = {
  apiKey: '',
  defaultChatModel: 'gpt-4',
  defaultEmbeddingModel: 'text-embedding-3-small',
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000,
  defaultImageSize: '1024x1024',
  organization: undefined,
};

/**
 * Singleton instance of configuration
 */
let configInstance: OpenAiConfig = { ...defaultConfig };


/**
 * Set OpenAI configuration programmatically
 * @param config Configuration options
 */
export function setOpenAiConfig(config: Partial<OpenAiConfig>): void {
  // Override with provided config
  configInstance = {
    ...configInstance,
    ...config,
  };
  
  // Validate required config
  validateConfig(configInstance);
}

/**
 * Validate that required configuration values are provided
 */
function validateConfig(config: OpenAiConfig): void {
  // Check for required fields
  const missingKeys = REQUIRED_OPENAI_CONFIG_KEYS.filter(key => !config[key as keyof OpenAiConfig]);
  
  if (missingKeys.length > 0) {
    console.warn(`Missing required OpenAI config keys: ${missingKeys.join(', ')}`);
  }
}

/**
 * Get the current OpenAI configuration
 * @returns Current configuration
 */
export function getOpenAiConfig(): OpenAiConfig {
  // Validate config
  validateConfig(configInstance);
  
  return configInstance;
}

/**
 * Required OpenAI config keys
 */
export const REQUIRED_OPENAI_CONFIG_KEYS = [
  'apiKey',
];

/**
 * Reset the OpenAI config to default values (for testing only)
 * @internal This function should only be used in tests
 */
export function resetOpenAiConfigForTests(): void {
  // Only allow this function to be called in test environments
  if (process.env.NODE_ENV !== 'test') {
    console.warn('resetOpenAiConfigForTests() should only be called in test environments');
    return;
  }
  
  // Reset to default values
  configInstance = { ...defaultConfig };
}
