-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "target" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProgressToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProgressToTag_AB_unique" ON "_ProgressToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgressToTag_B_index" ON "_ProgressToTag"("B");

-- AddForeignKey
ALTER TABLE "_ProgressToTag" ADD CONSTRAINT "_ProgressToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgressToTag" ADD CONSTRAINT "_ProgressToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
