const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client

const testEntities = require("./utils/test.entities");
const utilities = require('./utils/test.utils');

require('../'); // Start the API server

// TODO: Change database to TEST database??

describe('API Test Endpoint: ./api/binlocations/', function() {

    let testEndpoint = 'http://localhost:24326/api/binlocations/';
    let testBinLocation = JSON.parse(JSON.stringify(testEntities.binLocation.json));
    let testPutBinLocation;

    beforeEach(() => {

        // TODO: Before each test should we prepare the database?

        // Wipe database
        // Populate with some prebuild data?

    });

    describe('Using Body Data', function() {

        describe('Initial Testing', function() {
            it('There should be no existing binLocations', async function () {
                const response = await axios.get(testEndpoint);
                console.log(response.data);

                assert.equal(response.data.length, 0);
            });
        }); // 'Initial Testing'

        describe('POST', function() {

            it('Create a new binLocation requires warehouse', async function () {
                await utilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, testBinLocation);
                }, /status code 400/);
            });

            it('Create a new BinLocation', async function () {
                // Add the warehouse testEntity to the binlocation clone
                testBinLocation.warehouse = { create: testEntities.warehouse.json};

                const response = await axios.post(testEndpoint, testBinLocation);
                console.log(response.data);

                assert.equal(response.data.description, testBinLocation.description);

                // Update test instance with new IDs for later
                // TODO: This undermines UNIT test?
                testBinLocation = response.data;
            });

            it('... created a new warehouse', async function () {
                // TODO: Structure not great for unit test?
                const response = await axios.get('http://localhost:24326/api/warehouses/' + testBinLocation.warehouseId);
                console.log(response.data);

                assert.equal(response.data.description, testEntities.warehouse.json.description);
            });

            it('Cannot overwrite existing binLocation', async function () {
                await utilities.assertThrowsAsync(async () => {
                    await axios.post(testEndpoint, {
                        id: testBinLocation.id, // ID from previous
                        shelf: testEntities.binLocation.correctShelf
                    });
                }, /status code 400/);
            });

        }); // 'POST'

        describe('PUT', function() {

            it('Updates existing BinLocation', async function () {
                testPutBinLocation = JSON.parse(JSON.stringify(testBinLocation));
                testPutBinLocation.shelf = testEntities.binLocation.correctShelf;

                const response = await axios.put(testEndpoint, testPutBinLocation);
                console.log(response.data);

                assert.equal(response.data.shelf, testEntities.binLocation.correctShelf);
            });

            it('Creates new BinLocation if new id is used', async function () {
                testPutBinLocation.id = testPutBinLocation.id + 1;
                testPutBinLocation.description = testEntities.binLocation.correctDescription

                const response = await axios.put(testEndpoint, testPutBinLocation);
                console.log(response.data);

                assert.equal(response.data.id, testBinLocation.id + 1);
                assert.equal(response.data.description, testEntities.binLocation.correctDescription);
            });

            it('Error if no ID is provided', async function () {
                delete testPutBinLocation.id;

                await utilities.assertThrowsAsync(async () => {
                    await axios.put(testEndpoint, testPutBinLocation);
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
                            .find(binLocation => binLocation.id === testBinLocation.id)
                            .description,
                        testBinLocation.description);

                } else {
                    // Database not configured for testing - fail the test to correct this
                    assert.fail("No binLocation records available for testing!");
                }
            });

            it('PATH PARAMETER returns BinLocation by ID', async function() {
                const response = await axios.get(testEndpoint + testBinLocation.id);
                console.log(response.data);

                assert.equal(response.data.id, testBinLocation.id);
                assert.equal(response.data.description, testBinLocation.description);
            });

            it('PATH PARAMETER returns a 404 if ID not valid', async function() {
                await utilities.assertThrowsAsync(async () => {
                    await axios.get(testEndpoint + testEntities.binLocation.errorID);
                }, /status code 404/);
            });

            it('REQUEST BODY returns single BinLocation matching unique terms', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        id: testBinLocation.id
                    }
                });
                console.log(response.data);

                assert.equal(response.data.length, 1);
            });

            it('REQUEST BODY returns multiple BinLocation matching non-unique terms', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        shelf: testEntities.binLocation.correctShelf
                    }
                });
                console.log(response.data);

                assert.equal(response.data.length, 2); // 2 - from POST and PUT tests
            });

            it('REQUEST BODY returns empty array if request body data has no matches', async function() {
                const response = await axios.get(testEndpoint, {
                    data: {
                        description: testEntities.binLocation.errorDescription
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
                        shelf: testEntities.binLocation.correctShelf
                    }
                });
                console.log(response.data);

                // Prisma delete will return the count of delete records only
                assert.equal(response.data.count, 2);
            });

            it('Warehouses persist', async function() {
                const response = await axios.get('http://localhost:24326/api/warehouses/' + testBinLocation.warehouseId);
                console.log(response.data);

                assert.equal(response.data.description, testEntities.warehouse.json.description);
            });

            it('Delete the warehouse', async function () {
                // TODO: this needs to be a cleanup not a test
                const response = await axios.delete('http://localhost:24326/api/warehouses/', {
                    data: {
                        id: testBinLocation.warehouseId
                    }
                });
                console.log(response.data);

                assert.equal(response.data.count, 1);
            });

        }); // 'DELETE'


    }); // 'Using Body Parameters'

}); // 'API Test Endpoint: ./api/binlocations/'

