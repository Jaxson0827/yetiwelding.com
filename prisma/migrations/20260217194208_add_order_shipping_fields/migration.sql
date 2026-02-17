-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCarrier" TEXT,
ADD COLUMN     "shippingProvider" TEXT,
ADD COLUMN     "shippingQuoteId" TEXT,
ADD COLUMN     "shippingService" TEXT,
ADD COLUMN     "stripeShippingRateId" TEXT;
