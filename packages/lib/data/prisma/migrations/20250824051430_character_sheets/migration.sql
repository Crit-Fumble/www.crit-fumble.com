-- Create CharacterSheet table
CREATE TABLE "CharacterSheet" (
    "id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,
    "game_system_id" TEXT, -- not required, user might want to use a PDF and play a different system
    "pdf_url" TEXT,
    "sheet_data" JSONB,
    "integration_data" JSONB, -- roll20, dndbeyond, world anvil, etc
    "title" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "bio" TEXT,
    "history" JSONB[],
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterSheet_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_game_system_id_fkey" FOREIGN KEY ("game_system_id") REFERENCES "GameSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Alter Character table to remove redundant fields
ALTER TABLE "Character" DROP COLUMN "game_system_id";
ALTER TABLE "Character" DROP COLUMN "party_id";
ALTER TABLE "Character" DROP COLUMN "world_anvil_id";
ALTER TABLE "Character" DROP COLUMN "campaign";
ALTER TABLE "Character" DROP COLUMN "game_system";
ALTER TABLE "Character" DROP COLUMN "character_sheets";

ALTER TABLE "Character" ADD COLUMN "title" TEXT;
ALTER TABLE "Character" ADD COLUMN "summary" TEXT;
ALTER TABLE "Character" ADD COLUMN "description" TEXT;

-- Keep sheet_data fields on all tables as they're still needed

-- Update Campaign model to properly reference GameSystem
ALTER TABLE "Campaign" DROP COLUMN "system";
ALTER TABLE "Campaign" ADD COLUMN "game_system_id" TEXT;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_game_system_id_fkey" FOREIGN KEY ("game_system_id") REFERENCES "GameSystem"("id") ON DELETE SET NULL;

-- Update Party model to properly reference Campaign
ALTER TABLE "Party" DROP COLUMN "campaign";
ALTER TABLE "Party" ADD COLUMN "campaign_id" TEXT;
ALTER TABLE "Party" ADD CONSTRAINT "Party_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE SET NULL;

-- No primary sheet concept needed

-- Add necessary indexes for improved query performance
CREATE INDEX "CharacterSheet_character_id_idx" ON "CharacterSheet"("character_id");
CREATE INDEX "CharacterSheet_game_system_id_idx" ON "CharacterSheet"("game_system_id");
CREATE INDEX "CharacterSheet_is_active_idx" ON "CharacterSheet"("is_active");

-- Ensure character sheets have a link to campaign and party
ALTER TABLE "CharacterSheet" ADD COLUMN "campaign_id" TEXT;
ALTER TABLE "CharacterSheet" ADD COLUMN "party_id" TEXT;

-- Add foreign key constraints for new columns
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_campaign_id_fkey" 
  FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE SET NULL;
ALTER TABLE "CharacterSheet" ADD CONSTRAINT "CharacterSheet_party_id_fkey" 
  FOREIGN KEY ("party_id") REFERENCES "Party"("id") ON DELETE SET NULL;

-- Additional metadata fields for character sheets
ALTER TABLE "CharacterSheet" ADD COLUMN "version" INTEGER DEFAULT 1;
ALTER TABLE "CharacterSheet" ADD COLUMN "last_played" TIMESTAMP(3);

-- Add admin flag for campaign viewing permissions
ALTER TABLE "CharacterSheet" ADD COLUMN "admin_only" BOOLEAN DEFAULT false;

-- Add display order field for multiple sheets
ALTER TABLE "CharacterSheet" ADD COLUMN "display_order" INTEGER DEFAULT 0;

-- Update Character table
ALTER TABLE "Character" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Character" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Comment: This migration refactors the database structure to support multiple character sheets per character,
-- moving character data from the Character table to the CharacterSheet table.
-- It also improves relations between tables and removes redundant fields.
