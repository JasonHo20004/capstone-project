// =============================================================================
// Assessment Service - Server Entry Point
// =============================================================================

import app from "./app.js";

const PORT = process.env.ASSESSMENT_SERVICE_PORT || 3003;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Assessment Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start Assessment Service:", error);
    process.exit(1);
  }
};

startServer();
