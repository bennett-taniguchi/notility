/*
  Warnings:

  - A unique constraint covering the columns `[term,answer]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,title]` on the table `Flashcard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_term_answer_key" ON "Card"("term", "answer");

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_authorId_title_key" ON "Flashcard"("authorId", "title");
