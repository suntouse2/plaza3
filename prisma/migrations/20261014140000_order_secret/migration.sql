-- AlterTable
ALTER TABLE "Order" ADD COLUMN "secret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_secret_key" ON "Order"("secret");
