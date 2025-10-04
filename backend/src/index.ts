import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { databaseService } from './services';
import { UserRepository } from './repositories';
// import { UserRole } from '../generated/prisma';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize repository
const userRepository = new UserRepository();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.get('/api/health', async (_req, res) => {
  try {
    const isHealthy = await databaseService.healthCheck();
    res.json({ 
      status: isHealthy ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      database: isHealthy ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Example User routes (for demonstration)
app.get('/api/users', async (_req, res) => {
  try {
    const users = await userRepository.findAll();
    const userProfiles = users.map(user => userRepository.toProfileDto(user));
    
    res.json({
      success: true,
      data: userProfiles,
      count: userProfiles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();
    
    // Start server
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` Health check available at http://localhost:${PORT}/api/health`);
      console.log(` Users endpoint available at http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\ Shutting down server...');
  await databaseService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n Shutting down server...');
  await databaseService.disconnect();
  process.exit(0);
});

// Start the server
startServer();
