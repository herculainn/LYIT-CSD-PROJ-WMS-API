const assert = require('assert');
const {response} = require("express");

// Helper method for async assert.throws()
// https://nodejs.org/api/assert.html#assert_assert_throws_fn_error_message
// https://stackoverflow.com/questions/35782435/node-js-assert-throws-with-async-functions-promises
exports.assertThrowsAsync = async (aFunction, regExp) => {
    // cException will represent the error that aFunction might result in
    let cException = () => {};
    try {
        // we execute the function an await an outcome
        await aFunction();
    } catch(e) {
        // if there is an error, store it under cException
        cException = () => {throw e};
    } finally {
        // this block will run regardless of there having been an exception
        // The assertion checks that the text given as a regular expression matches values
        // within the exception thrown. If there was no exception it will not match.
        assert.throws(cException, regExp);
    }
}

// Helper method will create a deep copy of a JSON object
// this allows us to make use of pseudo.models without modifying them
// carries a higher memory cost
exports.cloneJSON = (aJSON) => {
    // Convert the JSON to a String - creating a new object
    // then convert that String object back into a new JSON object.
    return JSON.parse(JSON.stringify(aJSON));
}

// Helper method will determine the nighest ID of the given prisma table
// then add one to it ot create a new unique Id
exports.getUniqueID = async (aPrisma) => {

    // Retrieve all existing records from Prisma table.
    // Note: This is utilizing Javascript Promises, and array sorting
    // Both of these points mean this method is not particularly performant
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    const existingRecords = await aPrisma.findMany({}).then(function (result) {
        return result.sort( // Compare both values return 1, 0, or -1
            (e1, e2) => (e1.id > e2.id) ? 1 : (e1.id < e2.id) ? -1 : 0
        );
    })

    // A new ID will be the greatest plus one
    return existingRecords[existingRecords.length - 1].id + 1;

}
