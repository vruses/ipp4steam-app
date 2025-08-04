-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "steamID" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "cookie" TEXT NOT NULL,
    "loginStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("cookie", "createdAt", "id", "loginStatus", "nickname", "steamID", "updatedAt") SELECT "cookie", "createdAt", "id", "loginStatus", "nickname", "steamID", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_steamID_key" ON "User"("steamID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
