const binLocationController = require("../controllers/binLocation.controller");
const stockItemController = require("../controllers/stockItem.controller");
module.exports = (app) => {
    const stockItemController = require("../controllers/stockItem.controller");
    const router = require("express").Router();

    // RETRIEVE
    router.get('/', stockItemController.getStockItemFromBody);
    router.get('/:id', stockItemController.getStockItemFromParams);

    // CREATE
    router.post('/', stockItemController.postStockItemFromBody);
    router.post('/:id', stockItemController.postStockItemFromParams);

    // UPDATE
    router.put('/', stockItemController.putStockItemFromBody);
    router.put('/:id', stockItemController.putStockItemFromParams);

    // DELETE
    router.delete('/', stockItemController.deleteStockItemFromBody);
    router.delete('/:id', stockItemController.deleteStockItemFromParams);

    // BY BINLOCATION
    router.get('/binlocationid/:id', stockItemController.getByBinLocationId);

    // Related Locations
    // It may be a requirement of a client to retrieve a list of related binLocations
    router.get('/binLocations/:id', stockItemController.getBinLocations);

    app.use('/api/stockitems', router);
}
