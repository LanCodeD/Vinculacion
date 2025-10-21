-- AlterTable
ALTER TABLE `solicitud_convenio_detalle` ADD COLUMN `descripcion_empresa` TEXT NULL,
    ADD COLUMN `fecha_conclusion_proyecto` DATE NULL,
    ADD COLUMN `fecha_inicio_proyecto` DATE NULL;
