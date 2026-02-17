-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'pending_payment', 'needs_review', 'in_review', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('quote_requested', 'pending', 'paid', 'failed', 'refunded');

-- CreateTable
CREATE TABLE "CheckoutDraft" (
    "id" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "trackingToken" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "customerInfo" JSONB NOT NULL,
    "selectedShippingMethod" TEXT,
    "shippingOptions" JSONB,
    "expectedCurrency" TEXT NOT NULL DEFAULT 'usd',
    "expectedSubtotalCents" INTEGER,
    "expectedShippingCents" INTEGER,
    "allowedShippingCents" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "checkoutId" TEXT,
    "stripeSessionId" TEXT,
    "paymentIntentId" TEXT,
    "trackingToken" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "subtotalCents" INTEGER,
    "shippingCents" INTEGER,
    "taxCents" INTEGER,
    "totalCents" INTEGER,
    "customerEmail" TEXT NOT NULL,
    "customerInfo" JSONB NOT NULL,
    "shippingMethod" TEXT,
    "estimatedDeliveryDate" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "notes" TEXT[],
    "flags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "totalPriceCents" INTEGER NOT NULL,
    "configuration" JSONB NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "paymentIntentId" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutDraft_checkoutId_key" ON "CheckoutDraft"("checkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutDraft_stripeSessionId_key" ON "CheckoutDraft"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutDraft_paymentIntentId_key" ON "CheckoutDraft"("paymentIntentId");

-- CreateIndex
CREATE INDEX "CheckoutDraft_stripeSessionId_idx" ON "CheckoutDraft"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CheckoutDraft_paymentIntentId_idx" ON "CheckoutDraft"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_jobId_key" ON "Order"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Order_checkoutId_idx" ON "Order"("checkoutId");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_eventId_key" ON "StripeWebhookEvent"("eventId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
