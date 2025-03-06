/*
  Warnings:

  - A unique constraint covering the columns `[title,uri,question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Question_uri_a_b_c_d_key";

-- CreateIndex
CREATE UNIQUE INDEX "Question_title_uri_question_key" ON "Question"("title", "uri", "question");
