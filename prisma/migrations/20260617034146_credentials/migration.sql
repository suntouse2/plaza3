/*
  Warnings:

  - You are about to drop the `_GameProductCategoryCredentials` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gameProductCategoryId` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GameProductCategoryCredentials" DROP CONSTRAINT "_GameProductCategoryCredentials_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameProductCategoryCredentials" DROP CONSTRAINT "_GameProductCategoryCredentials_B_fkey";

-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "gameProductCategoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GameProductCategoryCredentials";

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_gameProductCategoryId_fkey" FOREIGN KEY ("gameProductCategoryId") REFERENCES "GameProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
