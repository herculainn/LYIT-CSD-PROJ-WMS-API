const assert = require('assert'); // For testing assertions
const axios = require('axios'); // HTTP client
const querystring = require("querystring"); // For generating/interpreting URLs

// TODO: beforeEach will we need to do this on other tables? if testing nested elements?

// A list of prebuilt warehouses in JSON for use during testing
const dummyWarehouses = require('./dummy/warehouse.dummy').dummyWarehouses;

// Our own global functions that will be of use to all test units
const utilities = require("./utils/test.utils");

// This should be the first call to the client module, resulting in the prismaClient being instantiated
// using the TEST database. This cachedClient will in turn be used by controllers via the REST API.
const prisma = require('../client').prismaClient({
    caller: "warehouse.test.js",
    db: {
        url: process.env.DATABASE_URL
    }
});

// Get and start the REST API server!
require('../');

// The Endpoint for testing
const testEndpoint = 'http://localhost:' + process.env.PORT + '/api/warehouses/';

// Using Mocha to manage the following tests
// https://mochajs.org/#parallel-mode

// Assertions are those of the node.js library
// https://nodejs.org/api/assert.html

// We will nest several describe() functions before finally writing what it() should do
// This is used by Mocha (and the chosen IDE) to improve the readability of the results
// This provides for a Behaviour Driven Development (BDD) - like experience
describe('API Test Warehouse Endpoint: ./api/warehouses/', function() {

    // Using beforeEach() to sanitize and prepare the database tables before each test
    // This allows us to make sure that each test can stand-alone without reliance on or,
    // interference from previous tests
    beforeEach(async () => {

        // !IMPORTANT we must be using a TEST database
        // Delete any existing records from the warehouse table
        await prisma.warehouse.deleteMany({});

        // Now add the warehouses we intend to use for testing
        // https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-multiple-records
        await prisma.warehouse.createMany({
            data: [
                dummyWarehouses[0], // LYIT
                dummyWarehouses[1]  // AMAZON DE
            ]
        });
    });

    describe('Initial Database', function() {

        // These are tests against the database (via Prisma)
        // rather than tests against the server (via Axios)

        it('beforeEach() has added records to warehouse table', async function() {

            // Get all warehouses from the warehouse table
            const existingWarehouses = await prisma.warehouse.findMany({});

            // Assert that only items exist
            assert.equal(existingWarehouses.length, 2);

        });

        it('beforeEach() had removed all records before having added those new records', async function() {
            // Repeat the same test; thus ensuring that the two warehouses haven't simply been added twice

            // Get all warehouses from the warehouse table
            const existingWarehouses = await prisma.warehouse.findMany({});

            // Assert that only items exist
            assert.equal(existingWarehouses.length, 2);
            assert.notEqual(existingWarehouses.length, 4);

        });

    }); // 'Initial Database'

    // The API will expose two methods of performing functions via the endppoints where appropries
    // The first is to use JSON sent within the HTTP Request body
    // The second is to use PATH PARAMETERS and QUERY PARAMETERS
    // We will group tests by these options
    describe('Using REQUEST BODY', function() {

        // We will further group tests by REST Verbs
        // a logical grouping of tests allows us to trace issues faster
        describe('POST', function() {

            // Each test defined by an it() function
            // These each also have a title to describe exactly what we expect IT to do.
            // Ensuring each it() can does not rely on other tests means we can run then individually yoo
            it('Cannot overwrite existing warehouse', async function() {

                // Each unit test would typically try to follow the "Arrange Act Assert" pattern
                // That is that we would arrange (gather) any necessary data
                // before acting upon that data (the functionality to test)
                // and finally making assertions about the expected outcome

                // Arrange: Fetch existing records from the warehouse table
                const existingWarehouses = await prisma.warehouse.findMany({});
                // then fetch some data for a dummy warehouse (create a clone)
                let postWarehouse = utilities.cloneJSON(dummyWarehouses[2]);
                // and assign the ID from an existing record to the dummy warehouse
                postWarehouse.id = existingWarehouses[0].id;

                // Assert (read order switched): that this will throw an error ("status code 500")
                await utilities.assertThrowsAsync(async () => {

                    // Act: try to post a new record using the dummy warehouse and duplicated id
                    await axios.post(testEndpoint, postWarehouse);

                }, /status code 500/);

            });

            // We will have multiple tests per grouping
            // The intention is to cover not just expected behaviour but also expected failures (graceful)
            // and to identify potential edge-cases (which may not otherwise be so gracefully handled)
            it('Create a new Warehouse', async function() {

                // Arrange
                const postWarehouse = utilities.cloneJSON(dummyWarehouses[2]);

                // Act
                const response = await axios.post(testEndpoint, postWarehouse);

                // Assert
                assert.equal(response.data.description, postWarehouse.description);
                assert.equal(response.data.postcode, postWarehouse.postcode);

            });

        }); // End of 'POST'

        describe('PUT', function() {

            it('Error if no ID is provided', async function () {
                // This test should contrast with that of the POST
                // as we haven't specified where to put the resource
                // POST will create the new resource with a new ID

                // Arrange
                const putWarehouse = utilities.cloneJSON(dummyWarehouses[2]);

                // Assert (read order switched): that this will throw an error ("status code 500")
                await utilities.assertThrowsAsync(async () => {

                    // Act
                    await axios.put(testEndpoint, putWarehouse);

                }, /status code 400/); // PrismaClientValidationError

            });

            it('Updates existing Warehouse', async function () {

                // Arrange: get an existing warehouse ID
                const existingWarehouseId = (await prisma.warehouse.findMany({}))[0].id;

                // Create a warehouse to attempt to put
                let putWarehouse = utilities.cloneJSON(dummyWarehouses[2]);
                putWarehouse.id = existingWarehouseId;
                putWarehouse.description = 'PUT Updated Description';

                // Act: now change something (description) about that resource using its ID
                await axios.put(testEndpoint, putWarehouse);

                // Assert: that the changes took effect
                // first get the same resource from the table
                const updatedWarehouse =  await prisma.warehouse.findUnique({
                    where: { id: existingWarehouseId }
                });

                // now make our assertion that the change took effect
                assert.equal(updatedWarehouse.description, putWarehouse.description);

            });

            it('Creates new Warehouse if new id is used', async function () {

                // Get a new ID for a new record
                const newID = await utilities.getUniqueID(prisma.warehouse);

                console.log(newID);

                // Create a warehouse to attempt to put
                let putWarehouse = utilities.cloneJSON(dummyWarehouses[2]);
                putWarehouse.id = newID;
                putWarehouse.description = 'PUT Updated Description';

                // Act: now change something (description) about that resource using its ID
                await axios.put(testEndpoint, putWarehouse);

                // Assert: that the changes took effect
                // first get the same resource from the table
                const updatedWarehouse =  await prisma.warehouse.findUnique({
                    where: { id: newID }
                });
                // now make our assertion that the change took effect
                assert.equal(updatedWarehouse.description, putWarehouse.description);

            });

        }); // End of 'PUT'

        describe('GET', function() {

            it('No parameters returns array of all warehouses', async function() {

                const getWarehouse = await axios.get(testEndpoint);

                assert.equal(getWarehouse.data.length, 2);

            });

            it('error if a string is provided as ID', async function() {

                // Arrange - retrieve posted warehouses for their ID
                const existingWarehouseID = (await prisma.warehouse.findMany({}))[0].id;

                // result should be an array given the nature of the call
                // See previous and the next test for multiple results
                const getWarehouse = await axios.get(testEndpoint, {
                    data: {
                        id: existingWarehouseID.toString()
                    }
                });

                assert.equal(getWarehouse.data.length, 1);
                assert.equal(getWarehouse.data[0].description, dummyWarehouses[0].description);

            });

            it('returns single Warehouses matching unique terms', async function() {

                // Arrange - retrieve posted warehouses for their ID
                const existingWarehouseID = (await prisma.warehouse.findMany({}))[0].id;

                // result should be an array given the nature of the call
                // See previous and the next test for multiple results
                const getWarehouse = await axios.get(testEndpoint, {
                    data: {
                        id: existingWarehouseID
                    }
                });

                assert.equal(getWarehouse.data.length, 1);
                assert.equal(getWarehouse.data[0].description, dummyWarehouses[0].description);

            });

            it('returns multiple Warehouses matching non-unique terms', async function() {

                // Arrange - Add another warehouse which has the same address as an existing one
                let newWarehouse = utilities.cloneJSON(dummyWarehouses[2]);
                newWarehouse.address1 = dummyWarehouses[0].address1;
                await prisma.warehouse.create({
                    data: newWarehouse
                });

                // Act - should find one original and the new post
                const getWarehouse = await axios.get(testEndpoint, {
                    data: {
                        address1: dummyWarehouses[0].address1
                    }
                });

                assert.equal(getWarehouse.data.length, 2);
                assert.equal(getWarehouse.data[0].address1, dummyWarehouses[0].address1);
                assert.equal(getWarehouse.data[0].address1, getWarehouse.data[1].address1);

            });

            it('returns empty array if request body data has no matches', async function() {

                const response = await axios.get(testEndpoint, {
                    data: { address3: 'not used' }
                });

                assert.equal(response.data.length, 0);

            });

        }); // End of 'GET'

        describe('DELETE', function() {

            it('deletes one record by id', async function() {

                // Retrieve a warehouse that already exists
                const existingWarehouse = (await prisma.warehouse.findMany({}))[0];

                // Kill it
                const response = await axios.delete(testEndpoint, {
                    data: {
                        id: existingWarehouse.id
                    }
                });

                // Assert that single record was deleted
                assert.equal(response.data.count, 1);

                // Also assert that we cannot find that record anymore
                // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
                await utilities.assertThrowsAsync(async () => {
                    await prisma.warehouse.findUnique({
                        where: { id: existingWarehouse.id }
                    });
                }, /NotFoundError/);

            });

            it('deletes multiple matching records', async function() {

                // Arrange - Add another warehouse which has the same address as an existing one
                let newWarehouse = utilities.cloneJSON(dummyWarehouses[2]);
                newWarehouse.address1 = dummyWarehouses[0].address1;
                await prisma.warehouse.create({
                    data: newWarehouse
                });

                // Kill them
                const deletedWarehouseCount = await axios.delete(testEndpoint, {
                    data: { address1: dummyWarehouses[0].address1 }
                });

                // Assert that two records were deleted
                assert.equal(deletedWarehouseCount.data.count, 2);

                // Assert that only one record remains
                const remainingWarehouseCount = (await prisma.warehouse.findMany({})).length;
                assert.equal(remainingWarehouseCount, 1);

            });

            it('does not delete if match not found', async function() {

                // Get a new ID for a new record
                const newID = await utilities.getUniqueID(prisma.warehouse);

                // Try to Kill it (will not error)
                const response = await axios.delete(testEndpoint, {
                    data: {
                        id: newID
                    }
                });

                // Assert that single record was deleted
                assert.equal(response.data.count, 0);

            });

        }); // End of 'DELETE'

    }); // End of 'Using REQUEST BODY'

    describe('Using PATH PARAMETER and QUERY STRING', function() {

        describe('POST', function() {

            it('Cannot overwrite existing warehouse', async function() {

                // Get and ID which already exists in the table
                const existingID = (await prisma.warehouse.findMany({}))[0].id;

                // then fetch some data for a dummy warehouse (create a clone)
                let postWarehouse = utilities.cloneJSON(dummyWarehouses[2]);

                // Now try to post overwriting this resource
                await utilities.assertThrowsAsync(async () => {

                    // Act: try to post a new record using the dummy warehouse and duplicated id
                    // Here we must appropriately compile the URL with PATH PARAMETERS and QUERY PARAMETERS
                    // https://axios-http.com/docs/urlencoded
                    await axios.post(testEndpoint + existingID,{}, {
                        params: querystring.stringify(postWarehouse)
                    });

                }, /status code 500/);

            });

            // 'Using PATH PARAMETER - POST - Create a new Warehouse'
            // not possible using Path Parameter and this route as resource must already exist
            // If no ID provided we will be routed to the postWarehouseFromBody controller function


        }); // End of 'POST'

        describe('PUT', function() {

            it('Updates existing Warehouse', async function () {

                // Get a new ID for a new record
                const newID = await utilities.getUniqueID(prisma.warehouse);

                // Create a warehouse to attempt to put
                let putWarehouse = utilities.cloneJSON(dummyWarehouses[2]);

                // Act: now change the resource
                await axios.put(testEndpoint + newID, {}, {
                    params: querystring.stringify(putWarehouse)
                });

                // Assert: that the changes took effect by getting the same resource and property
                const newWarehouse = await prisma.warehouse.findUnique({
                    where: { id: newID }
                });

                // now make our assertion that the change took effect
                assert.equal(newWarehouse.description, putWarehouse.description);

            });

            it('Creates new Warehouse if new id is used', async function () {

                // Arrange: get an existing warehouse ID
                const existingWarehouseId = (await prisma.warehouse.findMany({}))[0].id;

                // Create a warehouse to attempt to put
                let putWarehouse = utilities.cloneJSON(dummyWarehouses[2]);

                // Act: now change the resource
                await axios.put(testEndpoint + existingWarehouseId, {}, {
                    params: querystring.stringify(putWarehouse)
                });

                // Assert: that the changes took effect by getting the same resource and property
                const updatedWarehouseDescription = (await prisma.warehouse.findUnique({
                    where: { id: existingWarehouseId }
                })).description;

                // now make our assertion that the change took effect
                assert.equal(updatedWarehouseDescription, putWarehouse.description);

            });

        }); // End of 'PUT'

        describe('GET', function() {

            it('returns Warehouse by ID', async function() {

                const existingWarehouses = await prisma.warehouse.findMany({});

                const response = await axios.get(testEndpoint + existingWarehouses[0].id);

                assert.equal(response.data.id, existingWarehouses[0].id);
                assert.equal(response.data.description, existingWarehouses[0].description);

            });

            it('returns 404 if ID not valid', async function() {

                // Get a new ID for a new record
                const newID = await utilities.getUniqueID(prisma.warehouse);

                await utilities.assertThrowsAsync(async () => {
                    await axios.get(testEndpoint + newID);
                }, /status code 404/);

            });

        }); // End of 'GET'

        describe('DELETE', function() {

            it('deletes specified record', async function() {

                // Retrieve a warehouse that already exists
                const existingWarehouseID = (await prisma.warehouse.findMany({}))[0].id;

                // Kill it
                const response = await axios.delete(testEndpoint + existingWarehouseID);

                // Assert that single record was deleted
                assert.equal(response.status, 200);
                assert.equal(response.data.id, existingWarehouseID);

                // Also assert that we cannot find that record anymore
                // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
                await utilities.assertThrowsAsync(async () => {
                    await prisma.warehouse.findUnique({
                        where: { id: existingWarehouseID }
                    });
                }, /NotFoundError/);

            });

            it('does not delete if match not found', async function() {

                // Get a new ID for a new record
                const newID = await utilities.getUniqueID(prisma.warehouse);

                // Try to Kill it
                await utilities.assertThrowsAsync(async () => {
                    const response = await axios.delete(testEndpoint + newID);
                }, /404/);

            });

        }); // End of 'DELETE'

    }); // End of 'Using PATH PARAMETER'

}); // End of 'API Test Warehouse Endpoint: ./api/warehouses/'