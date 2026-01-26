/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `typeTransaction` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ACTIVE', 'NONACTIVE');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "StatusTask" AS ENUM ('PENDING', 'PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "typeTransaction",
ADD COLUMN     "typeTransaction" "TypeTransaction" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "StatusUser" NOT NULL DEFAULT 'NONACTIVE';

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "typeTransaction";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "nameTask" TEXT NOT NULL,
    "image" TEXT,
    "startTask" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finsishTask" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusTask" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
