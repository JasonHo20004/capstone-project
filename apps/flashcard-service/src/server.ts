// =============================================================================
// Flashcard Service - Server Entry Point
// =============================================================================

import app from "./app.js";

const PORT = process.env.FLASHCARD_SERVICE_PORT || 3004;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Flashcard Service running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start Flashcard Service:", error);
    process.exit(1);
  }
};

startServer();
