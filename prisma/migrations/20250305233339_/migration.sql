-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_uri_title_key" ON "Topic"("uri", "title");
