// This module exports functions to assist with Validation

exports.validateID = (aId) => {
    // Convert the given value to an integer, ensuring the integrity of the value.
    // Throw an exception if the value cannot be safely converted.
    // Using "==" and not "===" as we will be comparing different types
    if (aId && (parseInt(aId) == aId)) {
        return parseInt(aId);
    } else {
        throw new Error("ID is not an integer.");
    }
}