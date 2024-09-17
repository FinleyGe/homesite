/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropTable
DROP TABLE "Article";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collective" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTodoList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToTomato" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectiveToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTodoList_AB_unique" ON "_TagToTodoList"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTodoList_B_index" ON "_TagToTodoList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTomato_AB_unique" ON "_TagToTomato"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTomato_B_index" ON "_TagToTomato"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectiveToTag_AB_unique" ON "_CollectiveToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectiveToTag_B_index" ON "_CollectiveToTag"("B");

-- AddForeignKey
ALTER TABLE "_TagToTodoList" ADD CONSTRAINT "_TagToTodoList_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTodoList" ADD CONSTRAINT "_TagToTodoList_B_fkey" FOREIGN KEY ("B") REFERENCES "TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTomato" ADD CONSTRAINT "_TagToTomato_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTomato" ADD CONSTRAINT "_TagToTomato_B_fkey" FOREIGN KEY ("B") REFERENCES "Tomato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectiveToTag" ADD CONSTRAINT "_CollectiveToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Collective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectiveToTag" ADD CONSTRAINT "_CollectiveToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
