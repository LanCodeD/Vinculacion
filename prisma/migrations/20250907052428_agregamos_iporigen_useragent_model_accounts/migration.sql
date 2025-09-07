-- AlterTable
ALTER TABLE `tokens_usuarios` ADD COLUMN `ip_origen` VARCHAR(45) NULL,
    ADD COLUMN `user_agent` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `accounts` (
    `id_accounts` VARCHAR(191) NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_accounts`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_usuarios_id_fkey` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE;
