const assert = require('assert');

// Helper method for async assert.throws()
// https://nodejs.org/api/assert.html#assert_assert_throws_fn_error_message
// https://stackoverflow.com/questions/35782435/node-js-assert-throws-with-async-functions-promises
const assertThrowsAsync = async (fn, regExp) => {
    let f = () => {};
    try {
        await fn();
    } catch(e) {
        f = () => {throw e};
    } finally {
        assert.throws(f, regExp);
    }
}

module.exports = {
    assertThrowsAsync
};