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
        // Try to put it on the client with a 4xx code!

        // using includes() as some types have version revision after the name
        if (e.constructor.name.includes('PrismaClientValidationError')) return 400; // 'Bad Request'

        if (e.constructor.name.includes('NotFoundError')) return 404; // 'Not Found'

        if (e.constructor.name.includes('PrismaClientKnownRequestError3')) {

            // "An operation failed because it depends on one or more records that were required but not found. {cause}"
            if (e.code === 'P2025') return 404; // 'Not Found'

            // "Unique constraint failed on the {constraint}"
            if (e.code === 'P2002') return 400; // 'Bad Request'

            // "Null constraint violation on the {constraint}"
            if (e.code === 'P2011') return 400; // 'Bad Request'

            return 400; // 'Bad Request'
        }

        // Other Prisma Error Types:
        // - PrismaClientUnknownRequestError
        // - PrismaClientRustPanicError
        // - PrismaClientInitializationError

    }

    // Default
    return 500; // 'Internal Server Error'
}

module.exports = {
    generateReturnJSON, httpStatus
};