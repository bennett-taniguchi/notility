/*
  Warnings:

  - Added the required column `createdOn` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sources` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "createdOn" TEXT NOT NULL,
ADD COLUMN     "sources" INTEGER NOT NULL;
