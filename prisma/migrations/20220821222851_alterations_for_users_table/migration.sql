/*
  Warnings:

  - Added the required column `user_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `user_id` VARCHAR(64) NOT NULL;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(64) NOT NULL,
    `address1` VARCHAR(255) NOT NULL,
    `address2` VARCHAR(255) NULL,
    `number` INTEGER NOT NULL,
    `complement` TEXT NULL,
    `state` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(64) NOT NULL,
    `first_name` VARCHAR(16) NOT NULL,
    `last_name` VARCHAR(16) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone` CHAR(15) NOT NULL,
    `address_id` VARCHAR(64) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `address_id`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- RenameIndex
ALTER TABLE `categories` RENAME INDEX `name` TO `categories_name_key`;
