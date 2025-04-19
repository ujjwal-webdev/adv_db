const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || '12345678'; 

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const getSession = () => driver.session();

module.exports = { getSession, driver };
