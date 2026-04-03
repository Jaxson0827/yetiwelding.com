-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'blog',
    "confirmToken" TEXT NOT NULL,
    "unsubscribeToken" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_confirmToken_key" ON "NewsletterSubscription"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_unsubscribeToken_key" ON "NewsletterSubscription"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_confirmToken_idx" ON "NewsletterSubscription"("confirmToken");

-- CreateIndex
CREATE INDEX "NewsletterSubscription_unsubscribeToken_idx" ON "NewsletterSubscription"("unsubscribeToken");
