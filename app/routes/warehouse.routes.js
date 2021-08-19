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

    /* TODO: DOCUMENTATION
        *
        * Documentation Example:
        *
        * GET A WAREHOUSE
        * GET /api/warehouses/{id}
        *
        * - REQUEST
        *
        * - - PATH PARAMETERS
        *
        *     id: integer
        *     "The ID od the warehouse"
        *
        * - - QUERY PARAMETERS
        *
        *     description: string (optional)
        *     "The Description of the warehouse"
        *
        *     postcode: string (optional)
        *     "The address of the warehouse"
        *
     */

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

    // TODO: DRILL DOWN
    //   /api/warehouses/<thisOne>/binlocations/....
    //   /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/.....
    //   /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/<thisOne>

    app.use('/api/warehouses', router);
}
