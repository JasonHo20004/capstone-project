// =============================================================================
// Assessment Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";

const PORT = process.env.ASSESSMENT_SERVICE_PORT || 3003;

const startServer = async () => {
  try {
    await databaseService.connect();
    app.listen(PORT, () => {
      console.log(`🚀 Assessment Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Tests API: http://localhost:${PORT}/api/tests`);
      console.log(`🎯 Sessions API: http://localhost:${PORT}/api/sessions`);
    });
  } catch (error) {
    console.error("Failed to start Assessment Service:", error);
    process.exit(1);
  }
};

startServer();
