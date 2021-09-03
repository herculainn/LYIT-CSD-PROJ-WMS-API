// A collection of functions which are of general use

// Helper method will create a deep copy of a JSON object
// this allows us to make use of pseudo.models without modifying them
// carries a higher memory cost
const querystring = require("querystring");
exports.cloneJSON = (aJSON) => {
    // Convert the JSON to a String - creating a new object
    // then convert that String object back into a new JSON object.
    return JSON.parse(JSON.stringify(aJSON));
};

// Applications send query strings in different ways
// postman: Object{param1:value1, param2:value2"}
// mocha: Object{0: "param1=value1&param2=value2"}
exports.prepareReqQuery = (aSource) => {
    let tmpSource; // scope
    if (aSource[0]) {
        tmpSource = querystring.decode(aSource[0]);
    } else {
        tmpSource = aSource;
    }
    return tmpSource;
};