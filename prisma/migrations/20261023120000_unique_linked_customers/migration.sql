BEGIN;

-- Keep writes out while duplicate references are moved and uniqueness is added.
LOCK TABLE "Customer", "Transaction", "Notification" IN SHARE ROW EXCLUSIVE MODE;

-- Keep the oldest customer (then lowest ID) for each linked seller/user pair.
-- Manual customers have no appUserId and must remain independent records.
CREATE TEMPORARY TABLE "CustomerLinkDuplicates" ON COMMIT DROP AS
SELECT "id" AS "duplicateId", "canonicalId"
FROM (
    SELECT
        "id",
        FIRST_VALUE("id") OVER (
            PARTITION BY "sellerId", "appUserId"
            ORDER BY "createdAt", "id"
        ) AS "canonicalId"
    FROM "Customer"
    WHERE "appUserId" IS NOT NULL
) AS ranked
WHERE "id" <> "canonicalId";

-- Preserve transaction destinations and notification links before removing duplicates.
UPDATE "Transaction" AS transaction
SET "customerId" = duplicates."canonicalId"
FROM "CustomerLinkDuplicates" AS duplicates
WHERE transaction."customerId" = duplicates."duplicateId";

UPDATE "Notification" AS notification
SET "customerId" = duplicates."canonicalId"
FROM "CustomerLinkDuplicates" AS duplicates
WHERE notification."customerId" = duplicates."duplicateId";

DELETE FROM "Customer" AS customer
USING "CustomerLinkDuplicates" AS duplicates
WHERE customer."id" = duplicates."duplicateId";

-- PostgreSQL's default NULL-distinct semantics allow repeated manual customers.
CREATE UNIQUE INDEX "Customer_sellerId_appUserId_key" ON "Customer"("sellerId", "appUserId");

COMMIT;
