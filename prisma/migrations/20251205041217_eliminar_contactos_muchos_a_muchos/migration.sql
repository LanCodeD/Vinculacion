/*
  Warnings:

  - You are about to drop the `contactos_grupos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contactos_grupos` DROP FOREIGN KEY `contactos_grupos_contacto_id_fkey`;

-- DropForeignKey
ALTER TABLE `contactos_grupos` DROP FOREIGN KEY `contactos_grupos_grupo_id_fkey`;

-- AlterTable
ALTER TABLE `contactos` ADD COLUMN `grupos_id` INTEGER NULL;

-- DropTable
DROP TABLE `contactos_grupos`;

-- CreateIndex
CREATE INDEX `idx_contactos_grupo` ON `contactos`(`grupos_id`);

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_grupo` FOREIGN KEY (`grupos_id`) REFERENCES `grupos`(`id_grupos`) ON DELETE SET NULL ON UPDATE CASCADE;
