/**
 * Implementation for User-related functions and utilities
 */
/**
 * Type guard to check if an object is a valid User
 */
export function isUser(obj) {
    return (obj &&
        typeof obj === 'object' &&
        typeof obj.id === 'string');
}
/**
 * Type guard to check if an object is a valid partial User
 */
export function isPartialUser(obj) {
    return (obj &&
        typeof obj === 'object' &&
        ((obj.id !== undefined && typeof obj.id === 'string') ||
            (obj.email !== undefined && (typeof obj.email === 'string' || obj.email === null))));
}
//# sourceMappingURL=User.js.map