/*
  Warnings:

  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uri,title]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Quiz_uri_key";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topics" TEXT[];

-- DropTable
DROP TABLE "Topic";

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_uri_title_key" ON "Quiz"("uri", "title");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_uri_title_fkey" FOREIGN KEY ("uri", "title") REFERENCES "Quiz"("uri", "title") ON DELETE CASCADE ON UPDATE CASCADE;
