const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./jobs/syncJob');  

const flightRoutes = require('./routes/flightRoutes');

const app = express(); // 🔹 app is declared BEFORE it's used
app.disable('etag');   // 🔹 disable ETag header to avoid 304 caching

app.use(cors());
app.use(express.json());

app.use('/api/flights', flightRoutes);

module.exports = app;

