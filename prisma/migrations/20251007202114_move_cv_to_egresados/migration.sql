/*
  Warnings:

  - You are about to drop the column `cv_url` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `egresados` ADD COLUMN `cv_url` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `cv_url`;
