/*
  Warnings:

  - The values [LOW] on the enum `priority_level` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "priority_level_new" AS ENUM ('NORMAL', 'MEDIUM', 'HIGH');
ALTER TABLE "public"."tasks" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "priority" TYPE "priority_level_new" USING ("priority"::text::"priority_level_new");
ALTER TYPE "priority_level" RENAME TO "priority_level_old";
ALTER TYPE "priority_level_new" RENAME TO "priority_level";
DROP TYPE "public"."priority_level_old";
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'NORMAL';
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'NORMAL';

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
