/*
  Warnings:

  - You are about to drop the column `correo` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `es_flyer` on the `ofertas` table. All the data in the column will be lost.
  - You are about to drop the column `flyer_url` on the `ofertas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `empresas` DROP COLUMN `correo`,
    ADD COLUMN `correo_empresas` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `ofertas` DROP COLUMN `es_flyer`,
    DROP COLUMN `flyer_url`;
