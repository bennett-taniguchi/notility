-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "b" TEXT NOT NULL,
    "c" TEXT NOT NULL,
    "d" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "e" TEXT,
    "f" TEXT,
    "correctOption" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_uri_key" ON "Quiz"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Question_uri_a_b_c_d_key" ON "Question"("uri", "a", "b", "c", "d");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Notespace"("uri") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_uri_fkey" FOREIGN KEY ("uri") REFERENCES "Quiz"("uri") ON DELETE CASCADE ON UPDATE CASCADE;
