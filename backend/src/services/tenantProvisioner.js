const { mainDb } = require('../config/mainDb');
const { getTenantDb } = require('../config/tenantDb');
const { getTenantModels } = require('../models/tenant/index');
const Tenant = require('../models/main/Tenant');
const { hashPassword, buildTenantDbName } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Provision a brand-new tenant database:
 * 1. Create PostgreSQL database
 * 2. Sync all tenant models (creates tables)
 * 3. Seed SuperAdmin user
 * 4. Update Tenant record with db_name
 *
 * @param {object} params
 * @param {string} params.tenantId
 * @param {string} params.tenantName
 * @param {string} params.superAdminName
 * @param {string} params.superAdminEmail
 * @param {string} params.superAdminPassword
 * @returns {Promise<{dbName: string}>}
 */
const provisionTenantDatabase = async ({
  tenantId,
  tenantName,
  superAdminName,
  superAdminEmail,
  superAdminPassword,
}) => {
  const dbName = buildTenantDbName(tenantId);

  logger.info(`🚀 Provisioning tenant DB: ${dbName}`);

  // Step 1: Create the physical database
  // Connect to 'postgres' default DB to run CREATE DATABASE
  const adminSequelize = require('sequelize');
  const { QueryTypes } = adminSequelize;

  const config = require('../config');
  const { Sequelize } = require('sequelize');

  const adminConn = new Sequelize('postgres', config.tenantDb.username, config.tenantDb.password, {
    host: config.tenantDb.host,
    port: config.tenantDb.port,
    dialect: 'postgres',
    logging: false,
  });

  // Check if DB already exists
  const existing = await adminConn.query(
    `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
    { type: QueryTypes.SELECT }
  );

  if (existing.length === 0) {
    await adminConn.query(`CREATE DATABASE "${dbName}"`);
    logger.info(`✅ Database created: ${dbName}`);
  } else {
    logger.info(`⚠️  Database already exists: ${dbName}`);
  }

  await adminConn.close();

  // Step 2: Connect to new DB and sync all tenant models
  const tenantSequelize = getTenantDb(dbName);
  const models = getTenantModels(tenantSequelize, dbName);

  await tenantSequelize.sync({ force: false, alter: false });
  logger.info(`✅ Tenant schema synchronized: ${dbName}`);

  // Step 3: Seed SuperAdmin user
  const { User } = models;
  const passwordHash = await hashPassword(superAdminPassword);

  const [superAdmin, created] = await User.findOrCreate({
    where: { email: superAdminEmail },
    defaults: {
      name: superAdminName,
      email: superAdminEmail,
      password_hash: passwordHash,
      role: 'SuperAdmin',
      is_active: true,
    },
  });

  if (created) {
    logger.info(`✅ SuperAdmin seeded: ${superAdminEmail}`);
  } else {
    logger.info(`⚠️  SuperAdmin already exists: ${superAdminEmail}`);
  }

  // Step 4: Update Tenant record with db_name
  await Tenant.update({ db_name: dbName }, { where: { id: tenantId } });
  logger.info(`✅ Tenant record updated with db_name: ${dbName}`);

  return { dbName, superAdminId: superAdmin.id };
};

/**
 * Drops the tenant database entirely.
 * Use only on permanent tenant deletion.
 */
const deprovisionTenantDatabase = async (dbName) => {
  const config = require('../config');
  const { Sequelize } = require('sequelize');

  const adminConn = new Sequelize('postgres', config.tenantDb.username, config.tenantDb.password, {
    host: config.tenantDb.host,
    port: config.tenantDb.port,
    dialect: 'postgres',
    logging: false,
  });

  // Terminate all active connections to the DB first
  await adminConn.query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = '${dbName}' AND pid <> pg_backend_pid()
  `);

  await adminConn.query(`DROP DATABASE IF EXISTS "${dbName}"`);
  await adminConn.close();

  logger.info(`🗑️  Tenant database dropped: ${dbName}`);
};

module.exports = { provisionTenantDatabase, deprovisionTenantDatabase };
