/*
  Warnings:

  - You are about to drop the `_binlocationtostockitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_binlocationtostockitem` DROP FOREIGN KEY `_binlocationtostockitem_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_binlocationtostockitem` DROP FOREIGN KEY `_binlocationtostockitem_ibfk_2`;

-- AlterTable
ALTER TABLE `binlocation` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stockitem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `warehouse` ADD COLUMN `address1` VARCHAR(191),
    ADD COLUMN `address2` VARCHAR(191),
    ADD COLUMN `address3` VARCHAR(191),
    ADD COLUMN `addressCountry` VARCHAR(191),
    ADD COLUMN `addressCounty` VARCHAR(191),
    ADD COLUMN `addressTown` VARCHAR(191),
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `postcode` VARCHAR(191),
    ADD COLUMN `updatedAt` DATETIME(3);

-- DropTable
DROP TABLE `_binlocationtostockitem`;

-- CreateTable
CREATE TABLE `StockItemBinLocationCount` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `binLocationId` INTEGER NOT NULL,
    `stockItemId` INTEGER NOT NULL,
    `stockItemCount` INTEGER NOT NULL,

    PRIMARY KEY (`binLocationId`, `stockItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191),
    `lastName` VARCHAR(191),
    `role` ENUM('OPERATIVE', 'BACKOFFICE', 'ADMIN') NOT NULL DEFAULT 'OPERATIVE',
    `warehouseId` INTEGER NOT NULL,

    UNIQUE INDEX `User.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockItemBinLocationCount` ADD FOREIGN KEY (`binLocationId`) REFERENCES `BinLocation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockItemBinLocationCount` ADD FOREIGN KEY (`stockItemId`) REFERENCES `StockItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
