// =============================================================================
// Notification Service - Server Entry Point
// =============================================================================

import app from "./app.js";

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3006;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start Notification Service:", error);
    process.exit(1);
  }
};

startServer();
