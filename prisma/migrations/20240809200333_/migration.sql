-- CreateTable
CREATE TABLE "Upload" (
    "index" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_index_authorId_key" ON "Upload"("index", "authorId");
