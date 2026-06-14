// =============================================================================
// Interactive Speaking Session - Service Layer
// =============================================================================

import { databaseService } from "../../services/database.service.js";
import { geminiClient, extractJson, ConversationTurn } from "../../llm/gemini.client.js";
import { llmClient } from "../../llm/llm.client.js";
import {
  EXAMINER_PART1_PROMPT,
  EXAMINER_PART2_PROMPT,
  EXAMINER_PART3_PROMPT,
  SPEAKING_FINAL_GRADING_PROMPT,
} from "../../llm/prompts.js";
import { SpeakingSessionState, SessionState } from "./speaking-session.state.js";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PART1_MAX_QUESTIONS = 5;
const PART2_MAX_FOLLOWUPS = 2;
const PART3_MAX_QUESTIONS = 6;

// Fallback topics when no admin topics exist in DB
const FALLBACK_TOPICS = [
  "Hometown and Living",
  "Work and Studies",
  "Daily Routine",
  "Hobbies and Free Time",
  "Technology",
  "Travel and Holidays",
  "Food and Cooking",
  "Health and Fitness",
  "Friends and Family",
  "Music and Entertainment",
  "Reading and Books",
  "Shopping",
  "Weather and Seasons",
  "Animals and Nature",
  "Sports",
];

// Topic data interface for hybrid mode
interface TopicBankData {
  id: string;
  part1Questions: string[];
  part2Topic: string | null;
  part2Bullets: string[];
  part2FinalPrompt: string | null;
  part3Questions: string[];
}

// ─── Service ───────────────────────────────────────────────────────────────────

export class SpeakingSessionService {
  /**
   * Start a new interactive speaking session
   */
  static async startSession(userId: string, topic?: string): Promise<{
    sessionId: string;
    question: string;
    currentPart: number;
    topic: string;
  }> {
    const prisma = databaseService.getClient();

    // Try to fetch a random active topic from the DB
    let topicBank: TopicBankData | null = null;
    let selectedTopic: string;
    let topicId: string | null = null;

    if (topic) {
      // User specified a topic — try to find it in DB
      const dbTopic = await prisma.speakingTopic.findFirst({
        where: { title: topic, isActive: true },
      });
      if (dbTopic) {
        topicBank = {
          id: dbTopic.id,
          part1Questions: dbTopic.part1Questions as string[],
          part2Topic: dbTopic.part2Topic,
          part2Bullets: dbTopic.part2Bullets as string[],
          part2FinalPrompt: dbTopic.part2FinalPrompt,
          part3Questions: dbTopic.part3Questions as string[],
        };
        topicId = dbTopic.id;
      }
      selectedTopic = topic;
    } else {
      // No topic specified — pick random from DB (active topics)
      const activeTopics = await prisma.speakingTopic.findMany({
        where: { isActive: true },
      });

      if (activeTopics.length > 0) {
        const randomDbTopic = activeTopics[Math.floor(Math.random() * activeTopics.length)];
        topicBank = {
          id: randomDbTopic.id,
          part1Questions: randomDbTopic.part1Questions as string[],
          part2Topic: randomDbTopic.part2Topic,
          part2Bullets: randomDbTopic.part2Bullets as string[],
          part2FinalPrompt: randomDbTopic.part2FinalPrompt,
          part3Questions: randomDbTopic.part3Questions as string[],
        };
        topicId = randomDbTopic.id;
        selectedTopic = randomDbTopic.title;
      } else {
        // Fallback: no DB topics, use random from hardcoded list
        selectedTopic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
      }
    }

    // Create DB record
    const session = await prisma.speakingSession.create({
      data: {
        userId,
        topicId,
        topic: selectedTopic,
        currentPart: 1,
        currentStep: 0,
        status: "IN_PROGRESS",
        turns: [],
      },
    });

    // Generate first question — from bank or AI
    let firstQuestion: string;
    if (topicBank && topicBank.part1Questions.length > 0) {
      firstQuestion = topicBank.part1Questions[0];
    } else {
      firstQuestion = await this.generateExaminerQuestion(1, selectedTopic, [], 0);
    }

    // Initialize Redis state (with topic bank data)
    const state = SpeakingSessionState.createInitial(session.id, userId, selectedTopic);
    state.topicBank = topicBank; // Attach bank data to state
    state.conversationHistory.push({
      role: "model",
      parts: [{ text: firstQuestion }],
    });
    await SpeakingSessionState.save(state);

    // Save first turn to DB
    await prisma.speakingSession.update({
      where: { id: session.id },
      data: {
        turns: [
          { role: "examiner", content: firstQuestion, timestamp: new Date().toISOString() },
        ] as any,
      },
    });

    return {
      sessionId: session.id,
      question: firstQuestion,
      currentPart: 1,
      topic: selectedTopic,
    };
  }

