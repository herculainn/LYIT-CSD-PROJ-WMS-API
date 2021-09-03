// Traditional Models (MVC pattern) are not available from Prisma
// there functions will help pull relevant fields from requests

exports.buildWarehouse = (aSource, aTarget) => {
    if (aSource.description) aTarget.description = aSource.description;
    if (aSource.address1) aTarget.address1 = aSource.address1;
    if (aSource.address2) aTarget.address2 = aSource.address2;
    if (aSource.address3) aTarget.address3 = aSource.address3;
    if (aSource.addressTown) aTarget.addressTown = aSource.addressTown;
    if (aSource.addressCounty) aTarget.addressCounty = aSource.addressCounty;
    if (aSource.addressCountry) aTarget.addressCountry = aSource.addressCountry;
    if (aSource.postcode) aTarget.postcode = aSource.postcode;
}

exports.buildBinLocation = (aSource, aTarget) => {
    if (aSource.description) aTarget.description = aSource.description;
    if (aSource.aisle) aTarget.aisle = aSource.aisle;
    if (aSource.shelf) aTarget.shelf = aSource.shelf;
}

exports.buildStockItem = (aSource, aTarget) => {
    if (aSource.description) aTarget.description = aSource.description;
    if (aSource.ean) aTarget.ean = aSource.ean;
    if (aSource.upc) aTarget.upc = aSource.upc;
}

exports.buildStockAdjustment = (aSource, aTarget) => {
    if (aSource.stockItem) aTarget.stockItem = aSource.stockItem;
    if (aSource.binLocation) aTarget.binLocation = aSource.binLocation;
    if (aSource.adjustment) aTarget.adjustment = aSource.adjustment;
    if (aSource.count) aTarget.count = aSource.count;
}