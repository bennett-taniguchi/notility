-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_uri_fkey";

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;
