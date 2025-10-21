-- AlterTable
ALTER TABLE `solicitud_convenio_detalle` ADD COLUMN `contacto_email` VARCHAR(150) NULL,
    ADD COLUMN `contacto_ext_oficina` VARCHAR(10) NULL,
    ADD COLUMN `contacto_nombre` VARCHAR(250) NULL,
    ADD COLUMN `contacto_telefono_movil` VARCHAR(50) NULL,
    ADD COLUMN `contacto_telefono_oficina` VARCHAR(50) NULL;
