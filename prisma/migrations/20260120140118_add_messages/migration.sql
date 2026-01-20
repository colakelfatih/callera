/*
  Warnings:

  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('whatsapp', 'instagram', 'facebook_dm');

-- CreateEnum
CREATE TYPE "MessageProcessingStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'audio', 'video', 'document', 'other');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "channelMessageId" TEXT NOT NULL,
    "connectionId" TEXT,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT,
    "messageText" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL DEFAULT 'text',
    "rawPayload" JSONB,
    "isFromBusiness" BOOLEAN NOT NULL DEFAULT false,
    "conversationId" TEXT,
    "status" "MessageProcessingStatus" NOT NULL DEFAULT 'pending',
    "aiResponse" TEXT,
    "timestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_senderId_channel_createdAt_idx" ON "messages"("senderId", "channel", "createdAt");

-- CreateIndex
CREATE INDEX "messages_status_createdAt_idx" ON "messages"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "messages_channel_channelMessageId_key" ON "messages"("channel", "channelMessageId");
