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
    `puesto` VARCHAR(100) NULL,
    `usuarios_id` INTEGER NOT NULL,
    `titulo` VARCHAR(50) NULL,

    UNIQUE INDEX `uq_empresas_rfc`(`rfc`),
    INDEX `idx_empresas_usuario`(`usuarios_id`),
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
    `ip_origen` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `reenvio` INTEGER NOT NULL DEFAULT 0,
    `ultimo_envio` DATETIME(0) NULL,

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
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `paso_actual` INTEGER NOT NULL,
    `foto_perfil` VARCHAR(500) NULL,

    UNIQUE INDEX `uq_usuarios_correo`(`correo`),
    INDEX `fk_usuarios_role`(`roles_id`),
    INDEX `idx_usuarios_tipo`(`tipos_cuenta_id`),
    PRIMARY KEY (`id_usuarios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id_accounts` VARCHAR(191) NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,

    INDEX `accounts_usuarios_id_fkey`(`usuarios_id`),
    PRIMARY KEY (`id_accounts`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `verificado_en` DATETIME(0) NULL,
    `verificado_por_usuarios_id` INTEGER NULL,
    `cv_url` VARCHAR(500) NULL,

    INDEX `idx_egresados_usuario`(`usuarios_id`),
    INDEX `idx_egresados_empresa`(`empresas_id`),
    INDEX `idx_egresados_academia`(`academias_ingenierias_id`),
    INDEX `fk_egresados_verificado_por`(`verificado_por_usuarios_id`),
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
    `es_flyer` TINYINT NOT NULL DEFAULT 0,
    `flyer_url` VARCHAR(500) NULL,
    `fecha_publicacion` DATETIME(0) NULL,
    `fecha_cierre` DATETIME(0) NULL,
    `oferta_estados_id` INTEGER NOT NULL DEFAULT 1,
    `creado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `imagen` VARCHAR(500) NULL,
    `puesto` VARCHAR(150) NULL,
    `verificado_en` DATETIME(3) NULL,
    `verificado_por_usuarios_id` INTEGER NULL,
    `descripcion_general` TEXT NULL,
    `horario` VARCHAR(100) NULL,
    `modalidad` VARCHAR(50) NULL,
    `requisitos` TEXT NULL,

    INDEX `idx_ofertas_empresa`(`empresas_id`),
    INDEX `idx_ofertas_estado`(`oferta_estados_id`),
    INDEX `idx_ofertas_empresa_estado`(`empresas_id`, `oferta_estados_id`),
    INDEX `fk_ofertas_creador`(`creado_por_usuarios_id`),
    INDEX `ofertas_verificado_por_usuarios_id_fkey`(`verificado_por_usuarios_id`),
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
    INDEX `fk_postu_estado`(`postulacion_estados_id`),
    INDEX `fk_postu_revisado`(`revisado_por_usuarios_id`),
    UNIQUE INDEX `uq_postu_oferta_usuario`(`ofertas_id`, `usuarios_id`),
    PRIMARY KEY (`id_postulaciones`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ofertas_ingenierias` (
    `ofertas_id` INTEGER NOT NULL,
    `academias_id` INTEGER NOT NULL,

    INDEX `idx_ingenieria_id`(`academias_id`),
    PRIMARY KEY (`ofertas_id`, `academias_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

    INDEX `solicitud_convenios_creado_por_usuario_id_fkey`(`creado_por_usuario_id`),
    INDEX `solicitud_convenios_estado_id_fkey`(`estado_id`),
    INDEX `solicitud_convenios_reviewed_by_user_id_fkey`(`reviewed_by_user_id`),
    INDEX `solicitud_convenios_tipo_solicitud_id_fkey`(`tipo_solicitud_id`),
    PRIMARY KEY (`id_solicitud`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_convenio_detalle` (
    `id_solicitud` INTEGER NOT NULL,
    `objetivo` TEXT NULL,
    `alcance` TEXT NULL,
    `firma_origen_otro` VARCHAR(250) NULL,
    `dependencia_nombre` VARCHAR(250) NULL,
    `dependencia_responsable_nombre` VARCHAR(250) NULL,
    `dependencia_telefono` VARCHAR(50) NULL,
    `dependencia_email` VARCHAR(150) NULL,
    `dependencia_telefono_oficina` VARCHAR(50) NULL,
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
    `descripcion_empresa` TEXT NULL,
    `fecha_conclusion_proyecto` DATE NULL,
    `fecha_inicio_proyecto` DATE NULL,
    `dependencia_domicilio_legal` TEXT NULL,
    `dependencia_rfc` VARCHAR(20) NULL,
    `solicitante_email` VARCHAR(150) NULL,
    `solicitante_ext_oficina` VARCHAR(10) NULL,
    `solicitante_telefono_movil` VARCHAR(50) NULL,
    `solicitante_telefono_oficina` VARCHAR(50) NULL,
    `contacto_email` VARCHAR(150) NULL,
    `contacto_ext_oficina` VARCHAR(10) NULL,
    `contacto_nombre` VARCHAR(250) NULL,
    `contacto_telefono_movil` VARCHAR(50) NULL,
    `contacto_telefono_oficina` VARCHAR(50) NULL,

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

    INDEX `solicitud_responsabilidades_actor_id_fkey`(`actor_id`),
    INDEX `solicitud_responsabilidades_id_solicitud_fkey`(`id_solicitud`),
    INDEX `solicitud_responsabilidades_responsabilidad_categorias_id_fkey`(`responsabilidad_categorias_id`),
    PRIMARY KEY (`id_responsabilidades`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_entregables` (
    `id_entregable` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `destinatario` VARCHAR(120) NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `solicitud_entregables_id_solicitud_fkey`(`id_solicitud`),
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

    INDEX `solicitud_docentes_id_solicitud_fkey`(`id_solicitud`),
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

    INDEX `solicitud_estudiantes_id_solicitud_fkey`(`id_solicitud`),
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
    `paso` VARCHAR(50) NULL,

    INDEX `solicitud_estado_historial_estado_id_fkey`(`estado_id`),
    INDEX `solicitud_estado_historial_id_solicitud_fkey`(`id_solicitud`),
    PRIMARY KEY (`id_estado_historial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitud_firmas_origen` (
    `id_solicitud_firmas_origen` INTEGER NOT NULL AUTO_INCREMENT,
    `id_solicitud` INTEGER NOT NULL,
    `id_firma` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_sf_solicitud`(`id_solicitud`),
    INDEX `idx_sf_firma`(`id_firma`),
    PRIMARY KEY (`id_solicitud_firmas_origen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `unidad_vigencia` VARCHAR(50) NULL,
    `estado_dinamico` VARCHAR(50) NULL,

    UNIQUE INDEX `convenio_concretado_id_solicitud_key`(`id_solicitud`),
    PRIMARY KEY (`id_convenio_concretado`)
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
ALTER TABLE `empresas` ADD CONSTRAINT `fk_empresas_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_academia` FOREIGN KEY (`academias_ingenierias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `egresados` ADD CONSTRAINT `fk_egresados_verificado_por` FOREIGN KEY (`verificado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_academia` FOREIGN KEY (`academias_ingenierias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docentes` ADD CONSTRAINT `fk_docentes_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_creador` FOREIGN KEY (`creado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_empresa` FOREIGN KEY (`empresas_id`) REFERENCES `empresas`(`id_empresas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `fk_ofertas_estado` FOREIGN KEY (`oferta_estados_id`) REFERENCES `oferta_estados`(`id_oferta_estados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas` ADD CONSTRAINT `ofertas_verificado_por_usuarios_id_fkey` FOREIGN KEY (`verificado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_estado` FOREIGN KEY (`postulacion_estados_id`) REFERENCES `postulacion_estados`(`id_postulacion_estados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_revisado` FOREIGN KEY (`revisado_por_usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postulaciones` ADD CONSTRAINT `fk_postu_usuario` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas_ingenierias` ADD CONSTRAINT `fk_oferta_ingenieria_academia` FOREIGN KEY (`academias_id`) REFERENCES `academias_ingenierias`(`id_academias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ofertas_ingenierias` ADD CONSTRAINT `fk_oferta_ingenieria_oferta` FOREIGN KEY (`ofertas_id`) REFERENCES `ofertas`(`id_ofertas`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_creado_por_usuario_id_fkey` FOREIGN KEY (`creado_por_usuario_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `solicitud_convenio_estados`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_reviewed_by_user_id_fkey` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenios` ADD CONSTRAINT `solicitud_convenios_tipo_solicitud_id_fkey` FOREIGN KEY (`tipo_solicitud_id`) REFERENCES `solicitud_tipos`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_convenio_detalle` ADD CONSTRAINT `solicitud_convenio_detalle_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `responsabilidad_actores`(`id_actor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_responsabilidades` ADD CONSTRAINT `solicitud_responsabilidades_responsabilidad_categorias_id_fkey` FOREIGN KEY (`responsabilidad_categorias_id`) REFERENCES `responsabilidad_categorias`(`id_responsabilidad_categorias`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_entregables` ADD CONSTRAINT `solicitud_entregables_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_docentes` ADD CONSTRAINT `solicitud_docentes_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estudiantes` ADD CONSTRAINT `solicitud_estudiantes_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estado_historial` ADD CONSTRAINT `solicitud_estado_historial_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `solicitud_convenio_estados`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_estado_historial` ADD CONSTRAINT `solicitud_estado_historial_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_firmas_origen` ADD CONSTRAINT `fk_sf_firma` FOREIGN KEY (`id_firma`) REFERENCES `firma_origen`(`id_firma`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitud_firmas_origen` ADD CONSTRAINT `fk_sf_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `convenio_concretado` ADD CONSTRAINT `convenio_concretado_id_solicitud_fkey` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_convenios`(`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE;
