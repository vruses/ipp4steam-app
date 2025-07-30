-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProxy" (
    "userId" INTEGER NOT NULL,
    "proxyId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "proxyId"),
    CONSTRAINT "UserProxy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProxy_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProxy" ("proxyId", "userId") SELECT "proxyId", "userId" FROM "UserProxy";
DROP TABLE "UserProxy";
ALTER TABLE "new_UserProxy" RENAME TO "UserProxy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
