-- CreateTable
CREATE TABLE `convenio_concretado` (
    `id_convenio_concretado` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `documento_ruta` VARCHAR(255) NULL,
    `fecha_firmada` DATE NULL,
    `vigencia` VARCHAR(50) NULL,
    `fecha_expira` DATE NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `convenio_concretado_id_solicitud_key`(`id_solicitud`),
    PRIMARY KEY (`id_convenio_concretado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `convenio_concretado` ADD CONSTRAINT `convenio_concretado_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;
