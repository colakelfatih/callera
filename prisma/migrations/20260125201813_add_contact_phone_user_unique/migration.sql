/*
  Warnings:

  - A unique constraint covering the columns `[userId,phone]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_phone_key" ON "contacts"("userId", "phone");
