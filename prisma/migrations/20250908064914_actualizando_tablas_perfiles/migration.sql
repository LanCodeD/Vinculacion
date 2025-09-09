-- AlterTable
ALTER TABLE `empresas` ADD COLUMN `puesto` VARCHAR(100) NULL,
    ADD COLUMN `titulo` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `egresados` (
    `id_egresados` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NOT NULL,
    `titulo` VARCHAR(50) NULL,
    `puesto` VARCHAR(100) NULL,
    `matricula` VARCHAR(50) NOT NULL,
    `fecha_egreso` DATETIME(0) NULL,
    `correo_institucional` VARCHAR(150) NULL,
    `empresas_id` INTEGER NULL,
    `academias_ingenierias_id` INTEGER NOT NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_egresados_usuario`(`usuarios_id`),
    INDEX `idx_egresados_empresa`(`empresas_id`),
    INDEX `idx_egresados_academia`(`academias_ingenierias_id`),
    PRIMARY KEY (`id_egresados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `docentes` (
    `id_docentes` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NOT NULL,
    `academias_ingenierias_id` INTEGER NOT NULL,
    `empresas_id` INTEGER NOT NULL,
    `titulo` VARCHAR(50) NULL,
    `puesto` VARCHAR(100) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_docentes_usuario`(`usuarios_id`),
    INDEX `idx_docentes_empresa`(`empresas_id`),
    INDEX `idx_docentes_academia`(`academias_ingenierias_id`),
    PRIMARY KEY (`id_docentes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academias_ingenierias` (
    `id_academias` INTEGER NOT NULL AUTO_INCREMENT,
    `ingenieria` VARCHAR(100) NOT NULL,
    `total_semestre` INTEGER NOT NULL,

    PRIMARY KEY (`id_academias`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_academia` FOREIGN KEY (`academias_ingenierias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_academia` FOREIGN KEY (`academias_ingenierias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE RESTRICT ON UPDATE CASCADE;
