// Convenience module for repeatable data validation
const utilities = require("./app/utils/validation");

// TODO: Prisma does not create the database, nor the tables, when we simply change the URL!
// TODO: This unit could be tidied up - the validation is really messy.. is there a better validation app?

// Modules are cached the first time they are loaded. Subsequent require() calls to the module will return
// the cached instance; ensuring the app will use the same instance. This allows us to redirect the client
// to a secondary database for different functions, such as testing.
// https://nodejs.org/api/modules.html#modules_caching
// https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/instantiate-prisma-client
// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference/#programmatically-override-a-datasource-url
const {PrismaClient} = require('@prisma/client');
let cacheClient;

// We must first create an instance of the prisma client with a given database URL (or default from schema.prisma)
// Exporting a function from a module, however, will result a new object as a return value.
// So here, we instantiate the cacheClient or return it if it already has been.
// We will make sure that TESTs create the client with a URL for a TEST DATABASE, while index.js can try to use a
// development URL or environment variable. This makes sure that all other modules continue to use the test database.
exports.prismaClient = (aConfig) => {

    // Prepare some prisma client configurations
    // note: may be unused if client already exists
    let prismaConfig = { rejectOnNotFound: true };

    // Some further preparation if configurations have been provided
    // as part of the call. Also some debug information.
    if (aConfig) {

        // For debugging: print caller to console
        if (aConfig.caller) {
            console.log(aConfig.caller + ' wants a Prisma Client!');
        } else {
            console.log('We need a Prisma Client!');
        }

        // For debugging: print the URL being used to the console
        if (aConfig.db.url) {
            console.log(' - at this URL: ' + aConfig.db.url);
        } else {
            console.log(' - at default URL');
        }

        if (aConfig.db) prismaConfig.datasources = { db: aConfig.db };

    } else {
        console.log('Attempt to get a Prisma Client without configuration!');
    }

    // If the client has already be instantiated
    // then send it back for re-use!
    if (cacheClient) {
        console.log(' - Prisma Client already exists, using it!');
        return cacheClient;
    } else {
        console.log(' - Proceeding to create new Prisma Client!');
    }

    // Otherwise, create a new client using the configuration prepared
    cacheClient = new PrismaClient(prismaConfig);

    // Next we can add some middleware to execute for each call to the prisma client
    // https://www.prisma.io/docs/concepts/components/prisma-client/middleware
    cacheClient.$use(async (params, next) => {
        // params.model tells us which table we are running against
        // params.action tells us what Prisma API function we are using (eg deleteMany, findUnique..)
        // params.args contains any configuration passed to that action/function

        console.log('Prisma call to: ' + params.model + '.' + params.action);

        // This middleware will be used to validate any ID before passing the call forward using next()
        const validateModels = ['warehouse'];
        const validateActions = ['findunique', 'findmany', 'upsert', 'create', 'delete'];

        // check that there will be something to validate first
        if (params.args) {
            console.log(' - params.args: ' + JSON.stringify(params.args));

            // check that we intended to validate on this model
            if (validateModels.includes(params.model.toLowerCase())) {
                // check that we intended to validate this action
                if (validateActions.includes(params.action.toLowerCase())) {
                    // From here, the contents of args could vary per action..

                    // findUnique, findMany, upsert
                    if (params.args.where) { // the call provides data
                        if (params.args.where.id) { // and the data contains an ID
                            params.args.where.id = utilities.validateID(params.args.where.id);
                        }
                    }

                    // upsert
                    if (params.args.update) { // the call provides data
                        if (params.args.update.id) { // and the data contains an ID
                            params.args.update.id = utilities.validateID(params.args.update.id);
                        }
                    }
                    if (params.args.create) { // the call provides data
                        if (params.args.create.id) { // and the data contains an ID
                            params.args.create.id = utilities.validateID(params.args.create.id);
                        }
                    }

                    // create
                    if (params.args.data) { // the call provides data
                        if (params.args.data.id) { // and the data contains an ID
                            params.args.data.id = utilities.validateID(params.args.data.id);
                        }
                    }

                }
            }
        }

        // Allow the next step to run (original call if no other middleware used)
        const result = await next(params)

        // Here we could perform any other changes to the result before we
        // Return the result back through the stack
        return result
    })

    // Return the new instance
    return cacheClient;
}
