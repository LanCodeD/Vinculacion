/*
  Warnings:

  - You are about to drop the column `firma_origen_id` on the `solicitud_convenio_detalle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `solicitud_convenio_detalle` DROP FOREIGN KEY `solicitud_convenio_detalle_firma_origen_id_fkey`;

-- DropIndex
DROP INDEX `solicitud_convenio_detalle_firma_origen_id_fkey` ON `solicitud_convenio_detalle`;

-- AlterTable
ALTER TABLE `solicitud_convenio_detalle` DROP COLUMN `firma_origen_id`;

-- CreateTable
CREATE TABLE `solicitud_firmas_origen` (
    `id_solicitud_firmas_origen` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `id_firma` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_sf_solicitud`(`id_solicitud`),
    INDEX `idx_sf_firma`(`id_firma`),
    PRIMARY KEY (`id_solicitud_firmas_origen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `solicitud_firmas_origen` ADD CONSTRAINT `fk_sf_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_firmas_origen` ADD CONSTRAINT `fk_sf_firma` FOREIGN KEY (`id_firma`) REFERENCES `firma_origen`(`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE;
