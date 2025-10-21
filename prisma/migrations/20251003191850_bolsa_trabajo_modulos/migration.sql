-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `cv_url` VARCHAR(500) NULL;

-- CreateTable
CREATE TABLE `oferta_estados` (
    `id_oferta_estados` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_estado` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `uq_oferta_estado`(`nombre_estado`),
    PRIMARY KEY (`id_oferta_estados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ofertas` (
    `id_ofertas` INTEGER NOT NULL AUTO_INCREMENT,
    `empresas_id` INTEGER NOT NULL,
    `creado_por_usuarios_id` INTEGER NULL,
    `titulo` VARCHAR(250) NOT NULL,
    `ubicacion` VARCHAR(255) NULL,
    `descripcion` TEXT NULL,
    `es_flyer` TINYINT NOT NULL DEFAULT 0,
    `flyer_url` VARCHAR(500) NULL,
    `fecha_publicacion` DATETIME(0) NULL,
    `fecha_cierre` DATETIME(0) NULL,
    `oferta_estados_id` INTEGER NOT NULL DEFAULT 1,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_ofertas_empresa`(`empresas_id`),
    INDEX `idx_ofertas_estado`(`oferta_estados_id`),
    INDEX `idx_ofertas_empresa_estado`(`empresas_id`, `oferta_estados_id`),
    PRIMARY KEY (`id_ofertas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postulacion_estados` (
    `id_postulacion_estados` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_estado` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `uq_postulacion_estado`(`nombre_estado`),
    PRIMARY KEY (`id_postulacion_estados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postulaciones` (
    `id_postulaciones` INTEGER NOT NULL AUTO_INCREMENT,
    `ofertas_id` INTEGER NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `mensaje` TEXT NULL,
    `postulacion_estados_id` INTEGER NOT NULL DEFAULT 1,
    `revisado_por_usuarios_id` INTEGER NULL,
    `revisado_en` DATETIME(0) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_postu_oferta`(`ofertas_id`),
    INDEX `idx_postu_usuario`(`usuarios_id`),
    INDEX `idx_postu_oferta_estado`(`ofertas_id`, `postulacion_estados_id`),
    UNIQUE INDEX `uq_postu_oferta_usuario`(`ofertas_id`, `usuarios_id`),
    PRIMARY KEY (`id_postulaciones`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id_categorias` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `uq_categorias_nombre`(`nombre`),
    PRIMARY KEY (`id_categorias`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ofertas_categorias` (
    `ofertas_id` INTEGER NOT NULL,
    `categorias_id` INTEGER NOT NULL,

    INDEX `idx_categoria_id`(`categorias_id`),
    PRIMARY KEY (`ofertas_id`, `categorias_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_creador` FOREIGN KEY (`creado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_estado` FOREIGN KEY (`oferta_estados_id`) REFERENCES `oferta_estados`(`id_oferta_estados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_estado` FOREIGN KEY (`postulacion_estados_id`) REFERENCES `postulacion_estados`(`id_postulacion_estados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_revisado` FOREIGN KEY (`revisado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas_categorias` ADD CONSTRAINT `fk_oferta_categoria_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas_categorias` ADD CONSTRAINT `fk_oferta_categoria_categoria` FOREIGN KEY (`categorias_id`) REFERENCES `categorias`(`id_categorias`) ON DELETE RESTRICT ON UPDATE CASCADE;
