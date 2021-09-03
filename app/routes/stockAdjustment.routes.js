module.exports = (app) => {
    const stockAdjustmentController = require("../controllers/stockAdjustment.controller");
    const router = require("express").Router();

    // This route will allow access to update the stock count at a particular location
    // The table name containing the relationship between StockLocations and BinLocations
    // has been called StockItemBinLocationCount - which describes what it stores not what we
    // want to do with it; and so this route and controller will be called StockAdjustment

    // Interfacing with the controller via this route allows the
    // user to update the count of stock contained in a location.

    // The post to root will need a custom JSON layout to be published for use on the API documentation
    // An item can be created without a location; however without one there can be no count
    // So all fields should be required for these calls. The calls should also generate a relationship
    // if one does not already exist.

    /*
    {
        stockItem: 1234,
        binLocation: 5678,
        adjustment: -10
    }
     */

    // Use Request BODY
    router.post('/', stockAdjustmentController.postStockAdjustmentFromBody);

    // User could also route using PATH PARAMETERS and QUERY STRING
    // example: http://localhost:24326/api/stockadjustment/499?binLocation=887&adjustment=-9
    router.post('/:stockItem', stockAdjustmentController.postStockAdjustmentFromParams);

    app.use('/api/stockadjustment', router);
}
