require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config');
const logger = require('./utils/logger');
const { sendError, sendNotFound } = require('./utils/response');
const routes = require('./routes');

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Keep local development and billing dashboards usable under hot reload.
  skip: (req) => {
    const isDev = config.nodeEnv === 'development';
    // Avoid blocking login / auth during local dev (retries, hot reload).
    if (isDev && req.originalUrl.startsWith('/api/v1/auth')) return true;
    // Billing/support dashboards issue many parallel GETs; don't throttle read-only platform APIs.
    if (req.method === 'GET' && req.originalUrl.startsWith('/api/v1/system/billing')) return true;
    if (req.method === 'GET' && req.originalUrl.startsWith('/api/v1/system/support')) return true;
    return false;
  },
});
app.use('/api/', limiter);

// ── Request Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
app.use(morgan('dev', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── Static Files (uploads) ──
app.use('/uploads', express.static(path.join(__dirname, '..', config.upload.dir)));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FinX Backend is healthy ✅',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// ── API Routes ──
app.use('/api/v1', routes);

// ── 404 Handler ──
app.use((req, res) => {
  return sendNotFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err?.stack || err?.message || err);
  const statusCode = err.status || err.statusCode || 500;
  const msg =
    (typeof err?.message === 'string' && err.message.trim()) ||
    (err && String(err)) ||
    'Internal server error';
  return sendError(res, msg, statusCode);
});

module.exports = app;
