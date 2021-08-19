const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client

const testEntities = require("./utils/test.entities");
const utilities = require("./utils/test.utils");

require('../'); // Start the API server

// TODO: Change database to TEST database??

// "it" accepts a callback function in which we will perform the required work.
// This function can also avail of a callback function, called "done" by convention.
// When done is declared, Mocha will await a call to this function to end the test, creating an asynchronous test.
// The done() function can accept a parameter indicating a failed test.

describe('API Test Warehouse Endpoint: ./api/warehouses/', function() {

    let testEndpoint = 'http://localhost:3000/api/warehouses/';
    let testWarehouse = JSON.parse(JSON.stringify(testEntities.warehouse.json));

    beforeEach(() => {
        // TODO: Before each test should we prepare the database?
    });

    describe('Initial Empty Database', function() {
        it('Returns empty array if there are no Warehouses', async function() {
            const response = await axios.get(testEndpoint);
            console.log(response.data);
            assert.equal(response.data.length, 0);
        });
    }); // 'Initial Empty Database'

    describe('POST', function() {

        it('Create a new Warehouse', async function() {
            try {
                const response = await axios.post(testEndpoint, testWarehouse)
                console.log(response.data);
                assert.equal(response.data.description, testWarehouse.description);
                assert.equal(response.data.postcode, testWarehouse.postcode);

                // Update test instance with new IDs for later
                // TODO: This undermines UNIT test?
                testWarehouse = response.data; // update with ID

            } catch (e) {
                console.log(e.response.data);
                throw e;
            }
        });

        it('Cannot overwrite existing warehouse', async function() {
            await utilities.assertThrowsAsync(async () => {
                await axios.post(testEndpoint, {
                    id: testWarehouse.id, // ID from previous
                    addressCountry: testEntities.warehouse.correctPostcode
                });
            }, /status code 500/);
        });

    }); // 'POST'

    describe('PUT', function() {

        it('Updates existing Warehouse', async function() {
            try {
                const response = await axios.put(testEndpoint, {
                    id: testWarehouse.id, // ID from previous
                    postcode: testEntities.warehouse.correctPostcode
                });
                console.log(response.data);
                assert.equal(response.data.id, testWarehouse.id);
                assert.equal(response.data.postcode, testEntities.warehouse.correctPostcode);

            } catch (e) {
                console.log(e.response.data);
                throw(e);
            }
        });

        it('Creates new Warehouse if new id is used', async function() {
            try {
                const response = await axios.put(testEndpoint, {
                    id: (testWarehouse.id + 1),
                    description: testEntities.warehouse.correctDescription,
                    postcode: testEntities.warehouse.correctPostcode
                });
                console.log(response.data);
                assert.equal(response.data.id, testWarehouse.id + 1);
                assert.equal(response.data.description, testEntities.warehouse.correctDescription);

            } catch (e) {
                console.log(e.response.data);
                throw(e);
            }
        });

        it('Error if no ID is provided', async function() {
            try {
                const response = await axios.put(testEndpoint, {
                    description: testEntities.warehouse.errorDescription
                });
                console.log(response.data);
                assert.fail('Able to PUT resource without ID');

            } catch (e) {
                console.log(e.response.data);
                // TODO: Checking string message probably not wise
                assert.equal(e.response.data.prisma_error.message, 'ID is not an integer.');
            }
        });

    }); // 'PUT'

    describe('GET', function() {

        it('No parameters returns array of all warehouses', async function() {
            const response = await axios.get(testEndpoint);
            console.log(response.data);

            if (response.data.length > 0) {
                assert.equal(
                    response.data
                        .find(warehouse => warehouse.id === testWarehouse.id)
                        .description,
                    testWarehouse.description);

            } else {
                // Database not configured for testing - fail the test to correct this
                throw new Error("No warehouse records available for testing!");
            }
        });

        it('PATH PARAMETER returns Warehouse by ID', async function() {
            const response = await axios.get(testEndpoint + testWarehouse.id);
            console.log(response.data);

            assert.equal(response.data.id, testWarehouse.id);
            assert.equal(response.data.description, testWarehouse.description);
        });

        it('PATH PARAMETER returns error if ID not valid', async function() {
            await utilities.assertThrowsAsync(async () => {
                await axios.get(testEndpoint + testEntities.warehouse.errorID);
            }, /status code 404/);
        });

        it('REQUEST BODY returns single Warehouses matching unique terms', async function() {
            const response = await axios.get(testEndpoint, {
                data: {
                    id: testWarehouse.id
                }
            });
            console.log(response.data);

            assert.equal(response.data.length, 1);
        });

        it('REQUEST BODY returns multiple Warehouses matching non-unique terms', async function() {
            const response = await axios.get(testEndpoint, {
                data: {
                    postcode: testEntities.warehouse.correctPostcode
                }
            });
            console.log(response.data);
            assert.equal(response.data.length, 2); // 2 - from POST and PUT tests
        });

        it('REQUEST BODY returns empty array if request body data has no matches', async function() {
            const response = await axios.get(testEndpoint, {
                data: {
                    description: testEntities.warehouse.errorDescription
                }
            });
            console.log(response.data);
            assert.equal(response.data.length, 0);
        });

    }); // 'GET'

    describe('DELETE', function() {

        it('PATH PARAMETER deletes specified record', async function() {

            // Confirm this resource still exists
            await axios.get(testEndpoint + testWarehouse.id);

            const response = await axios.delete(testEndpoint + testWarehouse.id);
            console.log(response.data);

            assert.equal(response.data.id, testWarehouse.id); // returns deleted record

            await utilities.assertThrowsAsync(async () => {
                await axios.get(testEndpoint + testWarehouse.id);
            }, /status code 404/); // Assert the warehouse no longer exists

        });

        it('REQUEST BODY deletes multiple records', async function() {

            // Confirm this resource still exists
            await axios.get(testEndpoint + (testWarehouse.id + 1));

            const response = await axios.delete(testEndpoint, {
                data: {
                    postcode: testEntities.warehouse.correctPostcode
                }
            });
            console.log(response.data);

            assert.equal(response.data.count, 1); // 1 left

            await utilities.assertThrowsAsync(async () => {
                await axios.get(testEndpoint + (testWarehouse.id + 1));
            }, /status code 404/); // Assert the warehouse no longer exists
        });

    }); // 'DELETE'

}); // 'API Tests'