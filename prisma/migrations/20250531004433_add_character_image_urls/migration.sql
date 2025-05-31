-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "portrait_url" TEXT,
ADD COLUMN     "token_url" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "admin" SET DEFAULT false;
