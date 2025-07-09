/*
  Warnings:

  - You are about to drop the column `createdAt` on the `BristolStoolCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BristolStoolCategory` table. All the data in the column will be lost.
  - You are about to drop the column `bristolCategoryId` on the `StoolRecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StoolRecord` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `StoolRecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StoolRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StoolRecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `supabaseId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supabase_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_url` to the `StoolRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `StoolRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StoolRecord" DROP CONSTRAINT "StoolRecord_bristolCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "StoolRecord" DROP CONSTRAINT "StoolRecord_userId_fkey";

-- DropIndex
DROP INDEX "StoolRecord_bristolCategoryId_idx";

-- DropIndex
DROP INDEX "StoolRecord_userId_idx";

-- DropIndex
DROP INDEX "User_supabaseId_key";

-- AlterTable
ALTER TABLE "BristolStoolCategory" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StoolRecord" DROP COLUMN "bristolCategoryId",
DROP COLUMN "createdAt",
DROP COLUMN "imageUrl",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "bristol_category_id" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "supabaseId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "supabase_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "StoolRecord_user_id_idx" ON "StoolRecord"("user_id");

-- CreateIndex
CREATE INDEX "StoolRecord_bristol_category_id_idx" ON "StoolRecord"("bristol_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabase_id_key" ON "User"("supabase_id");

-- AddForeignKey
ALTER TABLE "StoolRecord" ADD CONSTRAINT "StoolRecord_bristol_category_id_fkey" FOREIGN KEY ("bristol_category_id") REFERENCES "BristolStoolCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoolRecord" ADD CONSTRAINT "StoolRecord_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
