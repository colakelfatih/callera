-- CreateTable
CREATE TABLE "whatsapp_connections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wabaId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "businessName" TEXT,
    "accessToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "webhookUrl" TEXT,
    "webhookVerifyToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_connections_userId_wabaId_key" ON "whatsapp_connections"("userId", "wabaId");

-- AddForeignKey
ALTER TABLE "whatsapp_connections" ADD CONSTRAINT "whatsapp_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
