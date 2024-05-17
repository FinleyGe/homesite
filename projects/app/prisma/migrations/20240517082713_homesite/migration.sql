-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "endTime" TEXT,
    "done" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tomato" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "focusOn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tomato_pkey" PRIMARY KEY ("id")
);
