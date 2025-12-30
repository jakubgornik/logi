/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,name]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_sellerId_name_key" ON "Transaction"("sellerId", "name");
