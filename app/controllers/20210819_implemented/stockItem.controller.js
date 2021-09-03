const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    rejectOnNotFound: true
});

const utilities = require("../utils/validation");
const prismaException = require("../utils/prismaException");
const models = require("../models/pseudo.models");

exports.getStockItemFromParams = async function (req, res) {
    try {
        let tmpId = utilities.validateID(req.params.id);

        const resStockItem = await prisma.stockItem.findUnique({
            where: {
                id: tmpId
            },
            include: {
                stockItemCounts: true
            }
        });

        return res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getStockItemFromBody = async function (req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resStockItem = await prisma.stockItem.findMany({
            where: req.body,
            include: {
                stockItemCounts: true
            }
        });

        res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockItemFromParams = async function (req, res) {
    try {
        let newStockItem = {};
        if (req.params.id) newStockItem.id = utilities.validateID(req.params.id);
        models.buildStockItem(req.query, newStockItem);

        const resStockItem = await prisma.stockItem.create({
            data: newStockItem
        });

        return res.status(201).json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockItemFromBody = async function(req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resStockItem = await prisma.stockItem.create({
            data: req.body
        });

        return res.status(201).json(resStockItem); // 'Created'
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putStockItemFromParams = async function (req, res) {
    try {
        let updStockItem = {};
        if (req.params.id) updStockItem.id = utilities.validateID(req.params.id);
        models.buildStockItem(req.query, updStockItem);

        const resStockItem = await prisma.stockItem.upsert({
            where: {
                id: updStockItem.id // Unique match
            },
            update: updStockItem,
            create: updStockItem
        });

        return res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putStockItemFromBody = async function(req, res) {
    try {
        req.body.id = utilities.validateID(req.body.id);

        const resStockItem = await prisma.stockItem.upsert({
            where: { // only unique fields
                id: req.body.id
            },
            update: req.body,
            create: req.body
        });

        return res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteStockItemFromParams = async function(req, res) {
    try {
        let tmpId = utilities.validateID(req.params.id);

        const resStockItem = await prisma.stockItem.delete({
            where: {
                id: tmpId // Unique match
            }
        });

        return res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteStockItemFromBody = async function(req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resStockItem = await prisma.stockItem.deleteMany({
            where: req.body
        });

        return res.json(resStockItem);
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
