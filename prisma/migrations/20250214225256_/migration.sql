-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "sharedId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE RESTRICT ON UPDATE CASCADE;
