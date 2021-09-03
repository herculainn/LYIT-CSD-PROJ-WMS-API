const stockCountRoutes = require("../controllers/stockCount.controller");
module.exports = (app) => {
    const stockCountController = require("../controllers/stockCount.controller");
    const router = require("express").Router();

    // This route is the same as stockAdjustment.route.jd

    /*
    {
        stockItem: 1234,
        binLocation: 5678,
        count: 999
    }
     */

    // Use Request BODY
    router.post('/', stockCountController.postStockCountFromBody);

    // User could also route using PATH PARAMETERS and QUERY STRING
    // example: http://localhost:24326/api/stockcount/499?binLocation=887&count=-9
    router.post('/:stockItem', stockCountController.postStockCountFromParams);

    app.use('/api/stockcount', router);
}
