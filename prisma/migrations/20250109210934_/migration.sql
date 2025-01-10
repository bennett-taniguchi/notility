/*
  Warnings:

  - You are about to drop the column `originalTitle` on the `Upload` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "originalTitle",
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "originalFileName" TEXT NOT NULL;
