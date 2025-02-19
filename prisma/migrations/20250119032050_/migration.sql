/*
  Warnings:

  - A unique constraint covering the columns `[title,uri]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notes_uri_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notes_title_uri_key" ON "Notes"("title", "uri");
