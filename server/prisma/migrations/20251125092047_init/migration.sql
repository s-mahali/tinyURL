-- CreateTable
CREATE TABLE "ShortenUrl" (
    "id" SERIAL NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "lastClickdAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortenUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortenUrl_shortCode_key" ON "ShortenUrl"("shortCode");

-- CreateIndex
CREATE INDEX "ShortenUrl_shortCode_idx" ON "ShortenUrl"("shortCode");
