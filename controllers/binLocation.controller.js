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
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getBinLocationFromBody = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postBinLocationFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putBinLocationFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromParams = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteBinLocationFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
