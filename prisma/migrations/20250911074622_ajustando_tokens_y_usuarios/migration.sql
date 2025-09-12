/*
  Warnings:

  - You are about to drop the column `bloqueado_hasta` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `intentos_fallidos` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tokens_usuarios` ADD COLUMN `reenvio` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ultimo_envio` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `bloqueado_hasta`,
    DROP COLUMN `intentos_fallidos`;
