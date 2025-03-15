/**
 * Converts a string to a slug-friendly format:
 * - Lowercases the string
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Removes consecutive hyphens
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
    .replace(/\-\-+/g, '-')     // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')         // Trim hyphens from start of text
    .replace(/-+$/, '');        // Trim hyphens from end of text
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
