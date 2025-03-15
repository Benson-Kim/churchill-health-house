-- CreateTable
CREATE TABLE "TaskManager" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "TaskManager_pkey" PRIMARY KEY ("id")
);
