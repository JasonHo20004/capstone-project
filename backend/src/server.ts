import app from './app.js'; 
import dotenv from 'dotenv';
import { databaseService } from './services/database.service.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();
    
    // Start server by listening on the specified port
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
      console.log(`🔗 Users endpoint available at http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown logic
async function shutdown() {
  console.log('\n gracefully shutting down...');
  await databaseService.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
startServer();