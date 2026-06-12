// =============================================================================
// AI Evaluation Service - Mini Quiz Service
// AI-generated quizzes with mixed skills for skill tree nodes
// =============================================================================

import { databaseService } from "../../services/database.service.js";
import geminiClient, { extractJson } from "../../llm/gemini.client.js";
import { GENERATE_MINI_QUIZ_PROMPT } from "../skill-tree/skill-tree.prompts.js";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MiniQuizQuestion {
  question: string;
  type: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  skill: string;
  tag: string;
}

interface GenerateQuizInput {
  userId: string;
  skillTreeId: string;
  nodeId: string;
  topic: string;
  level: string;
  nodeLabel: string;
  nodeDescription: string;
  mixedSkills: string[];
  questionTypes: string[];
  questionCount?: number;
}

interface SubmitQuizInput {
  quizId: string;
  answers: Array<{
    questionIndex: number;
    selectedIndex?: number;
    answerText?: string;
  }>;
}

// ─── Service ────────────────────────────────────────────────────────────────────

class MiniQuizService {
  /**
   * Generate a mini quiz for a skill tree node using AI
   */
  async generateQuiz(input: GenerateQuizInput) {
    const {
      userId,
      skillTreeId,
      nodeId,
      topic,
      level,
      nodeLabel,
      nodeDescription,
      mixedSkills,
      questionTypes,
      questionCount = 6,
    } = input;

    const prisma = databaseService.getClient();

    // Check if a pending quiz already exists for this node
    const existing = await prisma.miniQuiz.findFirst({
      where: { userId, skillTreeId, nodeId, status: "PENDING" },
    });

    if (existing) {
      return existing;
    }

    // Ask AI to generate questions
    const userMessage = JSON.stringify({
      topic,
      level,
      nodeLabel,
      nodeDescription,
      mixedSkills,
      questionTypes,
      questionCount: Math.min(questionCount, 10),
    });

    const aiResponse = await geminiClient.chatCompletion(
      GENERATE_MINI_QUIZ_PROMPT,
      userMessage,
      { temperature: 0.7 }
    );

    const parsed = extractJson(aiResponse);
    const questions: MiniQuizQuestion[] = parsed.questions;

    // Save quiz to database
    const quiz = await prisma.miniQuiz.create({
      data: {
        userId,
        skillTreeId,
        nodeId,
        questions: questions as any,
        totalQuestions: questions.length,
        status: "PENDING",
      },
    });

    return quiz;
  }

  /**
   * Get a quiz by ID
   */
  async getQuiz(quizId: string) {
    const prisma = databaseService.getClient();
    return prisma.miniQuiz.findUnique({ where: { id: quizId } });
  }

  /**
   * Submit quiz answers, grade, and return results
   */
  async submitQuiz({ quizId, answers }: SubmitQuizInput) {
    const prisma = databaseService.getClient();

    const quiz = await prisma.miniQuiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    if (quiz.status === "COMPLETED") {
      throw new Error("Quiz already completed");
    }

    const questions = quiz.questions as unknown as MiniQuizQuestion[];

    // Grade each answer
    const gradedAnswers = answers.map((answer) => {
      const question = questions[answer.questionIndex];
      if (!question) {
        return { ...answer, isCorrect: false };
      }

      let isCorrect = false;

      if (question.correctIndex !== undefined && answer.selectedIndex !== undefined) {
        isCorrect = answer.selectedIndex === question.correctIndex;
      } else if (question.correctAnswer && answer.answerText) {
        isCorrect =
          answer.answerText.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase();
      }

      return { ...answer, isCorrect };
    });

    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const score = (correctCount / questions.length) * 100;

    // Build wrongAnswers for skill tree branching
    const wrongAnswers = gradedAnswers
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const q = questions[a.questionIndex];
        return {
          question: q?.question || "",
          userAnswer: a.answerText || (q?.options?.[a.selectedIndex ?? -1] ?? ""),
          correctAnswer:
            q?.correctAnswer ||
            (q?.options?.[q?.correctIndex ?? -1] ?? ""),
          skill: q?.skill || "",
          tag: q?.tag || "",
        };
      });

    // Update quiz in database
    const updated = await prisma.miniQuiz.update({
      where: { id: quizId },
      data: {
        userAnswers: gradedAnswers as any,
        score,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return {
      quiz: updated,
      score,
      correctCount,
      totalQuestions: questions.length,
      wrongAnswers,
    };
  }
}

export const miniQuizService = new MiniQuizService();
