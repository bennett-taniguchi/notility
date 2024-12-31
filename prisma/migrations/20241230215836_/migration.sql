/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title,authorId]` on the table `Flashcard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_title_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "Flashcard_authorId_title_key";

-- DropTable
DROP TABLE "Post";

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_title_authorId_key" ON "Flashcard"("title", "authorId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_title_authorId_fkey" FOREIGN KEY ("title", "authorId") REFERENCES "Flashcard"("title", "authorId") ON DELETE CASCADE ON UPDATE CASCADE;
