-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressCity" TEXT,
ADD COLUMN     "addressCountry" TEXT,
ADD COLUMN     "addressPostalCode" TEXT,
ADD COLUMN     "addressStreet" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "isCustomer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "appUserId" TEXT,
    "customerName" TEXT,
    "addressCountry" TEXT,
    "addressCity" TEXT,
    "addressStreet" TEXT,
    "addressPostalCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
