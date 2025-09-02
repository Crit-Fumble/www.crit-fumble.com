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
 * Initialize config from environment variables
 */
function initFromEnv(): OpenAiConfig {
  return {
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '',
    defaultChatModel: process.env.OPENAI_CHAT_MODEL || defaultConfig.defaultChatModel,
    defaultEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL || defaultConfig.defaultEmbeddingModel,
    defaultTemperature: parseFloat(process.env.OPENAI_TEMPERATURE || defaultConfig.defaultTemperature.toString()),
    defaultMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || defaultConfig.defaultMaxTokens.toString(), 10),
    defaultImageSize: process.env.OPENAI_IMAGE_SIZE || defaultConfig.defaultImageSize,
    organization: process.env.OPENAI_ORGANIZATION,
  };
}

/**
 * Initialize config instance once
 */
function initializeConfig(): void {
  // Only initialize if not already initialized with custom values
  if (configInstance.apiKey === defaultConfig.apiKey) {
    configInstance = initFromEnv();
  }
}

/**
 * Set OpenAI configuration programmatically
 * @param config Configuration options
 */
export function setOpenAiConfig(config: Partial<OpenAiConfig>): void {
  // Initialize from environment first if not already done
  if (configInstance.apiKey === defaultConfig.apiKey) {
    configInstance = initFromEnv();
  }
  
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
  // Initialize from environment if not already done
  initializeConfig();
  
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
