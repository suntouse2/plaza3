-- CreateEnum
CREATE TYPE "GamePlatform" AS ENUM ('MOBILE', 'DESKTOP');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('GACHA', 'SHOOTER', 'CASUAL', 'MOBS', 'OTHER');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('CLIENT_ID', 'SERVER_ID', 'LOGIN', 'PASSWORD');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "smallImageUrl" TEXT NOT NULL,
    "largeImageUrl" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "GameType" NOT NULL DEFAULT 'OTHER',
    "platform" "GamePlatform" NOT NULL DEFAULT 'MOBILE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "regex" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "instructionHtml" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProductCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProduct" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "suffix" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameProductCategoryCredentials" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameProductCategoryCredentials_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE INDEX "_GameProductCategoryCredentials_B_index" ON "_GameProductCategoryCredentials"("B");

-- AddForeignKey
ALTER TABLE "GameProductCategory" ADD CONSTRAINT "GameProductCategory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameProduct" ADD CONSTRAINT "GameProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GameProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameProductCategoryCredentials" ADD CONSTRAINT "_GameProductCategoryCredentials_A_fkey" FOREIGN KEY ("A") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameProductCategoryCredentials" ADD CONSTRAINT "_GameProductCategoryCredentials_B_fkey" FOREIGN KEY ("B") REFERENCES "GameProductCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
