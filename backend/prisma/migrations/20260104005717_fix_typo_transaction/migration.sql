/*
  Warnings:

  - You are about to drop the column `images` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;
