/*
  Warnings:

  - Added the required column `paso_actual` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `paso_actual` INTEGER NOT NULL;
