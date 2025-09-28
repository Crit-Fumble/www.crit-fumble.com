/**
 * Admin utilities for checking Discord admin status
 */

/**
 * Parse Discord admin IDs from environment variable
 * @returns Array of Discord admin IDs
 */
export function getDiscordAdminIds(): string[] {
  const adminIds = process.env.DISCORD_ADMIN_IDS;
  if (!adminIds) {
    return [];
  }
  
  try {
    // Handle array format like [id1,id2,id3] or JSON array format
    const cleaned = adminIds.replace(/^\[|\]$/g, ''); // Remove brackets
    return cleaned.split(',').map(id => id.trim()).filter(Boolean);
  } catch (error) {
    console.error('Error parsing DISCORD_ADMIN_IDS:', error);
    return [];
  }
}

/**
 * Check if a Discord ID is in the admin list
 * @param discordId Discord user ID
 * @returns True if the user is a Discord admin
 */
export function isDiscordAdmin(discordId: string): boolean {
  const adminIds = getDiscordAdminIds();
  return adminIds.includes(discordId);
}

/**
 * Log admin check for debugging
 * @param discordId Discord user ID
 * @param isAdmin Whether the user is an admin
 */
export function logAdminCheck(discordId: string, isAdmin: boolean): void {
  const adminIds = getDiscordAdminIds();
  console.log(`🛡️ Admin Check: Discord ID ${discordId} | Is Admin: ${isAdmin} | Admin IDs: [${adminIds.join(', ')}]`);
}