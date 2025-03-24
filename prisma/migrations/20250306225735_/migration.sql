/*
  Warnings:

  - Added the required column `createdBy` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdOn` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "createdOn" TEXT NOT NULL;
