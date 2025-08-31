-- AlterTable
ALTER TABLE "CharacterDndBeyond" ADD COLUMN     "dd_beyond_id" TEXT;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_dd_beyond_fkey" FOREIGN KEY ("dd_beyond") REFERENCES "CharacterDndBeyond"("id") ON DELETE SET NULL ON UPDATE CASCADE;