  /**
   * Process user's audio response and generate next question
   */
  static async respondToQuestion(
    sessionId: string,
    audioBase64: string,
    audioMimeType: string = "audio/webm",
    audioUrl?: string
  ): Promise<{
    transcript: string;
    nextQuestion: string | null;
    currentPart: number;
    currentStep: number;
    isSessionComplete: boolean;
    cueCard?: any;
    audioUrl?: string;
  }> {
    const prisma = databaseService.getClient();

    // Load state from Redis (or DB fallback)
    let state = await SpeakingSessionState.load(sessionId);
    if (!state) {
      // Fallback: reconstruct from DB
      const dbSession = await prisma.speakingSession.findUnique({
        where: { id: sessionId },
      });
      if (!dbSession) throw new Error("Session not found");
      if (dbSession.status !== "IN_PROGRESS") throw new Error("Session is not active");

      state = {
        sessionId,
        userId: dbSession.userId,
        currentPart: dbSession.currentPart,
        currentStep: dbSession.currentStep,
        topic: dbSession.topic ?? "",
        cueCard: dbSession.cueCard as any,
        conversationHistory: [],
        partTranscripts: { part1: [], part2: [], part3: [] },
      };
    }

    // STT: transcribe audio with Groq Whisper-large-v3 (much better than Gemini for accents)
    let transcript = "";
    try {
      const audioBuffer = Buffer.from(audioBase64, "base64");
      const audioBlob = new Blob([audioBuffer as any], { type: audioMimeType });
      const sttResult = await llmClient.transcribeAudio(audioBlob, "audio.webm");
      transcript = (sttResult.transcript || "").trim();
      console.log(`[Speaking] Whisper STT (${sttResult.duration}s): "${transcript.slice(0, 80)}${transcript.length > 80 ? "..." : ""}"`);
    } catch (sttError: any) {
      console.error("[Speaking] Whisper STT failed:", sttError?.message || sttError);
      transcript = "(audio unclear)";
    }

    // Push transcribed text (not raw audio) to conversation history.
    // Text-only history is cheaper, faster, and gives Gemini cleaner context for grading.
    state.conversationHistory.push({
      role: "user",
      parts: [{ text: transcript }],
    });

    // Get current part's prompt
    const prompt = this.getPartPrompt(state.currentPart);

    // Build context for Gemini
    const contextMessage = this.buildContextMessage(state);

    // Send to Gemini: conversation history + context
    const systemPrompt = `${prompt}\n\n## Session Context:\n- Topic: "${state.topic}"\n- Current Part: ${state.currentPart}\n- Question Number: ${state.currentStep + 1}\n${contextMessage}\n\nNote: The candidate's responses below are already transcribed text (from Whisper STT). You do NOT need to transcribe — just react and generate the next examiner question.`;

    const response = await geminiClient.conversationCompletion(
      systemPrompt,
      state.conversationHistory,
      { temperature: 0.5 }
    );

    const parsed = extractJson(response);

    // Track transcript per part
    const partKey = `part${state.currentPart}` as keyof typeof state.partTranscripts;
    state.partTranscripts[partKey].push(transcript);

    // Update step count
    state.currentStep++;

    // Determine part transitions
    let isSessionComplete = false;
    let nextQuestion: string | null = null;
    let cueCard: any = undefined;

    if (parsed.shouldEndPart || this.shouldEndPart(state)) {
      if (state.currentPart === 1) {
        // Transition to Part 2
        state.currentPart = 2;
        state.currentStep = 0;

        // Generate Part 2 cue card (from bank or AI)
        const topicBank = state.topicBank;
        let part2Response: { question: string; cueCard: any };

        if (topicBank?.part2Topic) {
          // Use admin-created cue card
          part2Response = {
            question: "Here is your topic card. You have 1 minute to prepare, then please speak for 1-2 minutes.",
            cueCard: {
              topic: topicBank.part2Topic,
              bulletPoints: topicBank.part2Bullets || [],
              finalPrompt: topicBank.part2FinalPrompt || "Explain why this was significant to you.",
            },
          };
        } else {
          part2Response = await this.generatePart2CueCard(state.topic, state.conversationHistory);
        }
        cueCard = part2Response.cueCard;
        nextQuestion = part2Response.question;
        state.cueCard = cueCard;

        state.conversationHistory.push({
          role: "model",
          parts: [{ text: nextQuestion }],
        });
      } else if (state.currentPart === 2) {
        // Transition to Part 3
        state.currentPart = 3;
        state.currentStep = 0;

        const topicBank3 = state.topicBank;
        if (topicBank3 && topicBank3.part3Questions.length > 0) {
          nextQuestion = topicBank3.part3Questions[0];
        } else {
          nextQuestion = await this.generateExaminerQuestion(
            3,
            state.topic,
            state.conversationHistory,
            0
          );
        }

        state.conversationHistory.push({
          role: "model",
          parts: [{ text: nextQuestion }],
        });
      } else if (state.currentPart === 3) {
        // Session complete
        isSessionComplete = true;
        nextQuestion = null;
      }
    } else {
      // Generate next question: bank first, then AI fallback
      const topicBankNext = state.topicBank;
      const bankQuestions = state.currentPart === 1
        ? topicBankNext?.part1Questions
        : state.currentPart === 3
        ? topicBankNext?.part3Questions
        : undefined;

      if (bankQuestions && state.currentStep < bankQuestions.length) {
        nextQuestion = bankQuestions[state.currentStep];
      } else {
        nextQuestion = parsed.question || await this.generateExaminerQuestion(
          state.currentPart,
          state.topic,
          state.conversationHistory,
          state.currentStep
        );
      }

      if (nextQuestion) {
        state.conversationHistory.push({
          role: "model",
          parts: [{ text: nextQuestion }],
        });
      }
    }

    // Save state to Redis
    await SpeakingSessionState.save(state);

    // Update DB
    const dbTurns = (await prisma.speakingSession.findUnique({
      where: { id: sessionId },
      select: { turns: true },
    }))?.turns as any[] || [];

    dbTurns.push(
      { role: "candidate", content: transcript, audioUrl: audioUrl || undefined, timestamp: new Date().toISOString() }
    );
    if (nextQuestion) {
      dbTurns.push(
        { role: "examiner", content: nextQuestion, timestamp: new Date().toISOString() }
      );
    }

    await prisma.speakingSession.update({
      where: { id: sessionId },
      data: {
        currentPart: state.currentPart,
        currentStep: state.currentStep,
        turns: dbTurns as any,
        cueCard: state.cueCard as any,
        ...(isSessionComplete ? { status: "GRADING" } : {}),
      },
    });

    // If session complete, trigger grading
    if (isSessionComplete) {
      // Fire and forget grading (async)
      this.gradeSession(sessionId, state).catch((err) => {
        console.error(`❌ [Speaking Session] Grading failed for ${sessionId}:`, err);
      });
    }

    return {
      transcript,
      nextQuestion,
      currentPart: state.currentPart,
      currentStep: state.currentStep,
      isSessionComplete,
      cueCard,
      audioUrl,
    };
  }

