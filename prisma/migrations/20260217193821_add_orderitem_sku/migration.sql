-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "sku" TEXT;

-- CreateIndex
CREATE INDEX "OrderItem_sku_idx" ON "OrderItem"("sku");
