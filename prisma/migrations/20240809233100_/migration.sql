/*
  Warnings:

  - A unique constraint covering the columns `[index,authorId,title]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Message_index_authorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Message_index_authorId_title_key" ON "Message"("index", "authorId", "title");
