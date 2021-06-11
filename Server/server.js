const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');

// Set up env variables
require('dotenv').config();
const PORT = process.env.PORT || 8081;

// Add JSON and CORS middleware
app.use(express.json());
app.use(cors());

// Set up routes
app.use("/restaurants", restaurantRoutes);
app.use("/orders", orderRoutes);

// Set up DB stuff
// NB: RELOAD_DB will drop and re-create tables, losing data
const reloadDb = process.env.RELOAD_DB === 'true';
console.log(`Reload DB set to ${reloadDb}`);
db.sequelize.sync({force: reloadDb})
    .then(() => {
        console.log('Db sync completed');
    });

// Start app
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
}); 