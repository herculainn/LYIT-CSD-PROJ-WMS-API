// Initialise the Prisma Client if it hasn't already been (.. by test script)
const prisma = require('./client').prismaClient({
    caller: "index.js",
    db: {
        url: process.env.DATABASE_URL
    }
});

const express = require("express");
const app = express();

// TODO: COMMENT WITH SOURCES
//     Additional Routes for activity
//         tests for those Adjustment and Count endpoints
//     Routes to drill down further
//         /api/warehouses/<thisOne>/binlocations/....
//         /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/.....
//         /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/<thisOne>
//     Continuous Integration
//         GET GITHUB CI running..
//     And Then...
//         Document the implementation AND testing for entire API (IN PROGRESS)
//         Build a client!
//             Testing
//             Document implementation and testing
//                 Include Manual Testing walkthroughs
//         Rest of Document
//             Complete the Planning Chapter
//             Complete conclusion
//             Complete document tables, figures, references, code pages, etc... etc...


// MIDDLEWARE
// Must be in order of execution

app.use(express.json()); // parse the JSON received

// Anything we want to do before routing?
app.use((req, res, next) => {
    // console.log("req.params.id: " + req.params.id);
    // console.log("req.body.id: " + req.body.id);
    next();
});

// Import Routes for general CRUD
require('./app/routes/warehouse.routes')(app);
require('./app/routes/binlocation.routes')(app);
require('./app/routes/stockItem.routes')(app);

// Import Routes for Specific Actions; Adjustments and Counts
require('./app/routes/stockAdjustment.routes')(app);
require('./app/routes/stockCount.routes')(app);

// Start the server!
app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
});

// For testing
module.exports = app;