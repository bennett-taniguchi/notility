/*
  Warnings:

  - You are about to drop the column `sharedId` on the `Permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uri,email]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "sharedId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_uri_email_key" ON "Permissions"("uri", "email");
