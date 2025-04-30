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


const flightRoutes = require('./src/routes/flights');
app.use('/api/flights', flightRoutes);

const syncOpenSky = require('./src/jobs/syncOpenSky');
const syncMongo = require('./src/jobs/syncMongo');
// cron.schedule('*/15 * * * * *', syncOpenSky);     // Every 15 seconds
cron.schedule('*/10 * * * *', syncMongo);

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

cron.schedule('0 */6 * * *', () => {
  console.log('Syncing flight prices...');
  routes.forEach(([from, to]) => syncPrices(from, to));
});

const priceRoutes = require('./src/routes/prices');
app.use('/api/prices', priceRoutes);

const syncNeo4jRoutes = require('./src/jobs/syncNeo4jRoutes');

cron.schedule('0 */12 * * *', async () => {
  console.log('Syncing busiest routes to Neo4j...');
  await syncNeo4jRoutes();
});

const routeRoutes = require('./src/routes/flights');
app.use('/api/routes', routeRoutes);


app.use((req, res) => res.status(404).send('Not Found'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
