// =============================================================================
// Interactive Speaking Session - Redis State Manager
// =============================================================================

import { redisService } from "../../services/redis.service.js";
import { ConversationTurn } from "../../llm/gemini.client.js";

const SESSION_PREFIX = "speaking:session:";
const SESSION_TTL = 30 * 60; // 30 minutes

export interface SessionState {
  sessionId: string;
  userId: string;
  currentPart: number;
  currentStep: number;
  topic: string;
  topicBank?: {
    id: string;
    part1Questions: string[];
    part2Topic: string | null;
    part2Bullets: string[];
    part2FinalPrompt: string | null;
    part3Questions: string[];
  } | null;
  cueCard?: {
    topic: string;
    bulletPoints: string[];
    finalPrompt: string;
  };
  conversationHistory: ConversationTurn[];
  partTranscripts: {
    part1: string[];
    part2: string[];
    part3: string[];
  };
}

export class SpeakingSessionState {
  /**
   * Save session state to Redis
   */
  static async save(state: SessionState): Promise<void> {
    const redis = redisService.getClient();
    const key = `${SESSION_PREFIX}${state.sessionId}`;
    await redis.set(key, JSON.stringify(state), { EX: SESSION_TTL });
  }

  /**
   * Load session state from Redis
   */
  static async load(sessionId: string): Promise<SessionState | null> {
    const redis = redisService.getClient();
    const key = `${SESSION_PREFIX}${sessionId}`;
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as SessionState;
  }

  /**
   * Delete session state from Redis
   */
  static async delete(sessionId: string): Promise<void> {
    const redis = redisService.getClient();
    const key = `${SESSION_PREFIX}${sessionId}`;
    await redis.del(key);
  }

  /**
   * Create initial session state
   */
  static createInitial(sessionId: string, userId: string, topic: string): SessionState {
    return {
      sessionId,
      userId,
      currentPart: 1,
      currentStep: 0,
      topic,
      conversationHistory: [],
      partTranscripts: {
        part1: [],
        part2: [],
        part3: [],
      },
    };
  }
}

export default SpeakingSessionState;
