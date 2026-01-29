/*
  Warnings:

  - You are about to drop the column `instagramMessageId` on the `ai_responses` table. All the data in the column will be lost.
  - You are about to drop the `instagram_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_responses" DROP CONSTRAINT "ai_responses_instagramMessageId_fkey";

-- DropForeignKey
ALTER TABLE "instagram_messages" DROP CONSTRAINT "instagram_messages_connectionId_fkey";

-- AlterTable
ALTER TABLE "ai_responses" DROP COLUMN "instagramMessageId";

-- DropTable
DROP TABLE "instagram_messages";
