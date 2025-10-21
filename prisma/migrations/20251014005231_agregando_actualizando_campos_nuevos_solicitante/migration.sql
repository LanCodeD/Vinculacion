/*
  Warnings:

  - You are about to drop the column `coordinador_email` on the `solicitud_convenio_detalle` table. All the data in the column will be lost.
  - You are about to drop the column `coordinador_nombre` on the `solicitud_convenio_detalle` table. All the data in the column will be lost.
  - You are about to drop the column `coordinador_telefono_oficina` on the `solicitud_convenio_detalle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `solicitud_convenio_detalle` DROP COLUMN `coordinador_email`,
    DROP COLUMN `coordinador_nombre`,
    DROP COLUMN `coordinador_telefono_oficina`,
    ADD COLUMN `solicitante_email` VARCHAR(150) NULL,
    ADD COLUMN `solicitante_ext_oficina` VARCHAR(10) NULL,
    ADD COLUMN `solicitante_telefono_movil` VARCHAR(50) NULL,
    ADD COLUMN `solicitante_telefono_oficina` VARCHAR(50) NULL;
