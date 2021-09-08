// This is the controller for the warehouses endpoint of the REST API
// here we will implement the logic of CRUD functionality
// A similar file will be maintained for other endpoints

// Convenience module to interpret exceptions raised by the prisma client
// https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors/
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
const prismaException = require("../utils/prismaException");

// The databases are created in the scheme.prisma file which, unlike other ORMs, removes the option to
// maintain a "models" listing for an MVC framework. This file, pseudo.models, will allow us to make up
// for this lost functionality but means there are two files to maintain when the database is updated.
const models = require("../models/pseudo.models");

// For generating/interpreting URLs with Query Strings
const querystring = require("querystring");

// Connecting to the CACHED prisma client - refer to comments in client.js
// Not specifying aURL path as parameter for prismaClient as the controller
// should remain agnostic as to the source of the data.
const prisma = require('../../client').prismaClient();

// The module lists several exported functions with a similar signature; req (request) and res (result) parameters
// Each function will query the prisma client to Create Retrieve Update or Delete records from the warehouse table
// The specific query will be determined by the function requirements and the details from the req object received
// The function will then prepare the res object to be returned with appropriate information or error details.

// To implement the CRUD functionality we use the REST Verbs Get (retrieve), Post(create/update), Put(update/create),
// and Delete. Each function will be prefixed by the relevant verb for easy identification.
// Each function is post-fixed with the source it will use for parameters; fromParams vs fromBody. the former
// will use Path Parameters and Query Parameters, whilc the latter uses the Request Body.
exports.getWarehouseFromParams = async function (req, res) {

    // This function will retrieve records from the warehouse table using the PATH PARAMETER as part of the request
    // The warehouse.router will have determined the presence of the parameter, otherwise the request would have
    // been routed to the getWarehouseFromBody function below
    try {
        // Query the prisma client and await a result. First we access the warehouse table,
        // then run the findUnique() query against it. Each query takes a specific configuration
        // according to the Prisma API:
        // https://www.prisma.io/docs/concepts/components/prisma-client/crud
        const resWarehouse = await prisma.warehouse.findUnique({
            where: {
                id: req.params.id // validated/converted as number by Prisma Client middleware
            },
            include: {
                binLocations: true,
                users: true
            }
        });

        // send the result back through res
        return res.json(resWarehouse);

    } catch (e) {
        // The prisma client can encounter exceptions when attempting to parse our query
        // All controller functions will use the same unit, prismaException, to interpret
        // the exception and prepare a uniform response based on the error.
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.getWarehouseFromBody = async function (req, res) {
    try {
        // This query, findMany, allows us to query the table for matches against any field in the table
        // the include configuration property is part of the Prisma API and directs the client to return
        // scalar data fields used for references to related tables.
        // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries/
        const resWarehouses = await prisma.warehouse.findMany({
            where: req.body,
            include: {
                binLocations: true,
                users: true
            }
        });

        // This result will be an array of JSON objects
        // the presentation client will need to be aware of how to handle this in contrast to using the
        // same warehouse endpoint but with Path Parameters
        res.json(resWarehouses);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromParams = async function (req, res) {
    try {
        // Create a warehouse object and prepare it for creating a new resource
        let newWarehouse = {id: req.params.id};

        // the pseudo.models module allows us to easily populate a JSON object with properties
        // which are appropriate for this type (warehouse). We created it as a workaround to
        // provide MVC-like functionality, and it will be used throughout these controllers.
        // The querystring reaches the controller as the first element in an array due to
        // the Axios API requirements - so we first decode it into a JSON object for processing
        models.buildWarehouse(querystring.decode(req.query[0]), newWarehouse);

        const resWarehouse = await prisma.warehouse.create({
            data: newWarehouse
        });

        // We can use any return status we deem appropriate. The presentation client should be aware of
        // these return codes and, for example, Unit Tests can use them to confirm an appropriate action
        // has taken place.
        return res.status(201).json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.postWarehouseFromBody = async function(req, res) {

    // TODO: Offer bulk inserts createMany()?

    try {
        const resWarehouse = await prisma.warehouse.create({
            data: req.body
        });

        return res.status(201).json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromParams = async function (req, res) {
    try {
        console.log("put param");
        let updWarehouse = {id: req.params.id};
        models.buildWarehouse(querystring.decode(req.query[0]), updWarehouse);

        const resWarehouse = await prisma.warehouse.upsert({
            where: {
                id: updWarehouse.id // Unique match
            },
            update: updWarehouse,
            create: updWarehouse
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.putWarehouseFromBody = async function(req, res) {
    try {
        console.log(req.body);
        const resWarehouse = await prisma.warehouse.upsert({
            where: { // only unique fields
                id: req.body.id
            },
            update: req.body,
            create: req.body
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromParams = async function(req, res) {
    try {
        const resWarehouse = await prisma.warehouse.delete({
            where: {
                id: req.params.id // Unique match
            }
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};

exports.deleteWarehouseFromBody = async function(req, res) {
    try {
        const resWarehouse = await prisma.warehouse.deleteMany({
            where: req.body
        });

        return res.json(resWarehouse);

    } catch (e) {
        return res.status(prismaException.httpStatus(e))
            .json(prismaException.generateReturnJSON(e));
    }
};
