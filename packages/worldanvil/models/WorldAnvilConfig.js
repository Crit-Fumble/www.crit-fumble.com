/**
 * World Anvil configuration module
 * Provides access to World Anvil configuration for API access
 *
 * This module accepts configuration directly from the host application.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Default configuration
var defaultConfig = {
    apiUrl: 'https://www.worldanvil.com/api/v1',
    apiKey: '',
    accessToken: undefined
};
// Singleton instance of the configuration
var configInstance = __assign({}, defaultConfig);
/**
 * Required configuration keys that must be set
 */
export var REQUIRED_CONFIG_KEYS = ['apiUrl', 'apiKey'];
/**
 * Set World Anvil configuration from host application
 * @param config Configuration object to use
 * @throws Error if required configuration keys are missing
 */
export function setWorldAnvilConfig(config) {
    // For partial updates, use the existing config as base
    var currentConfig = __assign({}, defaultConfig);
    // Apply new config values
    Object.assign(currentConfig, config);
    // Store the new configuration
    configInstance = currentConfig;
}
/**
 * Get World Anvil configuration
 * @returns World Anvil configuration
 * @throws Error if configuration has not been set
 */
export function getWorldAnvilConfig() {
    // Validate required fields
    if (!configInstance.apiUrl || configInstance.apiUrl === defaultConfig.apiUrl) {
        throw new Error('World Anvil configuration not properly set. Call setWorldAnvilConfig() with required parameters first.');
    }
    if (!configInstance.apiKey || configInstance.apiKey === defaultConfig.apiKey) {
        throw new Error('World Anvil configuration not properly set. Call setWorldAnvilConfig() with required parameters first.');
    }
    return configInstance;
}
/**
 * Reset the WorldAnvil config to default values (for testing only)
 * @internal This function should only be used in tests
 */
export function resetWorldAnvilConfigForTests() {
    // Only allow this function to be called in test environments
    if (process.env.NODE_ENV !== 'test') {
        console.warn('resetWorldAnvilConfigForTests() should only be called in test environments');
        return;
    }
    // Reset to default values
    configInstance = __assign({}, defaultConfig);
}
//# sourceMappingURL=WorldAnvilConfig.js.map