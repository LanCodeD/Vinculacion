/*
  Warnings:

  - You are about to drop the column `activa` on the `ofertas` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `ofertas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ofertas` DROP COLUMN `activa`,
    DROP COLUMN `descripcion`,
    ADD COLUMN `descripcion_general` TEXT NULL,
    ADD COLUMN `horario` VARCHAR(100) NULL,
    ADD COLUMN `modalidad` VARCHAR(50) NULL,
    ADD COLUMN `requisitos` TEXT NULL;
