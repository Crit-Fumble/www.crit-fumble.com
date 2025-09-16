/**
 * Utility functions for text manipulation
 */
/**
 * Converts a string into a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export var slugify = function (text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
        .trim(); // Remove leading/trailing spaces
};
//# sourceMappingURL=textUtils.js.map