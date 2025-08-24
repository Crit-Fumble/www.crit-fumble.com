-- AlterTable
ALTER TABLE "CampaignDiscord" ADD COLUMN     "serverId" TEXT;

-- AlterTable
ALTER TABLE "UserDiscord" ADD COLUMN     "accent_color" BIGINT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "banner_color" TEXT,
ADD COLUMN     "discriminator" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "flags" BIGINT,
ADD COLUMN     "global_name" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "locale" TEXT,
ADD COLUMN     "mfa_enabled" BOOLEAN,
ADD COLUMN     "premium_type" BIGINT,
ADD COLUMN     "public_flags" BIGINT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "verified" BOOLEAN;

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "player" TEXT,
    "campaign" TEXT,
    "party" TEXT,
    "name" TEXT,
    "slug" TEXT,
    "dd_beyond" TEXT,
    "discord" TEXT,
    "roll20" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterDndBeyond" (
    "id" TEXT NOT NULL,

    CONSTRAINT "CharacterDndBeyond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "day" TEXT,
    "times" TEXT[],

    CONSTRAINT "PartySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "campaign" TEXT,
    "gm" TEXT,
    "slug" TEXT,
    "name" TEXT,
    "active" BOOLEAN,
    "session" TEXT,
    "dd_beyond" TEXT,
    "roll20" TEXT,
    "discord" TEXT,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyDndBeyond" (
    "id" TEXT NOT NULL,
    "join" TEXT,

    CONSTRAINT "PartyDndBeyond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyRoll20" (
    "id" TEXT NOT NULL,
    "join" TEXT,

    CONSTRAINT "PartyRoll20_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Keys
ALTER TABLE "Character" ADD CONSTRAINT "Character_player_fkey" FOREIGN KEY ("player") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaign_fkey" FOREIGN KEY ("campaign") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Character" ADD CONSTRAINT "Character_party_fkey" FOREIGN KEY ("party") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Character" ADD CONSTRAINT "Character_dd_beyond_fkey" FOREIGN KEY ("dd_beyond") REFERENCES "CharacterDndBeyond"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Character" ADD CONSTRAINT "Character_discord_fkey" FOREIGN KEY ("discord") REFERENCES "UserDiscord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Party" ADD CONSTRAINT "Party_campaign_fkey" FOREIGN KEY ("campaign") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Party" ADD CONSTRAINT "Party_gm_fkey" FOREIGN KEY ("gm") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Party" ADD CONSTRAINT "Party_session_fkey" FOREIGN KEY ("session") REFERENCES "GameSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Party" ADD CONSTRAINT "Party_dd_beyond_fkey" FOREIGN KEY ("dd_beyond") REFERENCES "PartyDndBeyond"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Party" ADD CONSTRAINT "Party_roll20_fkey" FOREIGN KEY ("roll20") REFERENCES "PartyRoll20"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add Indexes for faster lookups
CREATE INDEX "Character_player_idx" ON "Character"("player");
CREATE INDEX "Character_campaign_idx" ON "Character"("campaign");
CREATE INDEX "Character_party_idx" ON "Character"("party");
CREATE UNIQUE INDEX "Character_slug_idx" ON "Character"("slug");

CREATE INDEX "Party_campaign_idx" ON "Party"("campaign");
CREATE INDEX "Party_gm_idx" ON "Party"("gm");
CREATE UNIQUE INDEX "Party_slug_idx" ON "Party"("slug");
