const aggregateBusiestRoutes = require('../services/aggregateFlights');
const { upsertRoute } = require('../services/neo4jService');

async function syncNeo4jRoutes() {
  const routes = await aggregateBusiestRoutes(20); // Top 20 routes
  for (const { origin, destination, count, minPrice, avgStops, bestScore, avgPrice } of routes) {
    await upsertRoute(origin, destination, count, minPrice, avgStops, bestScore, avgPrice);
  }
  console.log('Synced busiest routes to Neo4j.');
}

module.exports = syncNeo4jRoutes;
