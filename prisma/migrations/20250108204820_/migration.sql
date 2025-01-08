/*
  Warnings:

  - You are about to drop the column `index` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Flashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upload` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,uri]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uri]` on the table `Notes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uri` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uri` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_title_authorId_fkey";

-- DropIndex
DROP INDEX "Message_index_authorId_title_key";

-- DropIndex
DROP INDEX "Notes_title_authorId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "index",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "uri" TEXT NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "prompt_type" TEXT,
ADD COLUMN     "uri" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creation_theme" TEXT,
ADD COLUMN     "notespace_theme" TEXT,
ADD COLUMN     "premium_end" TEXT,
ADD COLUMN     "premium_start" TEXT,
ADD COLUMN     "tracks_theme" TEXT;

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Flashcard";

-- DropTable
DROP TABLE "Upload";

-- CreateTable
CREATE TABLE "Shared" (
    "authorId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "level" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Notespace" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sources_count" INTEGER,
    "sources_blurb" TEXT,

    CONSTRAINT "Notespace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shared_uri_authorId_key" ON "Shared"("uri", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Notespace_uri_key" ON "Notespace"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_uri_key" ON "Message"("id", "uri");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_uri_key" ON "Notes"("uri");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shared" ADD CONSTRAINT "Shared_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;
