/**
 * Test script for admin utilities
 */
import { getDiscordAdminIds, isDiscordAdmin, logAdminCheck } from '../app/lib/admin-utils';

// Test the admin utility functions
console.log('🧪 Testing admin utility functions...');

// Test parsing admin IDs
const adminIds = getDiscordAdminIds();
console.log('Admin IDs from env:', adminIds);

// Test admin check with a known admin ID
const testAdminId = '451207409915002882';
const testNonAdminId = '123456789012345678';

console.log('Testing admin ID:', testAdminId);
logAdminCheck(testAdminId, isDiscordAdmin(testAdminId));

console.log('Testing non-admin ID:', testNonAdminId);
logAdminCheck(testNonAdminId, isDiscordAdmin(testNonAdminId));

console.log('✅ Admin utility test complete');