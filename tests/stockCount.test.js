// The Endpoint for testing
const axios = require("axios");
const assert = require("assert");
const querystring = require("querystring");

const utilities = require("../app/utils/utils");
const testUtilities = require("./utils/test.utils");

const dummyWarehouses = require("./dummy/warehouse.dummy").warehouses;
const dummyBinLocations = require("./dummy/binLocation.dummy").binLocations;
const dummyStockItems = require("./dummy/stockItem.dummy").stockItems;

const prisma = require('../client').prismaClient({
    caller: "stockCount.test.js",
    db: {
        url: process.env.DATABASE_URL
    }
});
require('../'); // Start the API server

const testEndpoint = 'http://localhost:' + process.env.PORT + '/api/stockcount/';

describe('API Test Endpoint: ./api/stockcount/', function() {

    beforeEach(async () => {
        // Seed test records in the database

        // Delete existing records
        await testUtilities.cleanTables(prisma);

        // Prepare items to create
        let seedWarehouse = utilities.cloneJSON(dummyWarehouses[0]); // 'LYIT'
        let seedBinLocation = utilities.cloneJSON(dummyBinLocations[0]); // 'BinLocation WH001.A'
        let seedStockItem = utilities.cloneJSON(dummyStockItems[0]); // 'NVIDIA'
        seedBinLocation.warehouse = { create : seedWarehouse};

        seedStockItem.stockItemCounts = {
            create: { // create the relationship table instance
                binLocation: {
                    create: seedBinLocation
                },
                stockItemCount: 0 // required for the rel table
            }
        };

        await prisma.stockItem.create({
            data: seedStockItem
        });

    });

    describe('Initial Database', function () {

        it('beforeEach() has added seed records', async function () {

            const existingStockItems = await prisma.stockItem.findMany({});
            const existingBinLocations = await prisma.binLocation.findMany({});
            const existingWarehouses = await prisma.warehouse.findMany({});

            assert.equal(existingStockItems[0].description, dummyStockItems[0].description);
            assert.equal(existingBinLocations[0].description, dummyBinLocations[0].description);
            assert.equal(existingWarehouses[0].description, dummyWarehouses[0].description);

        });

        it('beforeEach() had removed all records before having added those new records', async function () {
            // Repeat the same test; thus ensuring that the two entities simply been added twice

            const existingStockItems = await prisma.stockItem.findMany({});
            const existingBinLocations = await prisma.binLocation.findMany({});
            const existingWarehouses = await prisma.warehouse.findMany({});

            assert.equal(existingStockItems[0].description, dummyStockItems[0].description);
            assert.equal(existingBinLocations[0].description, dummyBinLocations[0].description);
            assert.equal(existingWarehouses[0].description, dummyWarehouses[0].description);

        });

    }); // 'Initial Database'

    describe('Using REQUEST BODY', function() {

        describe('POST', function () {

            it('Set stock count where relationship exists', async function () {

                const existingBinLocationID = (await prisma.binLocation.findMany({}))[0].id; // 'BinLocation WH001.A'
                const existingStockItemID = (await prisma.stockItem.findMany({}))[0].id; // 'NVIDIA'
                const newCount = 99;

                const postStockItemCount = (await axios.post(testEndpoint, {
                    stockItem: existingStockItemID,
                    binLocation: existingBinLocationID,
                    count: newCount
                })).data;

                assert.equal(postStockItemCount.stockItemCount, newCount);
            });

            it('404 Error when records do not exist', async function () {

                const newBinLocationID = await testUtilities.getUniqueID(prisma.binLocation);
                const newStockItemID = await testUtilities.getUniqueID(prisma.stockItem);
                const newCount = 123;

                await testUtilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, {
                        stockItem: newStockItemID,
                        binLocation: newBinLocationID,
                        count: newCount
                    })
                }, /status code 404/); // Not found

            });

            it('Set stock count where relationship does not exist but records do', async function () {

                // Prepare items to create
                let seedBinLocation = utilities.cloneJSON(dummyBinLocations[1]); // 'BinLocation WH002.A'
                let seedStockItem = utilities.cloneJSON(dummyStockItems[1]); // 'NVIDIA'
                const existingWarehouse = (await prisma.warehouse.findMany({}))[0]; // 'LYIT'
                seedBinLocation.warehouse = { connect : { id: existingWarehouse.id } };

                // create new binlocation and stockitem
                const newBinLocation = await prisma.binLocation.create({
                    data: seedBinLocation
                });
                const newStockItem = await prisma.stockItem.create({
                    data: seedStockItem
                });

                const newCount = 456;

                // Create a stock count for a StockItem against a BinLocation it was not recorded in before
                const postStockItemCount = (await axios.post(testEndpoint, {
                    stockItem: newStockItem.id,
                    binLocation: newBinLocation.id,
                    count: newCount
                })).data;

                assert.equal(postStockItemCount.stockItemCount, newCount);
            });

        }); // 'POST'

    }); // 'Using REQUEST BODY'

    describe('Using PATH PARAMETER and QUERY STRING', function() {

        describe('POST', function () {

            it('Set stock count where relationship exists', async function () {

                const existingBinLocationID = (await prisma.binLocation.findMany({}))[0].id; // 'BinLocation WH001.A'
                const existingStockItemID = (await prisma.stockItem.findMany({}))[0].id; // 'NVIDIA'
                const newCount = 99;

                const postCount = {
                    binLocation: existingBinLocationID,
                    count: newCount
                };

                const postedStockItemCount = (await axios.post(testEndpoint + existingStockItemID,{}, {
                    params: querystring.stringify(postCount)
                })).data;

                assert.equal(postedStockItemCount.stockItemCount, newCount);
            });

            it('404 Error when records do not exist', async function () {

                const newBinLocationID = await testUtilities.getUniqueID(prisma.binLocation);
                const newStockItemID = await testUtilities.getUniqueID(prisma.stockItem);
                const newCount = 123;

                const postCount = {
                    binLocation: newBinLocationID,
                    count: newCount
                };

                await testUtilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint + newStockItemID,{}, {
                        params: querystring.stringify(postCount)
                    });
                }, /status code 404/); // Not found

            });

            it('Set stock count where relationship does not exist but records do', async function () {

                // Prepare items to create
                let seedBinLocation = utilities.cloneJSON(dummyBinLocations[1]); // 'BinLocation WH002.A'
                let seedStockItem = utilities.cloneJSON(dummyStockItems[1]); // 'NVIDIA'
                const existingWarehouse = (await prisma.warehouse.findMany({}))[0]; // 'LYIT'
                seedBinLocation.warehouse = { connect : { id: existingWarehouse.id } };

                // create new binlocation and stockitem
                const newBinLocation = await prisma.binLocation.create({
                    data: seedBinLocation
                });
                const newStockItem = await prisma.stockItem.create({
                    data: seedStockItem
                });

                const newCount = 456;

                const postCount = {
                    binLocation: newBinLocation.id,
                    count: newCount
                };

                const postedStockItemCount = (await axios.post(testEndpoint + newStockItem.id,{}, {
                    params: querystring.stringify(postCount)
                })).data;

                assert.equal(postedStockItemCount.stockItemCount, newCount);
            });

        }); // 'POST'

    }); // 'Using PATH PARAMETER and QUERY STRING'

}); // 'API Test Endpoint: ./api/stockcount/'