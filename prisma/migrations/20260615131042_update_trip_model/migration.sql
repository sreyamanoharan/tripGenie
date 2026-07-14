/*
  Warnings:

  - You are about to drop the column `preferences` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "preferences",
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
