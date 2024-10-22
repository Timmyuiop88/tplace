-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_productId_fkey";

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
