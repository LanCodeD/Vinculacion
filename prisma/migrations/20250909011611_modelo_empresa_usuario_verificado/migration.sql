/*
  Warnings:

  - Added the required column `usuarios_id` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `egresados` ADD COLUMN `verificado_en` DATETIME(0) NULL,
    ADD COLUMN `verificado_por_usuarios_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `empresas` ADD COLUMN `usuarios_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `fk_egresados_verificado_por` ON `egresados`(`verificado_por_usuarios_id`);

-- CreateIndex
CREATE INDEX `idx_empresas_usuario` ON `empresas`(`usuarios_id`);

-- AddForeignKey
ALTER TABLE `empresas` ADD CONSTRAINT `fk_empresas_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_verificado_por` FOREIGN KEY (`verificado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;
