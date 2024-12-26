/*
  Warnings:

  - You are about to drop the column `setTitle` on the `Card` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[term,answer,title]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_setTitle_authorId_fkey";

-- DropIndex
DROP INDEX "Card_term_answer_setTitle_key";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "setTitle",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_term_answer_title_key" ON "Card"("term", "answer", "title");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_title_authorId_fkey" FOREIGN KEY ("title", "authorId") REFERENCES "Flashcard"("title", "authorId") ON DELETE RESTRICT ON UPDATE CASCADE;
