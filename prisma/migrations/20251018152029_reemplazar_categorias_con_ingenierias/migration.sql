/*
  Warnings:

  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ofertas_categorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ofertas_categorias` DROP FOREIGN KEY `fk_oferta_categoria_categoria`;

-- DropForeignKey
ALTER TABLE `ofertas_categorias` DROP FOREIGN KEY `fk_oferta_categoria_oferta`;

-- DropTable
DROP TABLE `categorias`;

-- DropTable
DROP TABLE `ofertas_categorias`;

-- CreateTable
CREATE TABLE `ofertas_ingenierias` (
    `ofertas_id` INTEGER NOT NULL,
    `academias_id` INTEGER NOT NULL,

    INDEX `idx_ingenieria_id`(`academias_id`),
    PRIMARY KEY (`ofertas_id`, `academias_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ofertas_ingenierias` ADD CONSTRAINT `fk_oferta_ingenieria_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas_ingenierias` ADD CONSTRAINT `fk_oferta_ingenieria_academia` FOREIGN KEY (`academias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;
