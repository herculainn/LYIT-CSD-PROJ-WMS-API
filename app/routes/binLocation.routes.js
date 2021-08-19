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

    app.use('/api/binlocations', router);
}
