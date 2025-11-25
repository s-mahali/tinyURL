/*
  Warnings:

  - You are about to drop the column `lastClickdAt` on the `ShortenUrl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShortenUrl" DROP COLUMN "lastClickdAt",
ADD COLUMN     "lastClickedAt" TIMESTAMP(3);
