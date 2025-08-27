/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `CampaignWorldAnvil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `GameSystem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Party` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `UserRoll20` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `UserWorldAnvil` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignWorldAnvil_slug_key" ON "CampaignWorldAnvil"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Character_slug_key" ON "Character"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GameSystem_slug_key" ON "GameSystem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Party_slug_key" ON "Party"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoll20_slug_key" ON "UserRoll20"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorldAnvil_slug_key" ON "UserWorldAnvil"("slug");
