/*
  Warnings:

  - You are about to drop the column `educacion` on the `empresas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `empresas` DROP COLUMN `educacion`,
    ADD COLUMN `titulo` VARCHAR(60) NULL;
