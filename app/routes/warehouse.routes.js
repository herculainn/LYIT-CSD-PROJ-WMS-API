module.exports = (app) => {
    const warehouseController = require("../controllers/warehouse.controller");
    const router = require("express").Router();

    // A simple test route
    router.get('/test', (req, res) => {
        res.json({
            result: "success",
            message: "Test GET."
        })
    });

    // The REST Verb determines the action to perform; GET, POST, PUT, DELETE.
    // ":id" - PATH PARAMETERS used to identify an entity to perform an action against.
    // "?key=value" - QUERY PARAMETERS can be used to provide additional information for these actions.
    // "/" - If no Path Parameter is provided, the API will read the REQUEST BODY to determine useful values.
    // https://axios-http.com/docs/urlencoded
    // https://nodejs.org/api/querystring.html

    // RETRIEVE
    router.get('/', warehouseController.getWarehouseFromBody);
    router.get('/:id', warehouseController.getWarehouseFromParams);

    // CREATE
    router.post('/', warehouseController.postWarehouseFromBody);
    router.post('/:id', warehouseController.postWarehouseFromParams);

    // UPDATE
    router.put('/', warehouseController.putWarehouseFromBody);
    router.put('/:id', warehouseController.putWarehouseFromParams);

    // DELETE
    router.delete('/', warehouseController.deleteWarehouseFromBody);
    router.delete('/:id', warehouseController.deleteWarehouseFromParams);

    // TODO:
    //   Here we can add drill-down routes to perform an action on a selected entity.
    //
    //   for example: "delete warehouse 123456789":
    //   https://localhost:8080/api/warehouses/123456789/delete
    //
    //   "StockItem 6789 at BinLocation 12345 has a StockItemCount of 999"
    //   https://localhost:8080/api/stockitem/6789/binLocations/12345?stockItemCount=999
    //
    //   The following drill-down from top-to-bottom would result in the same transaction:
    //   "In Warehouse 123456789, find BinLocation 1235, and set StockItem 6789's StockItemCount to 999"
    //   https://localhost:8080/api/warehouses/123456789/binlocations/12345/stockitem/6789?stockItemCount=999

    app.use('/api/warehouses', router);
}
