-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('INITIAL', 'PENDING', 'SUCCESS', 'REJECTED');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "webhookEndpoint" TEXT NOT NULL,
    "apiKeyHash" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "apiKeyHash" TEXT,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "rejectable" BOOLEAN NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'INITIAL',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_bankAccount_key" ON "Client"("bankAccount");

-- CreateIndex
CREATE UNIQUE INDEX "Client_webhookEndpoint_key" ON "Client"("webhookEndpoint");

-- CreateIndex
CREATE UNIQUE INDEX "Client_apiKeyHash_key" ON "Client"("apiKeyHash");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_bankCode_key" ON "Bank"("bankCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_apiKeyHash_key" ON "Bank"("apiKeyHash");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
