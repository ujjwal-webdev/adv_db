require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Import DB connection services
require('./src/services/mongo');
require('./src/services/redisClient');
require('./src/services/neo4j');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get('/', (req, res) => {
  res.send('Server is running with MongoDB, Redis, and Neo4j!');
});


const flightRoutes = require('./src/routes/flights');
app.use('/api/flights', flightRoutes);

// (Optional) Run background jobs here
const syncOpenSky = require('./src/jobs/syncOpenSky');
const syncMongo = require('./src/jobs/syncMongo');
cron.schedule('*/15 * * * * *', syncOpenSky);     // Every 15 seconds
cron.schedule('*/10 * * * *', syncMongo);

// 404 Handler
app.use((req, res) => res.status(404).send('Not Found'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
