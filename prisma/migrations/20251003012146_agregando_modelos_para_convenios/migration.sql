-- CreateTable
CREATE TABLE `solicitud_tipos` (
    `id_tipo` INTEGER NOT NULL,
    `nombre_tipo` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `solicitud_tipos_nombre_tipo_key`(`nombre_tipo`),
    PRIMARY KEY (`id_tipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_convenio_estados` (
    `id_estado` INTEGER NOT NULL,
    `nombre_estado` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `solicitud_convenio_estados_nombre_estado_key`(`nombre_estado`),
    PRIMARY KEY (`id_estado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `firma_origen` (
    `id_firma` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `firma_origen_nombre_key`(`nombre`),
    PRIMARY KEY (`id_firma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsabilidad_actores` (
    `id_actor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `responsabilidad_actores_nombre_key`(`nombre`),
    PRIMARY KEY (`id_actor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsabilidad_categorias` (
    `id_responsabilidad_categorias` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `responsabilidad_categorias_nombre_key`(`nombre`),
    PRIMARY KEY (`id_responsabilidad_categorias`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_convenios` (
    `id_solicitud` INTEGER NOT NULL AUTO_INCREMENT,
    `creado_por_usuario_id` INTEGER NOT NULL,
    `fecha_solicitud` DATE NULL,
    `tipo_solicitud_id` INTEGER NOT NULL,
    `estado_id` INTEGER NOT NULL DEFAULT 1,
    `reviewed_by_user_id` INTEGER NULL,
    `reviewed_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_solicitud`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_convenio_detalle` (
    `id_solicitud` INTEGER NOT NULL,
    `objetivo` TEXT NULL,
    `alcance` TEXT NULL,
    `firma_origen_id` INTEGER NULL,
    `firma_origen_otro` VARCHAR(250) NULL,
    `dependencia_nombre` VARCHAR(250) NULL,
    `dependencia_responsable_nombre` VARCHAR(250) NULL,
    `dependencia_telefono` VARCHAR(50) NULL,
    `dependencia_email` VARCHAR(150) NULL,
    `dependencia_telefono_oficina` VARCHAR(50) NULL,
    `coordinador_nombre` VARCHAR(250) NULL,
    `coordinador_email` VARCHAR(150) NULL,
    `coordinador_telefono_oficina` VARCHAR(50) NULL,
    `entregables_empresa` TEXT NULL,
    `fecha_inicio` DATE NULL,
    `fecha_conclusion` DATE NULL,
    `ceremonia_realizara` BOOLEAN NOT NULL DEFAULT false,
    `ceremonia_fecha_hora` DATETIME(0) NULL,
    `ceremonia_lugar` VARCHAR(255) NULL,
    `requerimientos_evento` TEXT NULL,
    `solicitante_nombre` VARCHAR(250) NULL,
    `otros_campos` JSON NULL,
    `nombre_proyecto` VARCHAR(250) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_solicitud`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_responsabilidades` (
    `id_responsabilidades` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `actor_id` INTEGER NOT NULL,
    `responsabilidad_categorias_id` INTEGER NOT NULL,
    `contenido` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_responsabilidades`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_entregables` (
    `id_entregable` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `destinatario` VARCHAR(120) NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_entregable`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_docentes` (
    `id_docente` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `numero` INTEGER NULL,
    `nombre_completo` VARCHAR(250) NOT NULL,
    `grado_academico` VARCHAR(150) NULL,
    `programa_educativo` VARCHAR(200) NULL,
    `rol_en_proyecto` VARCHAR(150) NULL,
    `firma` VARCHAR(250) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_docente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_estudiantes` (
    `id_estudiante` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `numero` INTEGER NULL,
    `nombre_completo` VARCHAR(250) NOT NULL,
    `genero` VARCHAR(50) NULL,
    `programa_educativo` VARCHAR(200) NULL,
    `semestre` VARCHAR(50) NULL,
    `grupo` VARCHAR(50) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_estudiante`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_estado_historial` (
    `id_estado_historial` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `estado_id` INTEGER NOT NULL,
    `cambiado_por_usuario_id` INTEGER NULL,
    `comentario` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_estado_historial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_tipo_solicitud_id_fkey` FOREIGN KEY (`tipo_solicitud_id`) REFERENCES `solicitud_tipos`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `solicitud_convenio_estados`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_creado_por_usuario_id_fkey` FOREIGN KEY (`creado_por_usuario_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_reviewed_by_user_id_fkey` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenio_detalle` ADD CONSTRAINT `solicitud_convenio_detalle_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenio_detalle` ADD CONSTRAINT `solicitud_convenio_detalle_firma_origen_id_fkey` FOREIGN KEY (`firma_origen_id`) REFERENCES `firma_origen`(`id_firma`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `responsabilidad_actores`(`id_actor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_responsabilidad_categorias_id_fkey` FOREIGN KEY (`responsabilidad_categorias_id`) REFERENCES `responsabilidad_categorias`(`id_responsabilidad_categorias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_entregables` ADD CONSTRAINT `solicitud_entregables_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_docentes` ADD CONSTRAINT `solicitud_docentes_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estudiantes` ADD CONSTRAINT `solicitud_estudiantes_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estado_historial` ADD CONSTRAINT `solicitud_estado_historial_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estado_historial` ADD CONSTRAINT `solicitud_estado_historial_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `solicitud_convenio_estados`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;
