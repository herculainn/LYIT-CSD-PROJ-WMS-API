const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client

const testEntities = require("./utils/test.entities");
const utilities = require('./utils/test.utils');

require('../'); // Start the API server

// TODO: Change database to TEST database??

describe('API Test Endpoint: ./api/stockitems/', function() {

    let testEndpoint = 'http://localhost:24326/api/stockitems/';
    let testStockItem = JSON.parse(JSON.stringify(testEntities.stockItem.json));
    let testPutStockItem;

    beforeEach(() => {

        // TODO: Before each test should we prepare the database?

        // Wipe database
        // Populate with some prebuild data?

    });

    describe('Using Body Data', function() {

        describe('Initial Testing', function() {
            it('There should be no existing stockItem', async function () {
                const response = await axios.get(testEndpoint);
                console.log(response.data);

                assert.equal(response.data.length, 0);
            });
        }); // 'Initial Testing'

        describe('POST', function() {

            it('Create a new StockItem', async function () {
                const response = await axios.post(testEndpoint, testStockItem);
                console.log(response.data);

                assert.equal(response.data.description, testStockItem.description);

                // Update test instance with new IDs for later
                // TODO: This undermines UNIT test?
                testStockItem = response.data;
            });

            it('Cannot overwrite existing stockItem', async function () {
                await utilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, {
                        id: testStockItem.id, // ID from previous
                        ean: testEntities.stockItem.correctEan
                    });
                }, /status code 500/);
            });

        }); // 'POST'

        describe('PUT', function() {

            it('Updates existing StockItem', async function () {
                testPutStockItem = JSON.parse(JSON.stringify(testStockItem));
                testPutStockItem.description = testEntities.stockItem.correctDescription;

                const response = await axios.put(testEndpoint, testPutStockItem);
                console.log(response.data);

                assert.equal(response.data.description, testEntities.stockItem.correctDescription);
            });

            it('Creates new StockItem if new id is used', async function () {
                testPutStockItem.id = testPutStockItem.id + 1;
                testPutStockItem.ean = testEntities.stockItem.correctEan;
                testPutStockItem.upc = testEntities.stockItem.correctUpc;

                const response = await axios.put(testEndpoint, testPutStockItem);
                console.log(response.data);

                assert.equal(response.data.id, testStockItem.id + 1);
                assert.equal(response.data.ean, testEntities.stockItem.correctEan);
                assert.equal(response.data.upc, testEntities.stockItem.correctUpc);
            });

            it('Error if no ID is provided', async function () {
                delete testPutStockItem.id;

                await utilities.assertThrowsAsync(async () => {
                    await axios.put(testEndpoint, testPutStockItem);
                }, /status code 500/);
            });

        }); // 'PUT'

        describe('GET', function() {

            it('No parameters returns array of all warehouses', async function() {
                const response = await axios.get(testEndpoint);
                console.log(response.data);

                if (response.data.length > 0) {
                    assert.equal(
                        response.data
                            .find(stockItem => stockItem.id === testStockItem.id)
                            .description,
                        testPutStockItem.description);

                } else {
                    // Database not configured for testing - fail the test to correct this
                    assert.fail("No stockItem records available for testing!");
                }
            });

            it('PATH PARAMETER returns StockItem by ID', async function() {
                const response = await axios.get(testEndpoint + testStockItem.id);
                console.log(response.data);

                assert.equal(response.data.id, testStockItem.id);
            });

            it('PATH PARAMETER returns error if ID not valid', async function() {
                await utilities.assertThrowsAsync(async () => {
                    await axios.get(testEndpoint + testEntities.stockItem.errorID);
                }, /status code 404/);
            });

            it('REQUEST BODY returns single StockItem matching unique terms', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        id: testStockItem.id
                    }
                });
                console.log(response.data);

                assert.equal(response.data.length, 1);
            });

            it('REQUEST BODY returns multiple StockItem matching non-unique terms', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        shelf: testEntities.stockItem.correctShelf
                    }
                });
                console.log(response.data);

                assert.equal(response.data.length, 2); // 2 - from POST and PUT tests
            });

            it('REQUEST BODY returns empty array if request body data has no matches', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        description: testEntities.stockItem.errorDescription
                    }
                });
                console.log(response.data);

                assert.equal(response.data.length, 0);
            });

        }); // 'GET'

        describe('DELETE', function() {

            it('Deletes multiple records', async function() {
                const response = await axios.delete(testEndpoint, {
                    data: {
                        description: testEntities.stockItem.correctDescription
                    }
                });
                console.log(response.data);

                // Prisma delete will return the count of delete records only
                assert.equal(response.data.count, 2);
            });

        }); // 'DELETE'


    }); // 'Using Body Parameters'

}); // 'API Test Endpoint: ./api/stockitems/'

