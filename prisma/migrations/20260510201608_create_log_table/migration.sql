/*
  Warnings:

  - You are about to drop the column `checkedAt` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `statusText` on the `Log` table. All the data in the column will be lost.
  - Added the required column `isOnline` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTime` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "checkedAt",
DROP COLUMN "statusText",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL,
ADD COLUMN     "responseTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" TEXT NOT NULL;
