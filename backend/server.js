require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const syncPrices = require('./src/jobs/syncPrices');

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

// User-Story 1: Syncing live flights
const flightRoutes = require('./src/routes/flights');
app.use('/api/flights', flightRoutes);

const syncOpenSky = require('./src/jobs/syncOpenSky');
const syncMongo = require('./src/jobs/syncMongo');
cron.schedule('*/15 * * * * *', syncOpenSky);     // Every 15 seconds
cron.schedule('*/10 * * * *', syncMongo);

// User-Story 2: Syncing flight prices

//Sync prices for multiple routes
const routes = [
  ['FRA', 'DEL'],
  ['DEL', 'LHR'],
  ['BOM', 'DXB'],
  ['JFK', 'LHR'],
  ['LHR', 'JFK'],
  ['JFK', 'CDG'],
  ['CDG', 'JFK'],
  ['LHR', 'DXB'],
  ['DXB', 'LHR'],
  ['SIN', 'SYD'],
  ['SYD', 'SIN'],
  ['LAX', 'HND'],
  ['HND', 'LAX'],
  ['FRA', 'JFK'],
  ['JFK', 'FRA'],
  ['DXB', 'SIN'],
  ['SIN', 'DXB'],
  ['DEL', 'CDG'],
  ['CDG', 'DEL'],
  ['LAX', 'SYD'],
  ['SYD', 'LAX']
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function syncFlightPrices() {
  console.log('Sync flight prices started...');
  for (const [from, to] of routes) {
    try {
      await syncPrices(from, to);
      await delay(2000); // 2-second gap
    } catch (err) {
      console.error(`Error syncing ${from}-${to}:`, err.message);
    }
  }
  console.log('Sync flight prices finished.');
}
syncFlightPrices();

const priceRoutes = require('./src/routes/prices');
app.use('/api/prices', priceRoutes);

const syncNeo4jRoutes = require('./src/jobs/syncNeo4jRoutes');

async function syncBusiestRoutes() {
  console.log('Syncing busiest routes to Neo4j...');
  await syncNeo4jRoutes();
}
syncBusiestRoutes();

const routeRoutes = require('./src/routes/flights');
app.use('/api/routes', routeRoutes);

//User-Story 3: Syncing weather alerts
const syncWeatherAlerts = require('./src/jobs/syncWeatherAlerts');

cron.schedule('*/10 * * * *', async () => {
  console.log('Syncing weather alerts...');
  await syncWeatherAlerts();
});

//User-Story 4: Syncing restricted airspaces
const restrictedAirspaceRoutes = require('./src/routes/restrictedAirspaceRoutes');
app.use('/api/airspaces/restricted', restrictedAirspaceRoutes);

// const syncRestrictedAirspaces = require('./src/jobs/syncRestrictedAirspaces');
// syncRestrictedAirspaces(); // Trigger it once when server starts

const syncNFZAlerts = require('./src/jobs/syncNFZAlerts');

cron.schedule('*/10 * * * *', async () => {
  await syncNFZAlerts();
});

const nfzAlertRoutes = require('./src/routes/nfzAlerts');
app.use('/api/alerts/nfz', nfzAlertRoutes);



app.use((req, res) => res.status(404).send('Not Found'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
