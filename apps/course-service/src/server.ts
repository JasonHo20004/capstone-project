// =============================================================================
// Course Service - Server Entry Point
// =============================================================================

import "dotenv/config";
import app from "./app.js";
import { databaseService } from "./services/database.service.js";
import { EventBusService, EventNames, OrderPaidEvent } from "@capstone/common";
import { CourseService } from "./modules/courses/services/course.service.js";
import { startNotificationCron } from "./helpers/notification.cron.js";

const PORT = process.env.COURSE_SERVICE_PORT || 3002;
const SERVICE_NAME = "course-service";

let eventBus: EventBusService;

export function getEventBus(): EventBusService {
  return eventBus;
}

async function setupEventHandlers() {
  const courseService = new CourseService();

  // Listen for payment success events to grant course access
  await eventBus.subscribe<OrderPaidEvent>(EventNames.ORDER_PAID, async (event) => {
    console.log(`📥 [${SERVICE_NAME}] Received ORDER_PAID event for user ${event.payload.userId}`);

    for (const courseId of event.payload.courseIds) {
      console.log(`🔓 [${SERVICE_NAME}] Granting access to course ${courseId} for user ${event.payload.userId}`);
      await courseService.grantAccess(event.payload.userId, courseId, event.payload.orderId);
    }
  });
}

async function startServer() {
  try {
    // Connect to database
    await databaseService.connect();

    // Initialize Event Bus
    eventBus = EventBusService.getInstance(SERVICE_NAME);
    await eventBus.connect();

    // Setup event handlers
    await setupEventHandlers();

    // Start notification outbox cron
    startNotificationCron();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 [${SERVICE_NAME}] Server is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Courses API: http://localhost:${PORT}/api/courses`);
    });
  } catch (error) {
    console.error(`❌ [${SERVICE_NAME}] Failed to start server:`, error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log(`🚧 [${SERVICE_NAME}] Shutting down...`);
  
  try {
    await databaseService.disconnect();
  } catch (err) {
    console.error("Error disconnecting database:", err);
  }

  try {
    if (eventBus) {
      await eventBus.disconnect();
    }
  } catch (err) {
    console.error("Error disconnecting Event Bus:", err);
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
