const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Set up socket.io
io.on('connection', (socket) => {
    console.log('User connected');
});

app.use((req, _, next) => {
    req.io = io;
    next();
});

// Set up env variables
require('dotenv').config();
const PORT = process.env.PORT || 8081;

// Add JSON and CORS middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world');
});

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
server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
}); 