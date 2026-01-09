/*
  Warnings:

  - You are about to drop the column `finsishTask` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "finsishTask",
ADD COLUMN     "finishTask" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
