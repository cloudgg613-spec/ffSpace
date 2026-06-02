-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RssFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "league" TEXT NOT NULL DEFAULT 'all',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RssFeed" ("createdAt", "id", "isActive", "name", "url") SELECT "createdAt", "id", "isActive", "name", "url" FROM "RssFeed";
DROP TABLE "RssFeed";
ALTER TABLE "new_RssFeed" RENAME TO "RssFeed";
CREATE UNIQUE INDEX "RssFeed_url_key" ON "RssFeed"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