  /**
   * Manually finish/end the session and trigger grading
   */
  static async finishSession(sessionId: string): Promise<void> {
    const prisma = databaseService.getClient();

    const session = await prisma.speakingSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new Error("Session not found");
    if (session.status === "COMPLETED") throw new Error("Session already completed");

    await prisma.speakingSession.update({
      where: { id: sessionId },
      data: { status: "GRADING" },
    });

    // Load state and grade
    const state = await SpeakingSessionState.load(sessionId);
    if (state) {
      await this.gradeSession(sessionId, state);
    }
  }

  /**
   * Get session result
   */
  static async getResult(sessionId: string) {
    const prisma = databaseService.getClient();
    return prisma.speakingSession.findUnique({
      where: { id: sessionId },
    });
  }

  /**
   * List user sessions
   */
  static async listUserSessions(userId: string) {
    const prisma = databaseService.getClient();
    return prisma.speakingSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        topic: true,
        currentPart: true,
        status: true,
        overallBand: true,
        createdAt: true,
        completedAt: true,
      },
    });
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Generate an examiner question using Gemini
   */
  private static async generateExaminerQuestion(
    part: number,
    topic: string,
    history: ConversationTurn[],
    questionNumber: number
  ): Promise<string> {
    const prompt = this.getPartPrompt(part);
    const systemPrompt = `${prompt}\n\nTopic: "${topic}"\nThis is question ${questionNumber + 1} of Part ${part}.`;

    if (history.length === 0) {
      // First question — use simple text generation
      const response = await geminiClient.chatCompletion(
        systemPrompt,
        `Generate the first question for Part ${part} of an IELTS Speaking test about the topic "${topic}".`,
      );
      const parsed = extractJson(response);
      return parsed.question;
    }

    // Follow-up question — use conversation history
    const response = await geminiClient.conversationCompletion(
      systemPrompt,
      history,
    );
    const parsed = extractJson(response);
    return parsed.question;
  }

  /**
   * Generate Part 2 cue card
   */
  private static async generatePart2CueCard(
    topic: string,
    history: ConversationTurn[]
  ): Promise<{ question: string; cueCard: any }> {
    const response = await geminiClient.chatCompletion(
      EXAMINER_PART2_PROMPT,
      `Generate a Part 2 cue card related to the topic "${topic}". The candidate has just finished Part 1.`,
    );
    const parsed = extractJson(response);
    return {
      question: parsed.question || "Here is your topic card. You have 1 minute to prepare, then please speak for 1-2 minutes.",
      cueCard: {
        topic: parsed.topic,
        bulletPoints: parsed.bulletPoints,
        finalPrompt: parsed.finalPrompt,
      },
    };
  }

  /**
   * Grade the complete session
   */
  private static async gradeSession(sessionId: string, state: SessionState): Promise<void> {
    const prisma = databaseService.getClient();

    try {
      console.log(`🏆 [Speaking Session] Grading session ${sessionId}...`);

      // Send entire conversation to Gemini for final grading
      const response = await geminiClient.conversationCompletion(
        SPEAKING_FINAL_GRADING_PROMPT,
        state.conversationHistory,
        { temperature: 0.3, maxTokens: 30000 }
      );

      const result = extractJson(response);

      // Save scores to DB
      await prisma.speakingSession.update({
        where: { id: sessionId },
        data: {
          overallBand: result.overall_band,
          fluencyScore: result.criteria?.fluency_coherence?.score,
          lexicalScore: result.criteria?.lexical_resource?.score,
          grammarScore: result.criteria?.grammatical_range?.score,
          pronunciationScore: result.criteria?.pronunciation?.score,
          detailedFeedback: result as any,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Cleanup Redis state
      await SpeakingSessionState.delete(sessionId);

      console.log(`✅ [Speaking Session] Session ${sessionId} graded — Band ${result.overall_band}`);

      // Notify user
      try {
        const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006";
        await fetch(`${notificationUrl}/api/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: state.userId,
            title: "Speaking Session Graded",
            message: `Your IELTS Speaking session has been graded. You scored Band ${result.overall_band}.`,
            type: "AI_GRADING",
            metadata: { sessionId, overallBand: result.overall_band },
          }),
        });
      } catch (notifyErr) {
        console.warn("⚠️ [Speaking Session] Failed to send notification:", notifyErr);
      }
    } catch (error) {
      console.error(`❌ [Speaking Session] Grading failed for ${sessionId}:`, error);

      await prisma.speakingSession.update({
        where: { id: sessionId },
        data: { status: "ABANDONED" },
      });
    }
  }

  /**
   * Get the prompt for a specific part
   */
  private static getPartPrompt(part: number): string {
    switch (part) {
      case 1:
        return EXAMINER_PART1_PROMPT;
      case 2:
        return EXAMINER_PART2_PROMPT;
      case 3:
        return EXAMINER_PART3_PROMPT;
      default:
        return EXAMINER_PART1_PROMPT;
    }
  }

  /**
   * Determine if current part should end based on question count
   */
  private static shouldEndPart(state: SessionState): boolean {
    switch (state.currentPart) {
      case 1:
        return state.currentStep >= PART1_MAX_QUESTIONS;
      case 2:
        return state.currentStep >= PART2_MAX_FOLLOWUPS + 1; // long turn + follow-ups
      case 3:
        return state.currentStep >= PART3_MAX_QUESTIONS;
      default:
        return false;
    }
  }

  /**
   * Build context message for Gemini
   */
  private static buildContextMessage(state: SessionState): string {
    const parts: string[] = [];

    if (state.currentPart >= 2 && state.cueCard) {
      parts.push(`- Part 2 Cue Card Topic: "${state.cueCard.topic}"`);
    }

    const maxQuestions = state.currentPart === 1
      ? PART1_MAX_QUESTIONS
      : state.currentPart === 2
      ? PART2_MAX_FOLLOWUPS + 1
      : PART3_MAX_QUESTIONS;

    parts.push(`- Max questions for this part: ${maxQuestions}`);
    parts.push(`- Questions asked so far: ${state.currentStep}`);

    return parts.join("\n");
  }
}

export default SpeakingSessionService;
