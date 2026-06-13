const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB().then(() => {
  // Start server
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
    console.log(`🔗 Base URL: ${env.BASE_URL}`);
    console.log(`💻 Client URL: ${env.CLIENT_URL}`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
});
