-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_campaign_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_dd_beyond_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_discord_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_party_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_player_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_campaign_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_dd_beyond_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_gm_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_roll20_fkey";

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_session_fkey";

-- DropIndex
DROP INDEX "Character_campaign_idx";

-- DropIndex
DROP INDEX "Character_party_idx";

-- DropIndex
DROP INDEX "Character_player_idx";

-- DropIndex
DROP INDEX "Character_slug_idx";

-- DropIndex
DROP INDEX "Party_campaign_idx";

-- DropIndex
DROP INDEX "Party_gm_idx";

-- DropIndex
DROP INDEX "Party_slug_idx";

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "parentParty" TEXT;

-- CreateTable
CREATE TABLE "PartyDiscord" (
    "id" TEXT NOT NULL,
    "roleId" TEXT,
    "voiceChannelId" TEXT,
    "sideChatThreadId" TEXT,
    "questLogThreadId" TEXT,
    "gameplayThreadId" TEXT,

    CONSTRAINT "PartyDiscord_pkey" PRIMARY KEY ("id")
);
