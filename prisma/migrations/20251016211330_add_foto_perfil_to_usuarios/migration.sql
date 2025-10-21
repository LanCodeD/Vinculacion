/*
  Warnings:

  - You are about to drop the column `foto_perfil` on the `egresados` table. All the data in the column will be lost.
  - You are about to drop the column `foto_perfil` on the `empresas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ofertas_categorias` DROP FOREIGN KEY `fk_oferta_categoria_oferta`;

-- AlterTable
ALTER TABLE `egresados` DROP COLUMN `foto_perfil`;

-- AlterTable
ALTER TABLE `empresas` DROP COLUMN `foto_perfil`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `foto_perfil` VARCHAR(500) NULL;

-- AddForeignKey
ALTER TABLE `ofertas_categorias` ADD CONSTRAINT `fk_oferta_categoria_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE CASCADE ON UPDATE CASCADE;
