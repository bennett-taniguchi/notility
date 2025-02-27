/*
  Warnings:

  - A unique constraint covering the columns `[index,uri]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_index_uri_key" ON "Message"("index", "uri");
