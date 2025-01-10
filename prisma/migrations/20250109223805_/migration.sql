/*
  Warnings:

  - A unique constraint covering the columns `[uri,title,originalFileName]` on the table `Upload` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_uri_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Upload_uri_title_originalFileName_key" ON "Upload"("uri", "title", "originalFileName");
