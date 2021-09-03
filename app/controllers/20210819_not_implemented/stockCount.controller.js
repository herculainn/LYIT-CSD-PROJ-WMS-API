const querystring = require("querystring");
const models = require("../models/pseudo.models");
const prismaException = require("../utils/prismaException");
const validation = require("../utils/validation");
const utilities = require("../utils/utils");
const prisma = require('../../client').prismaClient();

exports.postStockCountFromBody = async function(req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};

exports.postStockCountFromParams = async function (req, res) {
    try {
        return res.status(501).json(
            {message: 'not implemented'}
        );
    } catch (e) {
        return res.status(prismaException.httpStatus(e)).json(prismaException.generateReturnJSON(e));
    }
};