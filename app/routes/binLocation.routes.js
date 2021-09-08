const binLocationController = require("../controllers/binLocation.controller");
module.exports = (app) => {
    const binLocationController = require("../controllers/binLocation.controller");
    const router = require("express").Router();

    // RETRIEVE
    router.get('/', binLocationController.getBinLocationFromBody);
    router.get('/:id', binLocationController.getBinLocationFromParams);

    // CREATE
    router.post('/', binLocationController.postBinLocationFromBody);
    router.post('/:id', binLocationController.postBinLocationFromParams);

    // UPDATE
    router.put('/', binLocationController.putBinLocationFromBody);
    router.put('/:id', binLocationController.putBinLocationFromParams);

    // DELETE
    router.delete('/', binLocationController.deleteBinLocationFromBody);
    router.delete('/:id', binLocationController.deleteBinLocationFromParams);

    // BY WAREHOUSE
    // Chrome (the React Client) does not allow GET requests to send DATA
    // This means the paths above for getBinLocationFromBody works in postman
    // but it does not work during implementation!
    router.get('/warehouseid/:id', binLocationController.getByWarehouseId);

    // Related Items
    // It may be a requirement of a client to retrieve a list of related stockItems
    router.get('/stockItems/:id', binLocationController.getStockItems);

    app.use('/api/binlocations', router);
}
