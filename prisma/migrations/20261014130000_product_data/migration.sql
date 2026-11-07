-- AlterTable
ALTER TABLE "GameProduct" DROP COLUMN "providerCode",
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
