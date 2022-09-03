/*
  Warnings:

  - Added the required column `payment_type` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `total_price` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_type` VARCHAR(191) NOT NULL,
    MODIFY `total_price` INTEGER NOT NULL,
    ALTER COLUMN `delivered_date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    MODIFY `address_id` VARCHAR(64) NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
