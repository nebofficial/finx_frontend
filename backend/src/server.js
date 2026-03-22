require('dotenv').config();
const app = require('./app');
const { connectMainDb } = require('./config/mainDb');
const logger = require('./utils/logger');
const config = require('./config');

const PORT = config.port;

const startServer = async () => {
  try {
    // 1 — Connect to Main (Platform) DB and sync models
    await connectMainDb();

    // 2 — Seed default plans if they don't exist
    await seedDefaultData();

    // 3 — Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 FinX Backend running on port ${PORT} [${config.nodeEnv}]`);
      logger.info(`📋 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 API base:     http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

const seedDefaultData = async () => {
  try {
    const Plan = require('./models/main/Plan');
    const SystemUser = require('./models/main/SystemUser');
    const { hashPassword } = require('./utils/helpers');

    // Seed default subscription plans
    const plans = [
      { name: 'Trial', price_monthly: 0, price_yearly: 0, max_users: 5, max_branches: 1, max_members: 50, trial_days: 14, features: { sms: false, api_access: false, reports: true } },
      { name: 'Basic', price_monthly: 999, price_yearly: 9990, max_users: 20, max_branches: 3, max_members: 500, features: { sms: true, api_access: false, reports: true } },
      { name: 'Premium', price_monthly: 2999, price_yearly: 29990, max_users: -1, max_branches: -1, max_members: -1, features: { sms: true, api_access: true, reports: true } },
    ];

    for (const plan of plans) {
      await Plan.findOrCreate({ where: { name: plan.name }, defaults: plan });
    }
    logger.info('✅ Default plans seeded.');

    // Seed default SystemAdmin (only if none exists)
    const adminExists = await SystemUser.findOne({ where: { role: 'SystemAdmin' } });
    if (!adminExists) {
      const password_hash = await hashPassword('Admin@123456');
      await SystemUser.create({
        name: 'System Administrator',
        email: 'admin@finx.com',
        password_hash,
        role: 'SystemAdmin',
        is_active: true,
        must_change_password: true,
      });
      logger.info('✅ Default SystemAdmin seeded: admin@finx.com / Admin@123456');
      logger.warn('⚠️  IMPORTANT: Change the default SystemAdmin password immediately!');
    }
  } catch (err) {
    logger.warn('Seed data skipped (may already exist):', err.message);
  }
};

// Handle process signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});

startServer();
