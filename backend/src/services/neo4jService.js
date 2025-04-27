const { session } = require('./neo4j');

async function upsertRoute(origin, destination, count) {
  const query = `
    MERGE (a:Airport {code: $origin})
    MERGE (b:Airport {code: $destination})
    MERGE (a)-[r:HAS_ROUTE]->(b)
    SET r.count = $count
  `;
  await session.run(query, { origin, destination, count });
}

module.exports = { upsertRoute };
