-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "steamID" BIGINT NOT NULL,
    "nickname" TEXT NOT NULL,
    "cookie" TEXT NOT NULL,
    "loginStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proxy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configName" TEXT NOT NULL,
    "proxyLink" TEXT NOT NULL,
    "targetLink" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserProxy" (
    "userId" INTEGER NOT NULL,
    "proxyId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "proxyId"),
    CONSTRAINT "UserProxy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProxy_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamID_key" ON "User"("steamID");

-- CreateIndex
CREATE UNIQUE INDEX "Proxy_configName_key" ON "Proxy"("configName");
