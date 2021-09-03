const querystring = require("querystring");
const models = require("../models/pseudo.models");
const prismaException = require("../utils/prismaException");
const validation = require("../utils/validation");
const utilities = require("../utils/utils");
const prisma = require('../../client').prismaClient();

exports.postStockCountFromBody = async function(req, res) {
    try {
        const resItemLoc = await postCount(req.body);
        return res.status(201).json(resItemLoc);
    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockCountFromParams = async function (req, res) {
    try {
        let stockCount = {};
        models.buildStockAdjustment(utilities.prepareReqQuery(req.query), stockCount); // re-use for count
        if (!stockCount.stockItem) stockCount.stockItem = req.params.stockItem;

        const resItemLoc = await postCount(stockCount);
        return res.status(201).json(resItemLoc);
    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

postCount = async function(aCount) {

    aCount.stockItem = validation.validateID(aCount.stockItem);
    aCount.count = validation.validateID(aCount.count);
    aCount.binLocation = validation.validateID(aCount.binLocation);

    // prisma.upsert will Get or Create a Stock[Item]->[Loc]ation relationship table record
    return await prisma.stockItemBinLocationCount.upsert({

        // "Where" denotes the record we wish to find or create
        where: {
            binLocationId_stockItemId: {
                binLocationId: aCount.binLocation,
                stockItemId: aCount.stockItem
            }
        },

        // "Update" provides the detail to update an existing record if found
        update: {
            stockItemCount: aCount.count
        },

        // "Create" provides the detail for a new record if one is not found
        create: {
            stockItemCount: aCount.count,
            binLocation: {
                connect: {
                    id: aCount.binLocation
                }
            },
            stockItem: {
                connect: {
                    id: aCount.stockItem
                }
            }
        }
    });
}