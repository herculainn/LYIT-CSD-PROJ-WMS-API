const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    rejectOnNotFound: true
});

const utilities = require("../utils/validation");
const prismaException = require("../utils/prismaException");
const models = require("../models/pseudo.models");

exports.getWarehouseFromParams = async function (req, res) {
    try {
        let tmpId = utilities.validateID(req.params.id);
        const resWarehouse = await prisma.warehouse.findUnique({
            where: {
                id: tmpId
            },
            include: {
                binLocations: true,
                users: true
            }
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getWarehouseFromBody = async function (req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);
        const resWarehouses = await prisma.warehouse.findMany({
            where: req.body,
            include: {
                binLocations: true,
                users: true
            }
        });

        res.json(resWarehouses);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromParams = async function (req, res) {
    try {
        let newWarehouse = {};
        if (req.params.id) newWarehouse.id = utilities.validateID(req.params.id);
        models.buildWarehouse(req.query, newWarehouse);

        const resWarehouse = await prisma.warehouse.create({
            data: newWarehouse
        });

        return res.status(201).json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromBody = async function(req, res) {
    // TODO: Bulk inserts
    try {
        // Validate ID if being used for create()
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resWarehouse = await prisma.warehouse.create({
            data: req.body
        });

        return res.status(201).json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromParams = async function (req, res) {
    try {
        let updWarehouse = {};
        if (req.params.id) updWarehouse.id = utilities.validateID(req.params.id);
        models.buildWarehouse(req.query, updWarehouse);

        const resWarehouse = await prisma.warehouse.upsert({
            where: {
                id: updWarehouse.id // Unique match
            },
            update: updWarehouse,
            create: updWarehouse
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromBody = async function(req, res) {
    try {
        req.body.id = utilities.validateID(req.body.id);

        const resWarehouse = await prisma.warehouse.upsert({
            where: { // only unique fields
                id: req.body.id
            },
            update: req.body,
            create: req.body
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromParams = async function(req, res) {
    try {
        let tmpId = utilities.validateID(req.params.id);

        const resWarehouse = await prisma.warehouse.delete({
            where: {
                id: tmpId // Unique match
            }
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromBody = async function(req, res) {
    try {
        if (req.body.id) req.body.id = utilities.validateID(req.body.id);

        const resWarehouse = await prisma.warehouse.deleteMany({
            where: req.body
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
