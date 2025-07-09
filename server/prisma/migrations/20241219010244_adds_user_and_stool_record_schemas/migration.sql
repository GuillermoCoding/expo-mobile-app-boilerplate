-- CreateEnum
CREATE TYPE "BristolStoolType" AS ENUM ('TYPE_1', 'TYPE_2', 'TYPE_3', 'TYPE_4', 'TYPE_5', 'TYPE_6', 'TYPE_7');

-- CreateEnum
CREATE TYPE "StoolColor" AS ENUM ('BROWN', 'DARK_BROWN', 'LIGHT_BROWN', 'YELLOW', 'GREEN', 'BLACK', 'RED', 'GRAY', 'WHITE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BristolStoolCategory" (
    "id" SERIAL NOT NULL,
    "type" "BristolStoolType" NOT NULL,
    "key" TEXT NOT NULL,
    "color" "StoolColor" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BristolStoolCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoolRecord" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bristolCategoryId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StoolRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BristolStoolCategory_type_key" ON "BristolStoolCategory"("type");

-- CreateIndex
CREATE UNIQUE INDEX "BristolStoolCategory_key_key" ON "BristolStoolCategory"("key");

-- CreateIndex
CREATE INDEX "StoolRecord_userId_idx" ON "StoolRecord"("userId");

-- CreateIndex
CREATE INDEX "StoolRecord_bristolCategoryId_idx" ON "StoolRecord"("bristolCategoryId");

-- AddForeignKey
ALTER TABLE "StoolRecord" ADD CONSTRAINT "StoolRecord_bristolCategoryId_fkey" FOREIGN KEY ("bristolCategoryId") REFERENCES "BristolStoolCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoolRecord" ADD CONSTRAINT "StoolRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
