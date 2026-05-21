import { databaseService } from "../../services/database.service.js";
import { placementRepository } from "./placement.repository.js";
import { identityClient } from "../../clients/identity.client.js";
import type { PlacementQuestion } from "../../../generated/prisma/index.js";
import type { SubmitExamInput } from "./placement.schema.js";

const DIFFICULTY_WEIGHTS: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

const SECTION_MAX = { 1: 48, 2: 18, 3: 19 } as const;
const TOTAL_MAX = 85;

const LEVEL_MAP = [
  { min: 0, max: 15, level: "Pre-A1", label: "Beginner" },
  { min: 16, max: 30, level: "A1", label: "Elementary" },
  { min: 31, max: 45, level: "A2", label: "Pre-Intermediate" },
  { min: 46, max: 60, level: "B1", label: "Intermediate" },
  { min: 61, max: 78, level: "B2", label: "Upper-Intermediate" },
  { min: 79, max: 90, level: "C1", label: "Advanced" },
  { min: 91, max: 100, level: "C2", label: "Proficiency" },
];

function mapToLevel(percentage: number) {
  return (
    LEVEL_MAP.find((l) => percentage >= l.min && percentage <= l.max) ??
    LEVEL_MAP[LEVEL_MAP.length - 1]
  );
}

interface QuestionPayload {
  id: string;
  type: string;
  instruction: string;
  context?: string;
  prompt: string;
  time_limit: number;
  options?: { A: string; B: string; C: string };
  passage?: string;
  fixed_fragment?: string;
  fragments?: { A: string; B: string; C: string };
  audio_context?: string;
  audio_url?: string | null;
  audio_script?: string;
}

interface SectionPayload {
  section: number;
  title: string;
  instruction: string;
  time_per_question: number;
  questions: QuestionPayload[];
}

export class PlacementService {
  async generateExam(userId: string) {
    // Section 1: Grammar & Vocabulary (27)
    const s1EasyGrammar = await placementRepository.pickRandom({
      section: 1,
      difficulty: "easy",
      skillTagPrefix: "Grammar",
      count: 6,
    });
    const s1EasyVocab = await placementRepository.pickRandom({
      section: 1,
      difficulty: "easy",
      skillTagPrefix: "Vocabulary",
      count: 5,
    });
    const s1MedGrammar = await placementRepository.pickRandom({
      section: 1,
      difficulty: "medium",
      skillTagPrefix: "Grammar",
      count: 6,
    });
    const s1MedVocab = await placementRepository.pickRandom({
      section: 1,
      difficulty: "medium",
      skillTagPrefix: "Vocabulary",
      count: 5,
    });
    const s1HardGrammar = await placementRepository.pickRandom({
      section: 1,
      difficulty: "hard",
      skillTagPrefix: "Grammar",
      count: 3,
    });
    const s1HardVocab = await placementRepository.pickRandom({
      section: 1,
      difficulty: "hard",
      skillTagPrefix: "Vocabulary",
      count: 2,
    });

    const s1 = [
      ...shuffle([...s1EasyGrammar, ...s1EasyVocab]),
      ...shuffle([...s1MedGrammar, ...s1MedVocab]),
      ...shuffle([...s1HardGrammar, ...s1HardVocab]),
    ];

    // Section 2: Reading (11)
    const s2Heading = await placementRepository.pickRandom({
      section: 2,
      type: "heading_match",
      count: 5,
    });
    const s2ReorderMed = await placementRepository.pickRandom({
      section: 2,
      difficulty: "medium",
      type: "reorder",
      count: 5,
    });
    const s2ReorderHard = await placementRepository.pickRandom({
      section: 2,
      difficulty: "hard",
      type: "reorder",
      count: 1,
    });
    const s2 = [...s2Heading, ...s2ReorderMed, ...s2ReorderHard];

    // Section 3: Listening (12)
    const s3Easy = await placementRepository.pickRandom({
      section: 3,
      difficulty: "easy",
      count: 5,
    });
    const s3Medium = await placementRepository.pickRandom({
      section: 3,
      difficulty: "medium",
      count: 4,
    });
    const s3Hard = await placementRepository.pickRandom({
      section: 3,
      difficulty: "hard",
      count: 2,
    });
    const s3 = [...s3Easy, ...s3Medium, ...s3Hard];

    const allQuestions = [...s1, ...s2, ...s3];

    if (allQuestions.length < 50) {
      const err: Error & { code?: string; detail?: string } = new Error(
        "insufficient_questions"
      );
      err.code = "insufficient_questions";
      err.detail = `Only ${allQuestions.length} questions available; need 50.`;
      throw err;
    }

    const prisma = databaseService.getClient();
    const session = await prisma.placementSession.create({
      data: {
        userId,
        status: "in_progress",
        questionIds: allQuestions.map((q) => q.id),
      },
    });

    return {
      session_id: session.id,
      sections: this.buildSectionsPayload(s1, s2, s3),
    };
  }

  private buildSectionsPayload(
    s1: PlacementQuestion[],
    s2: PlacementQuestion[],
    s3: PlacementQuestion[]
  ): SectionPayload[] {
    return [
      {
        section: 1,
        title: "Grammar & Vocabulary",
        instruction: "Choose the correct option to complete each sentence.",
        time_per_question: 30,
        questions: s1.map((q) => this.toQuestionPayload(q)),
      },
      {
        section: 2,
        title: "Reading",
        instruction: "Read each passage and answer the question that follows.",
        time_per_question: 90,
        questions: s2.map((q) => this.toQuestionPayload(q)),
      },
      {
        section: 3,
        title: "Listening",
        instruction: "Listen to the audio and choose the correct answer.",
        time_per_question: 60,
        questions: s3.map((q) => this.toQuestionPayload(q)),
      },
    ];
  }

