const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

driver.verifyConnectivity()
  .then(() => console.log('Neo4j connected'))
  .catch((err) => console.error('Neo4j connection error:', err.message));

const session = driver.session()

module.exports = { driver, session };