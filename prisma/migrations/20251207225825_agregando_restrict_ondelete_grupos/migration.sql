-- DropForeignKey
ALTER TABLE `contactos` DROP FOREIGN KEY `fk_contactos_grupo`;

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_grupo` FOREIGN KEY (`grupos_id`) REFERENCES `grupos`(`id_grupos`) ON DELETE RESTRICT ON UPDATE CASCADE;
