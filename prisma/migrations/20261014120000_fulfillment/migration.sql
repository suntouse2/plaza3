-- CreateEnum
CREATE TYPE "TopupStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "GameProduct" ADD COLUMN "providerCode" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "providerOrderId" TEXT,
ADD COLUMN "providerResponse" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Order_providerOrderId_key" ON "Order"("providerOrderId");

-- CreateTable
CREATE TABLE "Topup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" "TopupStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "paymentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topup_pkey" PRIMARY KEY ("id")
);
