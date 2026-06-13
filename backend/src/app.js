const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const urlRoutes = require('./routes/url.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const redirectRoutes = require('./routes/redirect.routes');
const { getPublicStats, shortCodeParamSchema } = require('./controllers/analytics.controller');
const validate = require('./middleware/validate.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

// CORS configuration matching client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public Stats endpoint
app.get(
  '/api/public/:shortCode/stats',
  validate(shortCodeParamSchema),
  getPublicStats
);

// Root level redirect handler (mounted at bottom so api routes take precedence)
app.use('/', redirectRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
