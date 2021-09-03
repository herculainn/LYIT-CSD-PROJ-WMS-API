const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    rejectOnNotFound: true
});

const utilities = require("../utils/validation");
const prismaException = require("../utils/prismaException");
const models = require("../models/pseudo.models");

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
        let tmpId = utilities.validateID(req.params.id);

        const resBinLocation = await prisma.binLocation.findUnique({
            where: {
                id: tmpId
            },
            include: {
                stockItemCounts: true
            }
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getBinLocationFromBody = async function (req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resBinLocations = await prisma.binLocation.findMany({
            where: req.body,
            include: {
                stockItemCounts: true
            }
        });

        res.json(resBinLocations);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromParams = async function (req, res) {
    try {
        let newBinLocation = {};
        if (req.params.id) newBinLocation.id = utilities.validateID(req.params.id);
        models.buildBinLocation(req.query, newBinLocation);

        const resBinLocation = await prisma.binLocation.create({
            data: newBinLocation
        });

        return res.status(201).json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromBody = async function(req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resBinLocation = await prisma.binLocation.create({
            data: req.body
        });

        return res.status(201).json(resBinLocation); // 'Created'

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromParams = async function (req, res) {
    try {
        let updBinLocation = {};
        if (req.params.id) updBinLocation.id = utilities.validateID(req.params.id);
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
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromBody = async function(req, res) {
    try {
        req.body.id = utilities.validateID(req.body.id);

        const resBinLocation = await prisma.binLocation.upsert({
            where: { // only unique fields
                id: req.body.id
            },
            update: req.body,
            create: req.body
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromParams = async function(req, res) {
    try {
        let tmpId = utilities.validateID(req.params.id);

        const resBinLocation = await prisma.binLocation.delete({
            where: {
                id: tmpId // Unique match
            }
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromBody = async function(req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resBinLocation = await prisma.binLocation.deleteMany({
            where: req.body
        });

        return res.json(resBinLocation);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
