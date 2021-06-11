const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
// Get this from env variable, with fallback
const PORT = process.env.PORT || 8081;


// Add JSON and CORS middleware
app.use(express.json());
app.use(cors());


app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
}); 