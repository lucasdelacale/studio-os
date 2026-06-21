-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'task',
    "title" TEXT NOT NULL DEFAULT 'Novo Card',
    "positionX" INTEGER NOT NULL DEFAULT 0,
    "positionY" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 2,
    "height" INTEGER NOT NULL DEFAULT 2,
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartSourceId" TEXT,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CardStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTask" (
    "cardId" TEXT NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "viewMode" TEXT NOT NULL DEFAULT 'list',
    "showProgress" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CardTask_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardNote" (
    "cardId" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "folderId" TEXT,

    CONSTRAINT "CardNote_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardHabit" (
    "cardId" TEXT NOT NULL,
    "logs" JSONB NOT NULL DEFAULT '[]',
    "goalPerWeek" INTEGER NOT NULL DEFAULT 7,

    CONSTRAINT "CardHabit_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardChart" (
    "cardId" TEXT NOT NULL,
    "sourceCardId" TEXT NOT NULL,
    "chartType" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "CardChart_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardTimer" (
    "cardId" TEXT NOT NULL,
    "sessions" JSONB NOT NULL DEFAULT '[]',
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "linkedTaskId" TEXT,

    CONSTRAINT "CardTimer_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardFinance" (
    "cardId" TEXT NOT NULL,
    "entries" JSONB NOT NULL DEFAULT '[]',
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "goals" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "CardFinance_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardMood" (
    "cardId" TEXT NOT NULL,
    "entries" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "CardMood_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardBookmark" (
    "cardId" TEXT NOT NULL,
    "links" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "CardBookmark_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layout" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_chartSourceId_fkey" FOREIGN KEY ("chartSourceId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStatus" ADD CONSTRAINT "CardStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTask" ADD CONSTRAINT "CardTask_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardNote" ADD CONSTRAINT "CardNote_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardNote" ADD CONSTRAINT "CardNote_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardHabit" ADD CONSTRAINT "CardHabit_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardChart" ADD CONSTRAINT "CardChart_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardTimer" ADD CONSTRAINT "CardTimer_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardFinance" ADD CONSTRAINT "CardFinance_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMood" ADD CONSTRAINT "CardMood_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBookmark" ADD CONSTRAINT "CardBookmark_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
