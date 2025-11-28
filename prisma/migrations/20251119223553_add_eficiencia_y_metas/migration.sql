/*
  Warnings:

  - Added the required column `id_metas_convenios` to the `convenio_concretado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convenio_concretado` ADD COLUMN `eficiencia` INTEGER NULL,
    ADD COLUMN `id_metas_convenios` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `metas_convenios` (
    `id_metas_convenios` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_metas_convenios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `convenio_concretado` ADD CONSTRAINT `convenio_concretado_id_metas_convenios_fkey` FOREIGN KEY (`id_metas_convenios`) REFERENCES `metas_convenios`(`id_metas_convenios`) ON DELETE RESTRICT ON UPDATE CASCADE;
