/*
  Warnings:

  - Made the column `updatedAt` on table `binlocation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `stockitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `stockitembinlocationcount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `warehouse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `binlocation` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stockitem` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stockitembinlocationcount` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `warehouse` MODIFY `updatedAt` DATETIME(3) NOT NULL;
