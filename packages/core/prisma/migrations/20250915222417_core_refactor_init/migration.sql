/*
  Warnings:

  - You are about to drop the column `active` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `discord` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `gms` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_data` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `world_anvil` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_id` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `discord` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `dnd_beyond_id` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `pdf_url` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `player` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `roll20` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_data` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `dd_beyond` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discord` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roll20` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sheet_data` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `world_anvil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CampaignDiscord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignWorldAnvil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterSheet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameSystem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartyDiscord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartyDndBeyond` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PartyRoll20` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDiscord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDndBeyond` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoll20` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWorldAnvil` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[discord_post_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_chat_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_thread_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_forum_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_voice_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_role_id]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_post_id]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_thread_id]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "Campaign_rpg_system_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "discord";

-- DropForeignKey
ALTER TABLE "public"."Campaign" DROP CONSTRAINT "world_anvil";

-- DropForeignKey
ALTER TABLE "public"."Character" DROP CONSTRAINT "Character_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterSheet" DROP CONSTRAINT "CharacterSheet_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterSheet" DROP CONSTRAINT "CharacterSheet_character_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterSheet" DROP CONSTRAINT "CharacterSheet_party_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."CharacterSheet" DROP CONSTRAINT "CharacterSheet_rpg_system_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Party" DROP CONSTRAINT "Party_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "dd_beyond";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "discord";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "roll20";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "world_anvil";

-- AlterTable
ALTER TABLE "public"."Campaign" DROP COLUMN "active",
DROP COLUMN "discord",
DROP COLUMN "gms",
DROP COLUMN "name",
DROP COLUMN "sheet_data",
DROP COLUMN "world_anvil",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discord_chat_id" TEXT,
ADD COLUMN     "discord_forum_id" TEXT,
ADD COLUMN     "discord_post_id" TEXT,
ADD COLUMN     "discord_role_id" TEXT,
ADD COLUMN     "discord_thread_id" TEXT,
ADD COLUMN     "discord_voice_id" TEXT,
ADD COLUMN     "gm_ids" TEXT[],
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rpg_world_id" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "worldanvil_campaign_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Character" DROP COLUMN "campaign_id",
DROP COLUMN "discord",
DROP COLUMN "dnd_beyond_id",
DROP COLUMN "pdf_url",
DROP COLUMN "player",
DROP COLUMN "roll20",
DROP COLUMN "sheet_data",
ADD COLUMN     "discord_post_id" TEXT,
ADD COLUMN     "discord_thread_id" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "worldanvil_character_id" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "dd_beyond",
DROP COLUMN "discord",
DROP COLUMN "roll20",
DROP COLUMN "sheet_data",
DROP COLUMN "world_anvil",
ADD COLUMN     "data" JSONB,
ADD COLUMN     "discord_id" TEXT,
ADD COLUMN     "worldanvil_id" TEXT;

-- DropTable
DROP TABLE "public"."CampaignDiscord";

-- DropTable
DROP TABLE "public"."CampaignWorldAnvil";

-- DropTable
DROP TABLE "public"."CharacterSheet";

-- DropTable
DROP TABLE "public"."GameSession";

-- DropTable
DROP TABLE "public"."GameSystem";

-- DropTable
DROP TABLE "public"."Party";

-- DropTable
DROP TABLE "public"."PartyDiscord";

-- DropTable
DROP TABLE "public"."PartyDndBeyond";

-- DropTable
DROP TABLE "public"."PartyRoll20";

-- DropTable
DROP TABLE "public"."UserDiscord";

-- DropTable
DROP TABLE "public"."UserDndBeyond";

-- DropTable
DROP TABLE "public"."UserRoll20";

-- DropTable
DROP TABLE "public"."UserWorldAnvil";

-- CreateTable
CREATE TABLE "public"."RpgSystem" (
    "id" TEXT NOT NULL,
    "worldanvil_system_id" TEXT,
    "discord_guild_id" TEXT,
    "discord_post_id" TEXT,
    "discord_chat_id" TEXT,
    "discord_thread_id" TEXT,
    "discord_forum_id" TEXT,
    "discord_voice_id" TEXT,
    "discord_role_id" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "data" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RpgSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RpgWorld" (
    "id" TEXT NOT NULL,
    "worldanvil_world_id" TEXT,
    "discord_post_id" TEXT,
    "discord_chat_id" TEXT,
    "discord_thread_id" TEXT,
    "discord_forum_id" TEXT,
    "discord_voice_id" TEXT,
    "discord_role_id" TEXT,
    "rpg_system_id" TEXT,
    "gm_ids" TEXT[],
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RpgWorld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RpgParty" (
    "id" TEXT NOT NULL,
    "worldanvil_party_id" TEXT,
    "discord_post_id" TEXT,
    "discord_chat_id" TEXT,
    "discord_thread_id" TEXT,
    "discord_forum_id" TEXT,
    "discord_voice_id" TEXT,
    "discord_role_id" TEXT,
    "rpg_campaign_id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "data" JSONB,

    CONSTRAINT "RpgParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RpgSession" (
    "id" TEXT NOT NULL,
    "worldanvil_id" TEXT,
    "discord_event_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rpg_party_id" TEXT,

    CONSTRAINT "RpgSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RpgSheet" (
    "id" TEXT NOT NULL,
    "worldanvil_block_id" TEXT,
    "discord_post_id" TEXT,
    "discord_thread_id" TEXT,
    "title" TEXT,
    "slug" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "portrait_url" TEXT,
    "token_url" TEXT,
    "data" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "admin_only" BOOLEAN NOT NULL DEFAULT false,
    "last_played" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rpg_character_id" TEXT,
    "rpg_system_id" TEXT,
    "rpg_party_id" TEXT,
    "rpg_campaign_id" TEXT,
    "rpg_world_id" TEXT,

    CONSTRAINT "RpgSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_worldanvil_system_id_key" ON "public"."RpgSystem"("worldanvil_system_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_guild_id_key" ON "public"."RpgSystem"("discord_guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_post_id_key" ON "public"."RpgSystem"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_chat_id_key" ON "public"."RpgSystem"("discord_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_thread_id_key" ON "public"."RpgSystem"("discord_thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_forum_id_key" ON "public"."RpgSystem"("discord_forum_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_voice_id_key" ON "public"."RpgSystem"("discord_voice_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_discord_role_id_key" ON "public"."RpgSystem"("discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSystem_slug_key" ON "public"."RpgSystem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_worldanvil_world_id_key" ON "public"."RpgWorld"("worldanvil_world_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_post_id_key" ON "public"."RpgWorld"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_chat_id_key" ON "public"."RpgWorld"("discord_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_thread_id_key" ON "public"."RpgWorld"("discord_thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_forum_id_key" ON "public"."RpgWorld"("discord_forum_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_voice_id_key" ON "public"."RpgWorld"("discord_voice_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_discord_role_id_key" ON "public"."RpgWorld"("discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorld_slug_key" ON "public"."RpgWorld"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_worldanvil_party_id_key" ON "public"."RpgParty"("worldanvil_party_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_post_id_key" ON "public"."RpgParty"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_chat_id_key" ON "public"."RpgParty"("discord_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_thread_id_key" ON "public"."RpgParty"("discord_thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_forum_id_key" ON "public"."RpgParty"("discord_forum_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_voice_id_key" ON "public"."RpgParty"("discord_voice_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_discord_role_id_key" ON "public"."RpgParty"("discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgParty_slug_key" ON "public"."RpgParty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSheet_worldanvil_block_id_key" ON "public"."RpgSheet"("worldanvil_block_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSheet_discord_post_id_key" ON "public"."RpgSheet"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSheet_discord_thread_id_key" ON "public"."RpgSheet"("discord_thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "RpgSheet_slug_key" ON "public"."RpgSheet"("slug");

-- CreateIndex
CREATE INDEX "RpgSheet_character_id_idx" ON "public"."RpgSheet"("rpg_character_id");

-- CreateIndex
CREATE INDEX "RpgSheet_rpg_system_id_idx" ON "public"."RpgSheet"("rpg_system_id");

-- CreateIndex
CREATE INDEX "RpgSheet_is_active_idx" ON "public"."RpgSheet"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_post_id_key" ON "public"."Campaign"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_chat_id_key" ON "public"."Campaign"("discord_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_thread_id_key" ON "public"."Campaign"("discord_thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_forum_id_key" ON "public"."Campaign"("discord_forum_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_voice_id_key" ON "public"."Campaign"("discord_voice_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_discord_role_id_key" ON "public"."Campaign"("discord_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "Character_discord_post_id_key" ON "public"."Character"("discord_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Character_discord_thread_id_key" ON "public"."Character"("discord_thread_id");

-- AddForeignKey
ALTER TABLE "public"."RpgWorld" ADD CONSTRAINT "RpgWorld_rpg_system_id_fkey" FOREIGN KEY ("rpg_system_id") REFERENCES "public"."RpgSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_rpg_system_id_fkey" FOREIGN KEY ("rpg_system_id") REFERENCES "public"."RpgSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_rpg_world_id_fkey" FOREIGN KEY ("rpg_world_id") REFERENCES "public"."RpgWorld"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgParty" ADD CONSTRAINT "RpgParty_rpg_campaign_id_fkey" FOREIGN KEY ("rpg_campaign_id") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSession" ADD CONSTRAINT "RpgSession_rpg_party_id_fkey" FOREIGN KEY ("rpg_party_id") REFERENCES "public"."RpgParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSheet" ADD CONSTRAINT "RpgSheet_rpg_character_id_fkey" FOREIGN KEY ("rpg_character_id") REFERENCES "public"."Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSheet" ADD CONSTRAINT "RpgSheet_rpg_system_id_fkey" FOREIGN KEY ("rpg_system_id") REFERENCES "public"."RpgSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSheet" ADD CONSTRAINT "RpgSheet_rpg_party_id_fkey" FOREIGN KEY ("rpg_party_id") REFERENCES "public"."RpgParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSheet" ADD CONSTRAINT "RpgSheet_rpg_campaign_id_fkey" FOREIGN KEY ("rpg_campaign_id") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgSheet" ADD CONSTRAINT "RpgSheet_rpg_world_id_fkey" FOREIGN KEY ("rpg_world_id") REFERENCES "public"."RpgWorld"("id") ON DELETE SET NULL ON UPDATE CASCADE;
