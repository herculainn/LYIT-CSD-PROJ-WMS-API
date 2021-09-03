const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    rejectOnNotFound: true
});

const utilities = require("../utils/validation");
const prismaException = require("../utils/prismaException");
const models = require("../models/pseudo.models");

exports.getStockItemFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getStockItemFromBody = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockItemFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockItemFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putStockItemFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putStockItemFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteStockItemFromParams = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteStockItemFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
