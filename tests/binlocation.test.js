const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client
const querystring = require("querystring"); // For generating/interpreting URLs

// Our own global functions that will be of use to all test units
const testUtilities = require("./utils/test.utils");
const utilities = require("../app/utils/utils");

// A list of prebuilt warehouses and binLocations in JSON for use during testing
const dummyBinLocations = require('./dummy/binLocation.dummy').binLocations;
const dummyWarehouses = require('./dummy/warehouse.dummy').warehouses;

// Get the Prisma Client
const prisma = require('../client').prismaClient({
    caller: "binLocation.test.js",
    db: {
        url: process.env.DATABASE_URL
    }
});

// Get and start the REST API server!
require('../');

// The Endpoint for testing
const testEndpoint = 'http://localhost:' + process.env.PORT + '/api/binLocations/';

// Begin testing!
describe('API Test Endpoint: ./api/binlocations/', function() {

    beforeEach(async () => {
        // Seed test records in the database
        // This will use two methods for creating new records with required relations
        // prisma client's 'create' and 'connect'

        // Delete existing records
        await testUtilities.cleanTables(prisma);

        // Create a bin location using Prisma CREATE
        // Build a binLocation and give it a warehouse (required)
        let seedBinLocation = utilities.cloneJSON(dummyBinLocations[0]); // 'BinLocation WH001.A'
        seedBinLocation.warehouse = {
            create: utilities.cloneJSON(dummyWarehouses[0]) // 'LYIT'
        };
        // CREATE record for new binloc and new warehouse
        await prisma.binLocation.create({
            data: seedBinLocation // 'BinLocation WH001.A' in 'LYIT'
        });

        // Create a bin location using Prisma CONNECT
        // Prepare a second location
        let secondSeedBinLocation = utilities.cloneJSON(dummyBinLocations[0]); // 'BinLocation WH002.A'
        // create a warehouse alone
        let secondSeedWarehouse = await prisma.warehouse.create({
            data: utilities.cloneJSON(dummyWarehouses[1]) // 'AMAZON DE'
        });
        // CONNECT the location id to the binLoc we will create
        secondSeedBinLocation.warehouse = { connect: {
            id: secondSeedWarehouse.id
        }};
        // Create the second binLocation
        await prisma.binLocation.create({
            data: secondSeedBinLocation // 'BinLocation WH002.A' in 'AMAZON DE'
        });

    });

    describe('Initial Database', function() {

        it('beforeEach() has added records to binLocations table', async function() {

            // Confirm expected records have been created
            const existingBinLocations = await prisma.binLocation.findMany({});
            const existingWarehouses = await prisma.warehouse.findMany({});

            // Assert that only expected number of items exist
            assert.equal(existingBinLocations.length, 2);
            assert.equal(existingWarehouses.length, 2);

        });

        it('beforeEach() had removed all records before having added those new records', async function() {
            // Repeat the same test; thus ensuring that the two entities simply been added twice

            // Confirm expected records have been created
            const existingBinLocations = await prisma.binLocation.findMany({});
            const existingWarehouses = await prisma.warehouse.findMany({});

            // Assert that only expected number of items exist
            assert.equal(existingBinLocations.length, 2);
            assert.equal(existingWarehouses.length, 2);

        });

    }); // 'Initial Database'

    describe('Using REQUEST BODY', function() {

        describe('POST', function() {

            it('Cannot create without a Warehouse', async function () {

                // Prepare a binLocation (which hasn't been used) with an ID that already exists
                let postBinLocation = utilities.cloneJSON(dummyBinLocations[2]); // 'BinLocation WH002.B'

                // Assert that this will throw an error ("status code 500")
                await testUtilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, postBinLocation);
                }, /status code 400/); // 'Bad Request

            });

            it('Can CREATE with a NEW Warehouse', async function () {

                // Prepare a binLocation
                let postBinLocation = utilities.cloneJSON(dummyBinLocations[2]); // 'BinLocation WH002.B'
                postBinLocation.warehouse = {
                    create: utilities.cloneJSON(dummyWarehouses[1]) // // 'AMAZON DE'
                };

                const resBinLocation = (await axios.post(testEndpoint, postBinLocation)).data;
                const newWarehouse = await prisma.warehouse.findUnique({
                    where: { id: resBinLocation.warehouseId }
                });
                assert.equal(resBinLocation.description, postBinLocation.description);
                assert.equal(newWarehouse.description, postBinLocation.warehouse.create.description);

            });

            it('Can CREATE and CONNECT with an EXISTING Warehouse', async function () {

                const existingWarehouses = await prisma.warehouse.findMany({});

                // Prepare a binLocation
                let postBinLocation = utilities.cloneJSON(dummyBinLocations[2]); // 'BinLocation WH002.B'
                postBinLocation.warehouse = {
                    connect: {
                        id: existingWarehouses[1].id
                    } // 'Amazon UK'
                };

                const resBinLocation = (await axios.post(testEndpoint, postBinLocation)).data;

                assert.equal(resBinLocation.description, postBinLocation.description);
                assert.equal(resBinLocation.warehouseId, existingWarehouses[1].id);

            });

        }); // 'POST'

        describe('PUT', function() {

            it('Updates existing BinLocation', async function () {
                const existingBinLocationId = (await prisma.binLocation.findMany({}))[0].id;
                let putBinLocation = utilities.cloneJSON(dummyBinLocations[2]); // 'BinLocation WH002.B'
                putBinLocation.id = existingBinLocationId;

                const resBinLocation = (await axios.put(testEndpoint, putBinLocation)).data;

                assert.equal(resBinLocation.description, putBinLocation.description);
            });

            it('Requires a Warehouse to create a new BinLocation', async function () {
                // Get a new ID for a new record
                const newID = await testUtilities.getUniqueID(prisma.binLocation);

                let putBinLocation = utilities.cloneJSON(dummyBinLocations[2]);
                putBinLocation.id = newID;

                await testUtilities.assertThrowsAsync(async () => {
                    await axios.put(testEndpoint, putBinLocation);
                }, /status code 400/);
            });

            it('Creates a new BinLocation when Warehouse is provided', async function () {
                // Get a new ID for a new record
                const newID = await testUtilities.getUniqueID(prisma.binLocation);

                let putBinLocation = utilities.cloneJSON(dummyBinLocations[2]);
                putBinLocation.id = newID;

                const existingWarehouses = await prisma.warehouse.findMany({});
                putBinLocation.warehouse = {
                    connect: {
                        id: existingWarehouses[1].id
                    }
                };

                const resBinLocation = (await axios.put(testEndpoint, putBinLocation)).data;

                assert.equal(resBinLocation.id, putBinLocation.id);
            });

        }); // 'PUT'

        describe('GET', function() {

            it('No parameters returns array of all binLocations', async function() {
                const existingBinLocations = await prisma.binLocation.findMany({});
                const resBinLocations = (await axios.get(testEndpoint)).data;
                assert.equal(existingBinLocations.length, resBinLocations.length);
            });

            it('ID as a string is automatically converted', async function() {
                const existingBinLocation = (await prisma.binLocation.findMany({}))[0];
                const existingBinLocationID = existingBinLocation.id;
                const resBinLocation = (await axios.get(testEndpoint, {
                    data: {
                        id: existingBinLocationID.toString()
                    }
                })).data;
                assert.equal(resBinLocation.length, 1);
                assert.equal(resBinLocation[0].description, existingBinLocation.description);
            });

        }); // 'GET'

        describe('DELETE', function() {

            it('Deletes by given Id', async function() {
                const existingBinLocations = await prisma.binLocation.findMany({});

                const deleteCount = (await axios.delete(testEndpoint, {
                    data: {
                        id: existingBinLocations[1].id
                    }
                })).data.count;

                const remainingBinLocations = await prisma.binLocation.findMany({});

                assert.equal(existingBinLocations.length,
                    remainingBinLocations.length + deleteCount);
            });

            it('Warehouses persist after deleting binLocation', async function() {
                const existingWarehouseCount = (await prisma.warehouse.findMany({})).length;
                const existingBinLocations = await prisma.binLocation.findMany({});

                await axios.delete(testEndpoint, {
                    data: {
                        id: existingBinLocations[1].id
                    }
                });

                const remainingWarehouseCount = (await prisma.warehouse.findMany({})).length;

                assert.equal(existingWarehouseCount, remainingWarehouseCount);

            });

        }); // 'DELETE'

    }); // 'Using REQUEST BODY'

    describe('Using PATH PARAMETER and QUERY STRING', function() {

        // TODO: implement some tests against Path Parameters and Query Strings

    }); // 'Using PATH PARAMETER and QUERY STRING'

}); // 'API Test Endpoint: ./api/binlocations/'

