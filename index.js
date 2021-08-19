const express = require("express");
const app = express();

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
const port = process.env.PORT || "3000";
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});

// For testing
module.exports = app;