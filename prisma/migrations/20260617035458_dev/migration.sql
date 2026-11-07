/*
  Warnings:

  - You are about to drop the column `largeImageUrl` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `smallImageUrl` on the `Game` table. All the data in the column will be lost.
  - Added the required column `bannerUrl` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "largeImageUrl",
DROP COLUMN "smallImageUrl",
ADD COLUMN     "bannerUrl" TEXT NOT NULL;
