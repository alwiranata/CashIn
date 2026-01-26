/*
  Warnings:

  - You are about to drop the column `name` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `nameTransaction` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "name",
ADD COLUMN     "nameTransaction" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;
