const { Sequelize, QueryTypes } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

/**
 * Step 1 — Connect to the default 'postgres' DB and auto-create
 * the main platform database if it does not yet exist.
 */
const ensureMainDbExists = async () => {
  const adminConn = new Sequelize(
    'postgres',                    // default system DB (always exists)
    config.mainDb.username,
    config.mainDb.password,
    {
      host: config.mainDb.host,
      port: config.mainDb.port,
      dialect: 'postgres',
      logging: false,
    }
  );

  try {
    await adminConn.authenticate();

    const dbName = config.mainDb.database;

    // Check if the target database already exists
    const rows = await adminConn.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
      { type: QueryTypes.SELECT }
    );

    if (rows.length === 0) {
      await adminConn.query(`CREATE DATABASE "${dbName}"`);
      logger.info(`✅ Main database created: ${dbName}`);
    } else {
      logger.info(`✅ Main database already exists: ${dbName}`);
    }
  } finally {
    await adminConn.close();
  }
};

/**
 * Step 2 — Sequelize instance pointed at the main platform database.
 */
const mainDb = new Sequelize(
  config.mainDb.database,
  config.mainDb.username,
  config.mainDb.password,
  {
    host: config.mainDb.host,
    port: config.mainDb.port,
    dialect: 'postgres',
    logging: config.mainDb.logging,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);

/**
 * Called once at startup:
 *  1. Auto-create the main DB if missing.
 *  2. Authenticate & sync all Main DB models.
 */
const connectMainDb = async () => {
  try {
    // ── Auto-create DB if it doesn't exist ──
    await ensureMainDbExists();

    // ── Connect & sync models ──
    await mainDb.authenticate();
    logger.info('✅ Main Database connected successfully.');

    // Register platform support models before sync
    require('../models/main/PlatformSupportTicket');
    require('../models/main/PlatformSupportReply');

    await mainDb.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('✅ Main Database models synchronized.');
  } catch (error) {
    logger.error('❌ Main Database setup failed:', error.message);
    process.exit(1);
  }
};

module.exports = { mainDb, connectMainDb };
