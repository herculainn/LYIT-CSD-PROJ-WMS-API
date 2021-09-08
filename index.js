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
//     Routes to drill down further
//         /api/warehouses/<thisOne>/binlocations/....
//         /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/.....
//         /api/warehouses/<thisOne>/binlocations/<thisOne>/StockItems/<thisOne>
//     Continuous Integration
//         GET GITHUB CI running..

// MIDDLEWARE
// Must be in order of execution

app.use(express.json()); // parse the JSON received

// Anything we want to do before routing?
app.use((req, res, next) => {
    // console.log("req.params.id: " + req.params.id);
    // console.log("req.body.id: " + req.body.id);

    // Allow same-domain via CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers," +
        " Origin,Accept," +
        " X-Requested-With," +
        " Content-Type," +
        " Access-Control-Request-Method," +
        " Access-Control-Request-Headers");

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