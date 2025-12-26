/*
  Warnings:

  - The values [EXSPENSE] on the enum `typeTransaction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeTransaction_new" AS ENUM ('INCOME', 'EXPENSE');
ALTER TABLE "Transaction" ALTER COLUMN "typeTransaction" TYPE "typeTransaction_new" USING ("typeTransaction"::text::"typeTransaction_new");
ALTER TYPE "typeTransaction" RENAME TO "typeTransaction_old";
ALTER TYPE "typeTransaction_new" RENAME TO "typeTransaction";
DROP TYPE "public"."typeTransaction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
