/*
  Warnings:

  - Added the required column `owner` to the `Notespace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notespace" ADD COLUMN     "owner" TEXT NOT NULL;
