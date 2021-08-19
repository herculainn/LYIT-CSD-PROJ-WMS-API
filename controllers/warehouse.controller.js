const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    rejectOnNotFound: true
});

const utilities = require("../utils/validation");
const prismaException = require("../utils/prismaException");
const models = require("../models/pseudo.models");

exports.getWarehouseFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.getWarehouseFromBody = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromParams = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};
