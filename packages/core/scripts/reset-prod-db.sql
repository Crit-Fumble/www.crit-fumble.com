-- Reset Production Database Script
-- This will drop all tables and recreate them with our new schema

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "UserWorldAnvil" CASCADE;
DROP TABLE IF EXISTS "UserRoll20" CASCADE;
DROP TABLE IF EXISTS "UserDndBeyond" CASCADE;
DROP TABLE IF EXISTS "UserDiscord" CASCADE;
DROP TABLE IF EXISTS "PartyRoll20" CASCADE;
DROP TABLE IF EXISTS "PartyDndBeyond" CASCADE;
DROP TABLE IF EXISTS "PartyDiscord" CASCADE;
DROP TABLE IF EXISTS "Party" CASCADE;
DROP TABLE IF EXISTS "GameSystem" CASCADE;
DROP TABLE IF EXISTS "GameSession" CASCADE;
DROP TABLE IF EXISTS "CampaignWorldAnvil" CASCADE;
DROP TABLE IF EXISTS "CampaignDiscord" CASCADE;
DROP TABLE IF EXISTS "Character" CASCADE;
DROP TABLE IF EXISTS "Campaign" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "Site" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Post" CASCADE;
DROP TABLE IF EXISTS "Example" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Note: After running this, use `npm run db:push:prod` to recreate tables with new schema