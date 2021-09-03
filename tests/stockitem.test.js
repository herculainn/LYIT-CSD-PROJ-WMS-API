const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client
const querystring = require("querystring"); // For generating/interpreting URLs

// Our own global functions that will be of use to all test units
const testUtilities = require("./utils/test.utils");
const utilities = require("../app/utils/utils");

// A list of prebuilt warehouses and binLocations in JSON for use during testing
const dummyStockItems = require('./dummy/stockItem.dummy').stockItems;
const dummyBinLocations = require('./dummy/binLocation.dummy').binLocations;
const dummyWarehouses = require('./dummy/warehouse.dummy').warehouses;

// Get the Prisma Client
const prisma = require('../client').prismaClient({
    caller: "stockItem.test.js",
    db: {
        url: process.env.DATABASE_URL
    }
});

require('../'); // Start the API server

// The Endpoint for testing
const testEndpoint = 'http://localhost:' + process.env.PORT + '/api/stockitems/';

describe('API Test Endpoint: ./api/stockitems/', function() {

    beforeEach(async () => {
        // Seed test records in the database

        // Delete existing records
        await testUtilities.cleanTables(prisma);

        // Create items
        let seedStockItems = [
            utilities.cloneJSON(dummyStockItems[0]), // 'NVIDIA'
            utilities.cloneJSON(dummyStockItems[1])  // Carrying the Fire
        ];

        await prisma.stockItem.createMany({
            data: seedStockItems
        });

    });

    describe('Initial Database', function() {

        it('beforeEach() has added records to stockItems table', async function() {

            // Confirm expected records have been created
            const existingStockItems = await prisma.stockItem.findMany({});

            // Assert that only expected number of items exist
            assert.equal(existingStockItems.length, 2);

        });

        it('beforeEach() had removed all records before having added those new records', async function() {
            // Repeat the same test; thus ensuring that the two entities simply been added twice
            const existingStockItems = await prisma.stockItem.findMany({});
            assert.equal(existingStockItems.length, 2);
        });

    }); // 'Initial Database'

    describe('Using REQUEST BODY', function() {

        describe('POST', function() {

            it('Create a new StockItem', async function () {
                const preExistingStockItemCount = (await prisma.stockItem.findMany({})).length;
                await axios.post(testEndpoint, dummyStockItems[2]); // Last Man On The Moon

                const postExistingStockItemCount = (await prisma.stockItem.findMany({})).length;
                assert.equal(preExistingStockItemCount, postExistingStockItemCount - 1);
            });

            it('Cannot overwrite existing stockItem', async function () {
                const existingStockItem = (await prisma.stockItem.findMany({}))[0];
                let postStockItem = utilities.cloneJSON(dummyStockItems[2]); // Last Man On The Moon
                postStockItem.id = existingStockItem.id;

                await testUtilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, postStockItem); // "Unique constraint failed on the {constraint}"
                }, /status code 400/); // 'Bad Request'
            });


            // Stock Items don't have a direct connection to Bin Location
            // There is a many-to-many relationship - we need to create that association..

            it('Create and connect to existing bin location', async function () {
                let existingItemLocCount = (await prisma.stockItemBinLocationCount.findMany({})).length;

                // Create a warehouse directly using prisma client
                let newWarehouse = utilities.cloneJSON(dummyWarehouses[0]);
                let existingWarehouse = await prisma.warehouse.create({
                    data: newWarehouse
                }); // 'LYIT'

                // Create a binlocation directly using prisma client
                let newBinLocation = utilities.cloneJSON(dummyBinLocations[0]); // 'BinLocation WH001.A'
                newBinLocation.warehouse = {
                    connect: {
                        id: existingWarehouse.id
                    }
                };
                let existingBinLocation = await prisma.binLocation.create({ data: newBinLocation});

                // Finally create the stockitem using AXIOS to test the application
                let newStockItem = utilities.cloneJSON(dummyStockItems[2]); // Last Man On The Moon
                newStockItem.stockItemCounts = {
                    create: { // create the relationship table instance
                        binLocation: {
                            connect: { // link to the binLocation
                                id: existingBinLocation.id
                            }
                        },
                        stockItemCount: 0 // required for the rel table
                    }
                }
                //let existingStockItem = await prisma.stockItem.create({ data: newStockItem});
                await axios.post(testEndpoint, newStockItem);

                let updatedItemLocCount = (await prisma.stockItemBinLocationCount.findMany({})).length;
                assert.equal(updatedItemLocCount, existingItemLocCount + 1);
            });


        }); // 'POST'

        describe('PUT', function() {

            it('Updates existing StockItem', async function () {
                const existingStockItemId = (await prisma.stockItem.findMany({}))[0].id; // 'NVIDIA'
                let putStockItem = utilities.cloneJSON(dummyStockItems[2]); // Last Man On The Moon
                putStockItem.id = existingStockItemId;

                const resStockItem = (await axios.put(testEndpoint, putStockItem)).data;
                assert.equal(resStockItem.description, putStockItem.description);
            });

            it('Creates new StockItem if new id is used', async function () {
                const newID = await testUtilities.getUniqueID(prisma.stockItem);

                let putStockItem = utilities.cloneJSON(dummyStockItems[2]); // Last Man On The Moon
                putStockItem.id = newID;

                await axios.put(testEndpoint, putStockItem);
            });

            it('Error if no ID is provided', async function () {
                await testUtilities.assertThrowsAsync(async () => {
                    await axios.put(testEndpoint, dummyStockItems[2]); // Last Man On The Moon
                }, /status code 400/);
            });

        }); // 'PUT'

        describe('GET', function() {

            it('No parameters returns array of all stockItems', async function() {
                const existingStockItems = await prisma.stockItem.findMany({});
                const resStockItems = (await axios.get(testEndpoint)).data;
                assert.equal(resStockItems.length, existingStockItems.length);
            });

            it('ID as a string is automatically converted', async function() {
                const existingStockItem = (await prisma.stockItem.findMany({}))[0];
                const existingStockItemID = existingStockItem.id;
                const resStockItem = (await axios.get(testEndpoint, {
                    data: {
                        id: existingStockItemID.toString()
                    }
                })).data;
                assert.equal(resStockItem.length, 1);
                assert.equal(resStockItem[0].description, existingStockItem.description);
            });

        }); // 'GET'

        describe('DELETE', function() {

            it('Deletes by given Id', async function() {
                const existingStockItems = await prisma.stockItem.findMany({});

                const deleteCount = (await axios.delete(testEndpoint, {
                    data: {
                        id: existingStockItems[1].id
                    }
                })).data.count;

                const remainingStockItems = await prisma.stockItem.findMany({});

                // Prisma delete will return the count of delete records only
                assert.equal(existingStockItems.length, remainingStockItems.length + deleteCount);
            });

            // TODO: What happens to relationships after delete?

        }); // 'DELETE'


    }); // 'Using REQUEST BODY'

    describe('Using PATH PARAMETER and QUERY STRING', function() {

        // TODO: implement some tests against Path Parameters and Query Strings

    }); // 'Using PATH PARAMETER and QUERY STRING'

}); // 'API Test Endpoint: ./api/stockitems/'

