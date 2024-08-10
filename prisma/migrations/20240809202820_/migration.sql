/*
  Warnings:

  - A unique constraint covering the columns `[title,authorId]` on the table `Upload` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Upload_index_authorId_key";

-- AlterTable
CREATE SEQUENCE upload_index_seq;
ALTER TABLE "Upload" ALTER COLUMN "index" SET DEFAULT nextval('upload_index_seq'),
ADD CONSTRAINT "Upload_pkey" PRIMARY KEY ("index");
ALTER SEQUENCE upload_index_seq OWNED BY "Upload"."index";

-- CreateIndex
CREATE UNIQUE INDEX "Upload_title_authorId_key" ON "Upload"("title", "authorId");
