const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

// Cache: db_name → Sequelize instance
const tenantConnections = new Map();

/**
 * Get or create a Sequelize connection for a tenant database.
 * @param {string} dbName - The tenant's database name (e.g., "coop_1_db")
 * @returns {Sequelize}
 */
const getTenantDb = (dbName) => {
  if (tenantConnections.has(dbName)) {
    return tenantConnections.get(dbName);
  }

  const instance = new Sequelize(
    dbName,
    config.tenantDb.username,
    config.tenantDb.password,
    {
      host: config.tenantDb.host,
      port: config.tenantDb.port,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000,
      },
    }
  );

  tenantConnections.set(dbName, instance);
  logger.info(`🔗 Tenant DB connection created: ${dbName}`);
  return instance;
};

/**
 * Remove a tenant DB connection from cache (e.g., on tenant deletion).
 * @param {string} dbName
 */
const closeTenantDb = async (dbName) => {
  if (tenantConnections.has(dbName)) {
    const instance = tenantConnections.get(dbName);
    await instance.close();
    tenantConnections.delete(dbName);
    logger.info(`🔌 Tenant DB connection closed: ${dbName}`);
  }
};

module.exports = { getTenantDb, closeTenantDb };
