-- AlterTable
ALTER TABLE `ofertas` ADD COLUMN `verificado_en` DATETIME(3) NULL,
    ADD COLUMN `verificado_por_usuarios_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `ofertas_verificado_por_usuarios_id_fkey` FOREIGN KEY (`verificado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;
