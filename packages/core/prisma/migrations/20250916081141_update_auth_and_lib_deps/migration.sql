/*
  Warnings:

  - You are about to drop the column `rpg_system_id` on the `RpgWorld` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RpgWorld" DROP CONSTRAINT "RpgWorld_rpg_system_id_fkey";

-- AlterTable
ALTER TABLE "public"."RpgWorld" DROP COLUMN "rpg_system_id";

-- CreateTable
CREATE TABLE "public"."RpgWorldSystem" (
    "id" TEXT NOT NULL,
    "world_id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RpgWorldSystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RpgWorldSystem_world_id_idx" ON "public"."RpgWorldSystem"("world_id");

-- CreateIndex
CREATE INDEX "RpgWorldSystem_system_id_idx" ON "public"."RpgWorldSystem"("system_id");

-- CreateIndex
CREATE INDEX "RpgWorldSystem_is_primary_idx" ON "public"."RpgWorldSystem"("is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "RpgWorldSystem_world_id_system_id_key" ON "public"."RpgWorldSystem"("world_id", "system_id");

-- AddForeignKey
ALTER TABLE "public"."RpgWorldSystem" ADD CONSTRAINT "RpgWorldSystem_world_id_fkey" FOREIGN KEY ("world_id") REFERENCES "public"."RpgWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RpgWorldSystem" ADD CONSTRAINT "RpgWorldSystem_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "public"."RpgSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
