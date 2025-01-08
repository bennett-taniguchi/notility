/*
  Warnings:

  - Added the required column `created_on` to the `Notespace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notespace" ADD COLUMN     "created_on" TEXT NOT NULL;
