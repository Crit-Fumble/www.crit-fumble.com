/*
  Warnings:

  - You are about to drop the column `campaign` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `dd_beyond` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `party` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `CharacterDndBeyond` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_dd_beyond_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "campaign",
DROP COLUMN "dd_beyond",
DROP COLUMN "party",
ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "dnd_beyond_id" TEXT,
ADD COLUMN     "rpg_system_id" TEXT,
ADD COLUMN     "party_id" TEXT,
ADD COLUMN     "pdf_url" TEXT,
ADD COLUMN     "sheet_data" JSONB,
ADD COLUMN     "world_anvil_id" TEXT;

-- DropTable
DROP TABLE "CharacterDndBeyond";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_rpg_system_id_fkey" FOREIGN KEY ("rpg_system_id") REFERENCES "RpgSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
