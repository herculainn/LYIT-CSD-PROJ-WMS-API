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

// MIDDLEWARE
// Must be in order of execution

app.use(express.json()); // parse the JSON received

// Anything we want to do before routing?
app.use((req, res, next) => {
    // console.log("req.params.id: " + req.params.id);
    // console.log("req.body.id: " + req.body.id);
    next();
});

// Import Routes
require('./app/routes/warehouse.routes')(app);
require('./app/routes/binlocation.routes')(app);
require('./app/routes/stockItem.routes')(app);

// Start the server!
app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
});

// For testing
module.exports = app;