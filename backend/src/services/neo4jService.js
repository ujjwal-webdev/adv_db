const { session } = require('./neo4j');

async function upsertRoute(origin, destination, count, minPrice, avgStops, bestScore, avgPrice) {
  const query = `
    MERGE (a:Airport {code: $origin})
    MERGE (b:Airport {code: $destination})
    MERGE (a)-[r:HAS_ROUTE]->(b)
    SET r.count = $count,
        r.minPrice = $minPrice,
        r.avgStops = $avgStops,
        r.bestScore = $bestScore
        r.avgPrice = $avgPrice
  `;

  await session.run(query, {
    origin,
    destination,
    count,
    minPrice,
    avgStops,
    bestScore
  });
}

module.exports = { upsertRoute };
