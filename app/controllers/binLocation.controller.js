// Convenience module to interpret exceptions raised by the prisma client
const prismaException = require("../utils/prismaException");

const models = require("../models/pseudo.models");
const utilities = require("../utils/utils");

// For generating/interpreting URLs with Query Strings
const querystring = require("querystring");
const {validateID} = require("../utils/validation");

// Get Prisma Client
const prisma = require('../../client').prismaClient();

/* // Require the request to be structured for Prisma:

// Create a new BinLocation and add an existing Warehouse:
{
    "description": "myNewBinLocation",
    // other...,
    "warehouse": {
        "connect": {
            "id": 6798
        }
    }
}


// Create a new BinLocation and add a new Warehouse:
{
    "description": "myNewBinLocationWithWarehouse",
    // other...,
    "warehouse": {
        "create": {
            "description": "MyWarehouseCreatedWithBinLocation"
        }
    }
}

// Return values. "warehouseID" instead of "warehouse"
{
    "id": 2,
    "createdAt": "2021-08-18T16:54:36.849Z",
    "updatedAt": "2021-08-18T16:54:36.849Z",
    "description": "myNewBinLocationWithWarehouse",
    "aisle": null,
    "shelf": null,
    "warehouseId": 6799
}

*/

exports.getBinLocationFromParams = async function (req, res) {
    try {
        let searchTerms = {};
        if (req.params.id) searchTerms.id = req.params.id;

        const resBinLocation = await prisma.binLocation.findUnique({
            where: searchTerms,
            include: {
                stockItemCounts: true
            }
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.getStockItems = async function (req, res) {
    try {

        // First we need to get the BinLocation and its related records
        let searchTerms = {};
        if (req.params.id) searchTerms.id = req.params.id;
        const relations = (await prisma.binLocation.findUnique({
            where: searchTerms,
            include: {
                stockItemCounts: true
            }
        })).stockItemCounts;

        // Then we need to look up the related StockItems
        // adding them to a list of StockItems to be Returned
        let returnStockItems = []; // Array...
        for (let i = 0; i < relations.length; i++) {
            const iStockItemId = relations[i].stockItemId
            const iStockItem = await prisma.stockItem.findUnique({
                where: {
                    id: iStockItemId
                },
                include: {
                    stockItemCounts: true
                }
            });
            returnStockItems.push(iStockItem);
        }

        return res.json(returnStockItems);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.getByWarehouseId = async function(req, res) {
    // TODO: Refactor to re-use code!
    try {
        let searchTerms = {};
        if (req.params.id) searchTerms.warehouseId = validateID(req.params.id);

        const resBinLocation = await prisma.binLocation.findMany({
            where: searchTerms,
            include: {
                stockItemCounts: true
            }
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.getBinLocationFromBody = async function (req, res) {
    try {
        const resBinLocations = await prisma.binLocation.findMany({
            where: req.body,
            include: {
                stockItemCounts: true
            }
        });

        res.json(resBinLocations);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromParams = async function (req, res) {
    try {
        let newBinLocation = {};
        if (req.params.id) newBinLocation.id = req.params.id;
        models.buildBinLocation(req.query, newBinLocation);

        const resBinLocation = await prisma.binLocation.create({
            data: newBinLocation
        });

        return res.status(201).json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromBody = async function(req, res) {
    try {
        const resBinLocation = await prisma.binLocation.create({
            data: req.body
        });

        return res.status(201).json(resBinLocation); // 'Created'

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromParams = async function (req, res) {
    try {
        let updBinLocation = {};
        if (req.params.id) updBinLocation.id = req.params.id;
        models.buildBinLocation(req.query, updBinLocation);

        const resBinLocation = await prisma.binLocation.upsert({
            where: {
                id: updBinLocation.id // Unique match
            },
            update: updBinLocation,
            create: updBinLocation
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromBody = async function(req, res) {
    try {
        // Prepare a new JSON object for create
        const createBinLocation = utilities.cloneJSON(req.body);
        // Must have warehouse which may not have been part of the call
        if (!createBinLocation.warehouse) {
            const existingBinLocation = prisma.binLocation.findUnique({ where: {
                id: createBinLocation.id
            }});
            createBinLocation.warehouse = {
                connect: existingBinLocation.warehouseId
            };
        }
        // cannot have id for create
        if (createBinLocation.id) delete createBinLocation.id;

        // Prepare a new JSON object for update
        const updateBinLocation = utilities.cloneJSON(req.body);
        // Must not have warehouse, only warehouseId
        if (updateBinLocation.warehouse) delete updateBinLocation.warehouse;

        const resBinLocation = await prisma.binLocation.upsert({
            where: { // only unique fields
                id: req.body.id
            },
            update: updateBinLocation,
            create: createBinLocation
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromParams = async function(req, res) {
    try {
        let tmpId = req.params.id;

        const resBinLocation = await prisma.binLocation.delete({
            where: {
                id: tmpId // Unique match
            }
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromBody = async function(req, res) {
    try {
        const resBinLocation = await prisma.binLocation.deleteMany({
            where: req.body
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};
