/*
  Warnings:

  - A unique constraint covering the columns `[image_hash]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "image_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "receipts_image_hash_key" ON "receipts"("image_hash");
