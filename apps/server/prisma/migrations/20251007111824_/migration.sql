-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gameStatus" JSONB NOT NULL,
    "progressType" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "authorityLevel" INTEGER NOT NULL,
    "salt" TEXT NOT NULL,
    "gameId" INTEGER,
    "gameConnected" INTEGER,
    "gamePlayerId" INTEGER,
    "gamePlayerColor" TEXT,
    CONSTRAINT "User_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
