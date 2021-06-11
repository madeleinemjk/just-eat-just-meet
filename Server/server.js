const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

require('dotenv').config();
// Get this from env variable, with fallback
const PORT = process.env.PORT || 8081;

// Add JSON and CORS middleware
app.use(express.json());
app.use(cors());

const reloadDb = process.env.RELOAD_DB;

console.log(`Reload DB set to ${reloadDb}`);

db.sequelize.sync({force: reloadDb})
    .then(() => {
        console.log('Db sync completed');
    });

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
}); 