  private toQuestionPayload(q: PlacementQuestion): QuestionPayload {
    const base: QuestionPayload = {
      id: q.id,
      type: q.type,
      instruction: q.instruction,
      prompt: q.prompt,
      time_limit: q.timeLimit,
    };
    if (q.context) base.context = q.context;

    if (q.type === "reorder") {
      base.fixed_fragment = q.fixedFragment ?? "";
      base.fragments = {
        A: q.fragmentA ?? "",
        B: q.fragmentB ?? "",
        C: q.fragmentC ?? "",
      };
      return base;
    }

    // MCQ-style (fill_blank, heading_match, listening_mcq)
    base.options = {
      A: q.optionA ?? "",
      B: q.optionB ?? "",
      C: q.optionC ?? "",
    };
    if (q.type === "heading_match" && q.passage) {
      base.passage = q.passage;
    }
    if (q.type === "listening_mcq") {
      base.audio_context = q.audioContext ?? "";
      base.audio_url = q.audioUrl ?? null;
      base.audio_script = q.audioScript ?? "";
    }
    return base;
  }

  async submitExam(input: SubmitExamInput) {
    const prisma = databaseService.getClient();

    const session = await prisma.placementSession.findUnique({
      where: { id: input.sessionId },
    });
    if (!session) throw new Error("Session not found");
    if (session.userId !== input.userId) throw new Error("Unauthorized");
    if (session.status === "completed") throw new Error("Session already submitted");

    const questions = await placementRepository.findByIds(session.questionIds);
    const qById = new Map(questions.map((q) => [q.id, q]));

    const sectionScores: Record<number, { earned: number; max: number }> = {
      1: { earned: 0, max: SECTION_MAX[1] },
      2: { earned: 0, max: SECTION_MAX[2] },
      3: { earned: 0, max: SECTION_MAX[3] },
    };

    let totalEarned = 0;
    const answerRows: Array<{
      sessionId: string;
      questionId: string;
      questionIndex: number;
      selectedOption: string | null;
      selectedOrder: string | null;
      isCorrect: boolean;
      pointsEarned: number;
      timeSpent: number;
    }> = [];

    for (const a of input.answers) {
      const q = qById.get(a.question_id);
      if (!q) continue;

      const weight = DIFFICULTY_WEIGHTS[q.difficulty] ?? 1;
      let correct = false;

      if (q.type === "reorder") {
        correct = !!a.selected_order && a.selected_order === q.correctOrder;
      } else {
        correct = !!a.selected_option && a.selected_option === q.correctAnswer;
      }

      const pts = correct ? weight : 0;
      totalEarned += pts;
      const sectionKey = q.section as 1 | 2 | 3;
      if (sectionScores[sectionKey]) sectionScores[sectionKey].earned += pts;

      answerRows.push({
        sessionId: session.id,
        questionId: q.id,
        questionIndex: a.question_index,
        selectedOption: a.selected_option ?? null,
        selectedOrder: a.selected_order ?? null,
        isCorrect: correct,
        pointsEarned: pts,
        timeSpent: a.time_spent ?? 0,
      });
    }

    const percentage = (totalEarned / TOTAL_MAX) * 100;
    const level = mapToLevel(percentage);

    await databaseService.transaction(async (tx) => {
      const claim = await tx.placementSession.updateMany({
        where: { id: session.id, status: "in_progress" },
        data: {
          status: "completed",
          completedAt: new Date(),
          rawScore: totalEarned,
          maxScore: TOTAL_MAX,
          percentage: percentage.toFixed(2),
          cefrLevel: level.level,
          sectionScores: sectionScores as unknown as object,
        },
      });
      if (claim.count === 0) throw new Error("Session already submitted");

      if (answerRows.length > 0) {
        await tx.placementAnswer.createMany({ data: answerRows });
      }
    });

    // Best-effort: update User.englishLevel in identity-service
    identityClient.updateEnglishLevel(input.userId, level.level).catch((e) => {
      console.error("[placement] englishLevel sync failed:", e);
    });

    return this.buildResultPayload(session.id);
  }

  async getResult(sessionId: string, userId: string) {
    const prisma = databaseService.getClient();
    const session = await prisma.placementSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new Error("Session not found");
    if (session.userId !== userId) throw new Error("Unauthorized");
    if (session.status !== "completed") throw new Error("Session not completed");

    return this.buildResultPayload(sessionId);
  }

  private async buildResultPayload(sessionId: string) {
    const prisma = databaseService.getClient();
    const session = await prisma.placementSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });
    if (!session) throw new Error("Session not found");

    const levelDescription = LEVEL_MAP.find((l) => l.level === session.cefrLevel);

    return {
      session_id: session.id,
      status: session.status,
      raw_score: session.rawScore,
      max_score: session.maxScore,
      percentage: session.percentage ? Number(session.percentage) : null,
      cefr_level: session.cefrLevel,
      cefr_label: levelDescription?.label ?? null,
      section_scores: session.sectionScores,
      answers: session.answers.map((a) => ({
        question_id: a.questionId,
        question_index: a.questionIndex,
        selected_option: a.selectedOption,
        selected_order: a.selectedOrder,
        is_correct: a.isCorrect,
        points_earned: a.pointsEarned,
        time_spent: a.timeSpent,
      })),
      completed_at: session.completedAt,
    };
  }
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const placementService = new PlacementService();
