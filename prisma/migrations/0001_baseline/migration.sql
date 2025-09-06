-- CreateTable
CREATE TABLE `consents` (
    `id_consentimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NOT NULL,
    `aviso_version` VARCHAR(100) NOT NULL,
    `fecha_consentimiento` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ip` VARCHAR(50) NULL,
    `user_agent` VARCHAR(500) NULL,
    `consent_items` JSON NULL,

    INDEX `fk_consents_usuario`(`usuarios_id`),
    PRIMARY KEY (`id_consentimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacto_estados` (
    `id_contacto_estados` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_estado` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(100) NULL,

    UNIQUE INDEX `nombre_estado`(`nombre_estado`),
    PRIMARY KEY (`id_contacto_estados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactos` (
    `id_contactos` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NULL,
    `titulo` VARCHAR(50) NULL,
    `nombre` VARCHAR(100) NULL,
    `apellido` VARCHAR(100) NULL,
    `puesto` VARCHAR(100) NULL,
    `celular` VARCHAR(20) NULL,
    `correo` VARCHAR(150) NULL,
    `empresas_id` INTEGER NOT NULL,
    `grupos_id` INTEGER NULL,
    `es_representante` TINYINT NOT NULL DEFAULT 0,
    `contacto_estados_id` INTEGER NOT NULL DEFAULT 1,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_contactos_estado`(`contacto_estados_id`),
    INDEX `fk_contactos_usuario`(`usuarios_id`),
    INDEX `idx_contactos_correo`(`correo`),
    INDEX `idx_contactos_empresa`(`empresas_id`),
    INDEX `idx_contactos_empresa_rep`(`empresas_id`, `es_representante`),
    INDEX `idx_contactos_grupo`(`grupos_id`),
    PRIMARY KEY (`id_contactos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id_empresas` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_comercial` VARCHAR(150) NOT NULL,
    `razon_social` VARCHAR(150) NULL,
    `rfc` VARCHAR(12) NOT NULL,
    `direccion` VARCHAR(255) NULL,
    `correo` VARCHAR(150) NULL,
    `telefono` VARCHAR(25) NULL,
    `verificado` TINYINT NOT NULL DEFAULT 0,
    `verificado_por_usuarios_id` INTEGER NULL,
    `verificado_en` DATETIME(0) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_empresas_rfc`(`rfc`),
    INDEX `fk_empresas_verificado_por`(`verificado_por_usuarios_id`),
    PRIMARY KEY (`id_empresas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos` (
    `id_grupos` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_grupo` VARCHAR(150) NOT NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_grupos_nombre`(`nombre_grupo`),
    PRIMARY KEY (`id_grupos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificaciones` (
    `id_notificaciones` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NULL,
    `contactos_id` INTEGER NULL,
    `tipo` VARCHAR(100) NULL,
    `titulo` VARCHAR(250) NULL,
    `mensaje` TEXT NULL,
    `metadata` JSON NULL,
    `leido` TINYINT NOT NULL DEFAULT 0,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_notifications_contacto`(`contactos_id`),
    INDEX `fk_notifications_usuario`(`usuarios_id`),
    PRIMARY KEY (`id_notificaciones`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permisos` (
    `id_permisos` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(150) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id_permisos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_roles` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(150) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles_permisos` (
    `roles_id` INTEGER NOT NULL,
    `permisos_id` INTEGER NOT NULL,

    INDEX `fk_roles_perm_perm`(`permisos_id`),
    PRIMARY KEY (`roles_id`, `permisos_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_cuenta` (
    `id_tipos_cuenta` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(150) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id_tipos_cuenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens_usuarios` (
    `id_token` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarios_id` INTEGER NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `tipo` VARCHAR(30) NOT NULL,
    `expiracion_en` DATETIME(0) NOT NULL,
    `usado_en` DATETIME(0) NULL,
    `intentos` INTEGER NOT NULL DEFAULT 0,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_tokens_usuarios_hash`(`token_hash`),
    INDEX `idx_tokens_usuarios_tipo`(`tipo`),
    INDEX `idx_tokens_usuarios_usuario`(`usuarios_id`),
    PRIMARY KEY (`id_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuarios` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `apellido` VARCHAR(120) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `celular` VARCHAR(20) NULL,
    `tipos_cuenta_id` INTEGER NOT NULL,
    `roles_id` INTEGER NOT NULL,
    `correo_verificado` TINYINT NOT NULL DEFAULT 0,
    `correo_verificado_en` DATETIME(0) NULL,
    `last_login` DATETIME(0) NULL,
    `intentos_fallidos` INTEGER NOT NULL DEFAULT 0,
    `bloqueado_hasta` DATETIME(0) NULL,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_usuarios_correo`(`correo`),
    INDEX `fk_usuarios_role`(`roles_id`),
    INDEX `idx_usuarios_tipo`(`tipos_cuenta_id`),
    PRIMARY KEY (`id_usuarios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `consents` ADD CONSTRAINT `fk_consents_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_estado` FOREIGN KEY (`contacto_estados_id`) REFERENCES `contacto_estados`(`id_contacto_estados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_grupo` FOREIGN KEY (`grupos_id`) REFERENCES `grupos`(`id_grupos`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contactos` ADD CONSTRAINT `fk_contactos_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresas` ADD CONSTRAINT `fk_empresas_verificado_por` FOREIGN KEY (`verificado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `fk_notifications_contacto` FOREIGN KEY (`contactos_id`) REFERENCES `contactos`(`id_contactos`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `fk_notifications_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `fk_roles_perm_perm` FOREIGN KEY (`permisos_id`) REFERENCES `permisos`(`id_permisos`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `fk_roles_perm_role` FOREIGN KEY (`roles_id`) REFERENCES `roles`(`id_roles`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens_usuarios` ADD CONSTRAINT `fk_tokens_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_role` FOREIGN KEY (`roles_id`) REFERENCES `roles`(`id_roles`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_tipo` FOREIGN KEY (`tipos_cuenta_id`) REFERENCES `tipos_cuenta`(`id_tipos_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

