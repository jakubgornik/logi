-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'TRANSACTION_CREATED';
ALTER TYPE "NotificationType" ADD VALUE 'TRANSACTION_UPDATED';
ALTER TYPE "NotificationType" ADD VALUE 'TRANSACTION_DELETED';
ALTER TYPE "NotificationType" ADD VALUE 'TRANSACTION_CONFIRMED';
ALTER TYPE "NotificationType" ADD VALUE 'INVENTORY_UPDATED';
ALTER TYPE "NotificationType" ADD VALUE 'INVENTORY_ADDED';
ALTER TYPE "NotificationType" ADD VALUE 'USER_UPDATED';
