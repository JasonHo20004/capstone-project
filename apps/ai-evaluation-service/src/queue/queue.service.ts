// =============================================================================
// AI Evaluation Service - BullMQ Queue Service
// =============================================================================

import { Queue, QueueEvents } from "bullmq";
import { EvaluationJobData } from "./types.js";
import { getBullMQConnection } from "./redis-connection.js";

const QUEUE_NAME = "ai-evaluation-queue";

class QueueService {
  private static instance: QueueService;
  private queue: Queue;
  private queueEvents: QueueEvents;

  private constructor() {
    const connection = getBullMQConnection();

    this.queue = new Queue(QUEUE_NAME, { connection });
    this.queueEvents = new QueueEvents(QUEUE_NAME, { connection });

    console.log("✅ [AI Evaluation Service] BullMQ queue initialized");
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  /**
   * Add an evaluation job to the queue
   */
  public async addJob(data: EvaluationJobData): Promise<string> {
    const job = await this.queue.add(data.type, data, {
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 5000, // 5s delay between retries
      },
      removeOnComplete: {
        count: 100, // Keep last 100 completed jobs
      },
      removeOnFail: {
        count: 50, // Keep last 50 failed jobs
      },
    });

    console.log(`📥 [Queue] Added job ${job.id} (${data.type}) for user ${data.userId}`);
    return job.id!;
  }

  /**
   * Get job status
   */
  public async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return {
      id: job.id,
      type: job.name,
      state,
      progress: job.progress,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
    };
  }

  public getQueue(): Queue {
    return this.queue;
  }

  public async close(): Promise<void> {
    await this.queue.close();
    await this.queueEvents.close();
  }
}

export const queueService = QueueService.getInstance();
export default queueService;
