-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT;

-- CreateIndex
CREATE INDEX "sessions_userId_lastActiveAt_idx" ON "sessions"("userId", "lastActiveAt");
