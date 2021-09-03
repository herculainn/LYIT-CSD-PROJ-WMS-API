/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `StockItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[upc]` on the table `StockItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StockItem.ean_unique` ON `StockItem`(`ean`);

-- CreateIndex
CREATE UNIQUE INDEX `StockItem.upc_unique` ON `StockItem`(`upc`);
