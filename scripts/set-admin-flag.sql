-- Temporary SQL script to set admin flag for a specific Discord user ID

-- Update the admin flag for the user with the given Discord ID
UPDATE "User"
SET admin = TRUE
WHERE discord_id = '451207409915002882';

-- Verify the update
SELECT id, discord_id, admin
FROM "User"
WHERE discord_id = '451207409915002882';