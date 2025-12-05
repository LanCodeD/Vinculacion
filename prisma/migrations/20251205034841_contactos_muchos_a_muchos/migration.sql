/*
  Warnings:

  - You are about to drop the column `grupos_id` on the `contactos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contactos` DROP FOREIGN KEY `fk_contactos_grupo`;

-- DropIndex
DROP INDEX `idx_contactos_grupo` ON `contactos`;

-- AlterTable
ALTER TABLE `contactos` DROP COLUMN `grupos_id`;

-- CreateTable
CREATE TABLE `contactos_grupos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contacto_id` INTEGER NOT NULL,
    `grupo_id` INTEGER NOT NULL,

    INDEX `contactos_grupos_grupo_id_idx`(`grupo_id`),
    UNIQUE INDEX `contactos_grupos_contacto_id_grupo_id_key`(`contacto_id`, `grupo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contactos_grupos` ADD CONSTRAINT `contactos_grupos_contacto_id_fkey` FOREIGN KEY (`contacto_id`) REFERENCES `contactos`(`id_contactos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos_grupos` ADD CONSTRAINT `contactos_grupos_grupo_id_fkey` FOREIGN KEY (`grupo_id`) REFERENCES `grupos`(`id_grupos`) ON DELETE RESTRICT ON UPDATE CASCADE;
