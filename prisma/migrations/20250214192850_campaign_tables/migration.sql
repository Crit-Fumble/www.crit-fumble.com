-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "system" TEXT,
    "gms" TEXT[],
    "active" BOOLEAN,
    "world_anvil" TEXT,
    "discord" TEXT,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDiscord" (
    "id" TEXT NOT NULL,
    "fumbleBotId" TEXT,
    "playerRoles" TEXT[],
    "gmRoles" TEXT[],
    "botRoles" TEXT[],
    "forumChannelId" TEXT,
    "playByPostChannelId" TEXT,
    "voiceChannelId" TEXT,

    CONSTRAINT "CampaignDiscord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignWorldAnvil" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "worldMapId" TEXT,
    "chronicleId" TEXT,
    "chronicleSlug" TEXT,

    CONSTRAINT "CampaignWorldAnvil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "description" TEXT,
    "srdApi" TEXT,

    CONSTRAINT "GameSystem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "discord" FOREIGN KEY ("discord") REFERENCES "CampaignDiscord"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "world_anvil" FOREIGN KEY ("world_anvil") REFERENCES "CampaignWorldAnvil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
