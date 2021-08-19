// This module exports functions to assist with prisma EXCEPTIONS

const generateReturnJSON = (e) => {
    // Prisma Error Handling
    // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors/
    // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    if (e) return {
        // debug_info: {
        //     stack: e.stack
        // },
        prisma_error: {
            type: e.constructor.name,
            code: e.code,
            error_code: e.errorCode,
            meta: e.meta,
            client_version: e.clientVersion,
            message: e.message
        }
    }

    // Default
    return {
        prisma_error: {
            type: 'Unknown error!'
        }
    };
}

const httpStatus = (e) => {
    // Determine which HTTP error code to throw depending on the error from Prisma
    // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-error-types

    if (e) {

        if (e.constructor.name === 'PrismaClientValidationError') return 400; // 'Bad Request'
        if (e.constructor.name === 'NotFoundError') return 404; // 'Not Found'

        // Other Prisma Error Types
        // if (e instanceOf PrismaClientValidationError) /* something */;
        // PrismaClientKnownRequestError - contains code property for further information
        // PrismaClientUnknownRequestError
        // PrismaClientRustPanicError
        // PrismaClientInitializationError

    }

    // Default
    return 500; // 'Internal Server Error'
}

module.exports = {
    generateReturnJSON, httpStatus
};