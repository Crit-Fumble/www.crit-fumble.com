/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "sheet_data" JSONB;

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "sheet_data" JSONB;

-- AlterTable
ALTER TABLE "GameSystem" ADD COLUMN     "sheet_data" JSONB;

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "sheet_data" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sheet_data" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
