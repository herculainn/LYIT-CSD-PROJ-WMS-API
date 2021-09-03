const querystring = require("querystring");
const models = require("../models/pseudo.models");
const prismaException = require("../utils/prismaException");
const validation = require("../utils/validation");
const utilities = require("../utils/utils");
const prisma = require('../../client').prismaClient();

exports.postStockAdjustmentFromBody = async function(req, res) {

    // The Prisma call to create a stock movement is too complex to offer as an Endpoint for users
    // Instead we should accept the following and translate from Axios to a valid Prisma query:
    // { stockItem: 1234, binLocation: 5678, adjustment: 12 }

    // We also need to accept that the client should not need to determine if a relationship already
    // exists between the item and location before attempting to post a change to a countL prisma.upsert()

    try {

        // This controller exports just two functions which perform the same action
        const resItemLoc = await postAdjustment(req.body);
        return res.status(201).json(resItemLoc);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockAdjustmentFromParams = async function (req, res) {
    try {
        // Build the details for an adjustment from the Path and Query
        let stockAdjustment = {};
        models.buildStockAdjustment(utilities.prepareReqQuery(req.query), stockAdjustment);
        if (!stockAdjustment.stockItem) stockAdjustment.stockItem = req.params.stockItem;

        // This controller exports just two functions which perform the same action
        const resItemLoc = await postAdjustment(stockAdjustment);
        return res.status(201).json(resItemLoc);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

postAdjustment = async function(aAdjustment) {

    // validation in client.js not robust enough to ensure values are integers
    aAdjustment.stockItem = validation.validateID(aAdjustment.stockItem);
    aAdjustment.adjustment = validation.validateID(aAdjustment.adjustment);
    aAdjustment.binLocation = validation.validateID(aAdjustment.binLocation);

    // This is an "adjustment" which means we add the given value to the existing value, not replace it.
    // IF we have an existing record, we should affect that value, however, if there is none, assume it is zero.
    let adjustedCount;
    try {
        let existingItemLoc = await prisma.stockItemBinLocationCount.findUnique({
            where: {
                binLocationId_stockItemId: {
                    binLocationId: aAdjustment.binLocation,
                    stockItemId: aAdjustment.stockItem
                }
            }
        });
        adjustedCount = existingItemLoc.stockItemCount + aAdjustment.adjustment;

    } catch (e) { // watch e for debug
        // we were not successful in finding a current record
        adjustedCount = aAdjustment.adjustment;
    }

    // prisma.upsert will Get or Create a Stock[Item]->[Loc]ation relationship table record
    return await prisma.stockItemBinLocationCount.upsert({

        // "Where" denotes the record we wish to find or create
        where: {
            binLocationId_stockItemId: {
                binLocationId: aAdjustment.binLocation,
                stockItemId: aAdjustment.stockItem
            }
        },

        // "Update" provides the detail to update an existing record if found
        update: {
            stockItemCount: adjustedCount
        },

        // "Create" provides the detail for a new record if one is not found
        create: {
            stockItemCount: adjustedCount,
            binLocation: {
                connect: {
                    id: aAdjustment.binLocation
                }
            },
            stockItem: {
                connect: {
                    id: aAdjustment.stockItem
                }
            }
        }
    });
}