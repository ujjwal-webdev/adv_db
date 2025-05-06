const { checkNFZViolationsBatch } = require('../services/airspaceService');

async function syncNFZAlerts() {
  console.log('Checking flight-NFZ intersections...');
  await checkNFZViolationsBatch(50); // or any limit you prefer
}

module.exports = syncNFZAlerts;
