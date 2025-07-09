-- CreateTable
CREATE TABLE "StreakDay" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "streak_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreakDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StreakDay_streak_id_idx" ON "StreakDay"("streak_id");

-- CreateIndex
CREATE INDEX "StreakDay_date_idx" ON "StreakDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "StreakDay_streak_id_date_key" ON "StreakDay"("streak_id", "date");

-- AddForeignKey
ALTER TABLE "StreakDay" ADD CONSTRAINT "StreakDay_streak_id_fkey" FOREIGN KEY ("streak_id") REFERENCES "Streak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
