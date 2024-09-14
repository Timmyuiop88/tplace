-- CreateTable
CREATE TABLE "KYCApplication" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "idFront" TEXT NOT NULL,
    "idBack" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KYCApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KYCApplication" ADD CONSTRAINT "KYCApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
