/*
  Warnings:

  - The `itinerary` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "itinerary",
ADD COLUMN     "itinerary" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "profilePicture" TEXT;
