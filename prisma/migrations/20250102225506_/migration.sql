/*
  Warnings:

  - Added the required column `last_practiced` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "last_practiced" TIMESTAMP(3) NOT NULL;
