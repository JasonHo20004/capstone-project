import { randomBytes } from "crypto";
import { ConflictError, ForbiddenError } from "@capstone/common";
import { databaseService } from "../../services/database.service.js";
import { CreateTestDto } from "./test.schema.js";

/**
 * Slugify a title, then always append a short random suffix so two tests with
 * the same (or empty after sanitization) title can both be saved. Without the
 * suffix, Vietnamese-only titles strip down to "" and collide on the `slug`
 * UNIQUE constraint, breaking the second insert.
 */
function generateSlug(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics ("Bài" -> "Bai")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = randomBytes(3).toString("hex"); // 6 hex chars
  return base ? `${base}-${suffix}` : `test-${suffix}`;
}

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export class TestService {

  public async getAllTests(opts?: { status?: string; sellerId?: string }) {
    const prisma = databaseService.getClient();
    const where: Record<string, unknown> = {};
    if (opts?.status) where.status = opts.status;
    if (opts?.sellerId) where.sellerId = opts.sellerId;

    return await prisma.test.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        testType: true,
        sellerId: true,
        durationInMinutes: true,
        totalScore: true,
        passingScore: true,
        practiceCount: true,
        createdAt: true,
        updatedAt: true,
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        _count: { select: { sections: true, questions: true, courseTests: true } },
      },
      orderBy: [{ updatedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    });
  }

  public async getTestById(idOrSlug: string, options?: { includeAnswers?: boolean }) {
    const prisma = databaseService.getClient();
    const where = isUUID(idOrSlug) ? { id: idOrSlug } : { slug: idOrSlug };

    const questionSelect: any = {
      id: true,
      questionText: true,
      questionType: true,
      options: true,
      content: true,
      explanation: true,
      questionOrder: true,
      imageUrl: true,
      wordLimit: true,
    };

    // Only include answer for admin / owner editing — never for students!
    // The answer-location reference is gated the same way (it reveals the answer).
    if (options?.includeAnswers) {
      questionSelect.answer = true;
      questionSelect.answerReference = true;
    }

    const test = await prisma.test.findFirst({
      where,
      include: {
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        sections: {
          orderBy: { orderIndex: "asc" as const },
          include: {
            passages: {
              orderBy: { passageOrder: "asc" as const },
            },
            questions: {
              select: questionSelect,
              orderBy: { questionOrder: "asc" },
            },
          },
        },
        // Direct questions (not in a section)
        questions: {
          where: { sectionId: null },
          select: questionSelect,
          orderBy: { questionOrder: "asc" },
        },
      },
    });

    if (!test) throw new Error("Test not found");

    // FE convenience: derive `correctAnswerIndex` from the stored `answer` JSON
    // so editor UIs don't have to dig into the answer object themselves.
    // Only applied when answers are included (owner/admin context).
    if (options?.includeAnswers) {
      const surfaceCorrectIndex = (q: any) => {
        if (q && q.answer && typeof q.answer === "object" && "correctIndex" in q.answer) {
          q.correctAnswerIndex = q.answer.correctIndex;
        }
        return q;
      };
      (test as any).sections?.forEach((s: any) => {
        s.questions = (s.questions ?? []).map(surfaceCorrectIndex);
      });
      (test as any).questions = ((test as any).questions ?? []).map(surfaceCorrectIndex);
    }

    return test;
  }

  public async getTestTypes() {
    const prisma = databaseService.getClient();
    return await prisma.englishTestType.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  public async createTest(data: CreateTestDto, sellerId?: string) {
    const prisma = databaseService.getClient();
    const slug = generateSlug(data.title);

    // Normalize: if caller passed a flat `questions[]` (simple final test from
    // the seller course UI), wrap it in a single default section so the DB
    // model stays uniform.
    const sectionsInput =
      data.sections && data.sections.length > 0
        ? data.sections
        : data.questions && data.questions.length > 0
        ? [
            {
              title: data.title,
              skill: undefined,
              durationInSeconds: undefined,
              mediaUrl: undefined,
              audioTranscript: undefined,
              imageUrl: undefined,
              passageContent: undefined,
              questions: data.questions,
            },
          ]
        : [];

    const newTest = await prisma.test.create({
      data: {
        title: data.title,
        slug,
        status: (data as any).status || "DRAFT",
        durationInMinutes: data.durationInMinutes,
        totalScore: data.totalScore,
        passingScore: data.passingScore,
        maxAttempts: data.maxAttempts,
        englishTestTypeId: data.englishTestTypeId,
        testType: data.testType,
        sellerId: sellerId ?? null,
        testSkills: data.testSkills
          ? {
              create: data.testSkills.map((skill) => ({ skill })),
            }
          : undefined,
        sections: {
          create: sectionsInput.map((section, idx) => ({
            title: section.title,
            skill: section.skill,
            durationInSeconds: section.durationInSeconds,
            mediaUrl: (section as any).mediaUrl || undefined,
            audioTranscript: (section as any).audioTranscript || undefined,
            imageUrl: (section as any).imageUrl || undefined,
            orderIndex: idx,
            passages: (section as any).passageContent
              ? {
                  create: [{
                    content: (section as any).passageContent,
                    passageOrder: 1,
                  }],
                }
              : undefined,
            questions: {
              create: (section.questions ?? []).map((q, qIdx) => {
                // Translate `correctAnswerIndex` (FE convenience field) into
                // the canonical `answer` JSON used by the grader.
                let answer = q.answer as any;
                if (
                  answer === undefined &&
                  typeof (q as any).correctAnswerIndex === "number" &&
                  q.options &&
                  q.options.length > (q as any).correctAnswerIndex
                ) {
                  answer = { correctIndex: (q as any).correctAnswerIndex };
                }
                return {
                  questionText: q.questionText,
                  questionType: q.questionType,
                  options: q.options,
                  content: q.content as any,
                  answer,
                  answerReference: ((q as any).answerReference ?? undefined) as any,
                  explanation: q.explanation,
                  questionOrder: q.questionOrder ?? qIdx + 1,
                  imageUrl: (q as any).imageUrl || undefined,
                };
              }),
            },
          })),
        },
      },
      include: {
        sections: { include: { questions: true } },
        testSkills: true,
      },
    });

    await this.persistAudioSegments((newTest as any).sections ?? [], sectionsInput);
    return newTest;
  }

  /**
   * Best-effort: store Whisper per-segment timestamps on each section AFTER the
   * test is saved. Kept separate from the main create/update so a not-yet-applied
   * `audio_segments` column can never break test saving — the transcript text is
   * still saved inline regardless.
   */
  private async persistAudioSegments(
    savedSections: { id: string; orderIndex: number | null }[],
    sectionsInput: any[],
  ) {
    const targets = (sectionsInput ?? [])
      .map((s, idx) => ({ idx, seg: (s as any)?.audioSegments }))
      .filter((x) => Array.isArray(x.seg) && x.seg.length > 0);
    if (targets.length === 0) return;
    const prisma = databaseService.getClient();
    for (const { idx, seg } of targets) {
      const target =
        savedSections.find((s) => s.orderIndex === idx) ?? savedSections[idx];
      if (!target) continue;
      try {
        await prisma.section.update({
          where: { id: target.id },
          data: { audioSegments: seg } as any,
        });
      } catch (e) {
        console.warn(
          "[audioSegments] not stored — run the add_audio_segments migration + prisma generate:",
          (e as any)?.message,
        );
      }
    }
  }

  /**
   * Internal lookup used by course-service to verify a seller owns a test
   * before linking it as a course's final test.
   */
  public async getTestOwnership(testId: string) {
    const prisma = databaseService.getClient();
    return await prisma.test.findUnique({
      where: { id: testId },
      select: { id: true, title: true, sellerId: true, testType: true },
    });
  }

  /**
   * Record that a course uses this test. Idempotent — duplicate inserts are
   * absorbed by the composite PK so we ignore the unique-violation error.
   */
  public async linkCourse(testId: string, courseId: string) {
    const prisma = databaseService.getClient();
    try {
      await prisma.courseTest.create({ data: { testId, courseId } });
    } catch (err: unknown) {
      // P2002 = unique constraint — link already exists; treat as success.
      const code = (err as { code?: string })?.code;
      if (code !== "P2002") throw err;
    }
  }

  /** Remove the course↔test link record. No-op if it doesn't exist. */
  public async unlinkCourse(testId: string, courseId: string) {
    const prisma = databaseService.getClient();
    try {
      await prisma.courseTest.delete({
        where: { courseId_testId: { courseId, testId } },
      });
    } catch (err: unknown) {
      // P2025 = record not found — already unlinked; treat as success.
      const code = (err as { code?: string })?.code;
      if (code !== "P2025") throw err;
    }
  }

  public async updateTest(id: string, data: {
    title?: string;
    durationInMinutes?: number;
    status?: string;
    totalScore?: number;
    passingScore?: number;
    maxAttempts?: number;
    englishTestTypeId?: string;
    testSkills?: Array<"READING" | "LISTENING" | "WRITING" | "SPEAKING">;
    sections?: Array<{
      title: string;
      skill?: string;
      durationInSeconds?: number;
      mediaUrl?: string;
      audioTranscript?: string;
      imageUrl?: string;
      passageContent?: string;
      questions: Array<{
        questionText?: string;
        questionType: string;
        options?: string[];
        correctAnswerIndex?: number;
        content?: any;
        answer?: any;
        answerReference?: any;
        explanation?: string;
        questionOrder?: number;
        imageUrl?: string;
      }>;
    }>;
    /** Flat question list (FE convenience for simple FINAL tests). */
    questions?: Array<{
      questionText?: string;
      questionType: string;
      options?: string[];
      correctAnswerIndex?: number;
      content?: any;
      answer?: any;
      answerReference?: any;
      explanation?: string;
      questionOrder?: number;
      imageUrl?: string;
    }>;
  }) {
    const prisma = databaseService.getClient();
    const { testSkills, sections: rawSections, questions: flatQuestions, ...testData } = data;

    // Update slug if title changes
    if (testData.title) {
      (testData as any).slug = generateSlug(testData.title);
    }

    // Allow flat `questions[]` as input — same wrap pattern as createTest.
    const sections =
      rawSections && rawSections.length > 0
        ? rawSections
        : flatQuestions && flatQuestions.length > 0
        ? [
            {
              title: testData.title ?? "Section 1",
              skill: undefined,
              durationInSeconds: undefined,
              mediaUrl: undefined,
              audioTranscript: undefined,
              imageUrl: undefined,
              passageContent: undefined,
              questions: flatQuestions,
            },
          ]
        : undefined;

    // If sections are provided, delete old sections and recreate
    if (sections && sections.length > 0) {
      // Delete existing sections (cascade deletes questions)
      await prisma.section.deleteMany({ where: { testId: id } });
      // Also delete direct questions (not in sections)
      await prisma.question.deleteMany({ where: { testId: id } });
    }

    const updated = await prisma.test.update({
      where: { id },
      data: {
        ...testData,
        ...(testSkills
          ? {
              testSkills: {
                deleteMany: {},
                create: testSkills.map((skill) => ({ skill })),
              },
            }
          : {}),
        ...(sections && sections.length > 0
          ? {
              sections: {
                create: sections.map((section, idx) => ({
                  title: section.title,
                  skill: section.skill as any,
                  durationInSeconds: section.durationInSeconds,
                  mediaUrl: section.mediaUrl || undefined,
                  audioTranscript: section.audioTranscript || undefined,
                  imageUrl: section.imageUrl || undefined,
                  orderIndex: idx,
                  passages: section.passageContent
                    ? {
                        create: [{
                          content: section.passageContent,
                          passageOrder: 1,
                        }],
                      }
                    : undefined,
                  questions: {
                    create: section.questions.map((q, qIdx) => {
                      // Mirror createTest: convert FE convenience `correctAnswerIndex`
                      // into the canonical `answer` JSON when caller didn't supply one.
                      let answer = q.answer as any;
                      if (
                        answer === undefined &&
                        typeof q.correctAnswerIndex === "number" &&
                        q.options &&
                        q.options.length > q.correctAnswerIndex
                      ) {
                        answer = { correctIndex: q.correctAnswerIndex };
                      }
                      return {
                        questionText: q.questionText,
                        questionType: q.questionType as any,
                        options: q.options || [],
                        content: q.content as any,
                        answer,
                        answerReference: ((q as any).answerReference ?? undefined) as any,
                        explanation: q.explanation,
                        questionOrder: q.questionOrder ?? qIdx + 1,
                        imageUrl: q.imageUrl || undefined,
                      };
                    }),
                  },
                })),
              },
            }
          : {}),
      },
      include: {
        englishTestType: { select: { name: true } },
        testSkills: { select: { skill: true } },
        sections: { include: { questions: true } },
      },
    });

    await this.persistAudioSegments((updated as any).sections ?? [], sections ?? []);
    return updated;
  }

  public async deleteTest(id: string) {
    const prisma = databaseService.getClient();
    await prisma.test.delete({ where: { id } });
    return { deleted: true };
  }

  /**
   * Start a practice session. If user already has an ONGOING session
   * for this test, reuse it (prevents orphan sessions on page refresh / back button).
   */
  public async startSession(testId: string, userId: string) {
    const prisma = databaseService.getClient();

    // Verify test exists
    const test = await prisma.test.findFirst({
      where: isUUID(testId) ? { id: testId } : { slug: testId },
      select: { id: true, title: true, durationInMinutes: true, maxAttempts: true },
    });
    if (!test) throw new Error("Test not found");

    // Resume an existing ONGOING session if present. Its createdAt is the
    // authoritative clock start, so the countdown can't be reset by refreshing.
    const existing = await prisma.practiceSession.findFirst({
      where: {
        userId,
        testId: test.id,
        status: "ONGOING",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      // Don't resume a session that's already past its time limit — gradeTest
      // would reject the submit ("Time is up"), trapping the user on a dead
      // session forever. If the only ONGOING session has expired, drop it and
      // start a fresh attempt below. (Grace window mirrors gradeTest.)
      const durMin = test.durationInMinutes ?? 0;
      const GRACE_MS = 10 * 60 * 1000;
      const expired =
        durMin > 0 &&
        Date.now() > new Date(existing.createdAt).getTime() + durMin * 60_000 + GRACE_MS;

      if (!expired) {
        console.log(`♻️ Reusing existing session ${existing.id} for user ${userId}`);
        return {
          sessionId: existing.id,
          testId: test.id,
          resumed: true,
          startedAt: existing.createdAt,
          durationInMinutes: test.durationInMinutes,
          // Server-side draft so a resume on another device / after a localStorage
          // wipe restores the in-progress answers. (undefined until the column
          // migration is applied — harmless.)
          draftAnswers: (existing as any).draftAnswers ?? null,
        };
      }

      // Expired in-progress session(s) can never be submitted — remove them so a
      // new attempt can begin (cascades their UserAnswer draft rows).
      await prisma.practiceSession.deleteMany({
        where: { userId, testId: test.id, status: "ONGOING" },
      });
      console.log(`⌛ Cleared expired ONGOING session(s) for user ${userId} on test ${test.id} — starting fresh.`);
    }

    // Starting a NEW attempt — enforce the per-test attempt limit.
    if (test.maxAttempts && test.maxAttempts > 0) {
      const completed = await prisma.practiceSession.count({
        where: { userId, testId: test.id, status: "COMPLETED" },
      });
      if (completed >= test.maxAttempts) {
        throw new ForbiddenError(
          `You have reached the maximum number of attempts (${test.maxAttempts}) for this test.`,
        );
      }
    }

    // Create new session
    const session = await prisma.practiceSession.create({
      data: {
        userId,
        testId: test.id,
        selectedSections: [],
        status: "ONGOING",
      },
    });

    return {
      sessionId: session.id,
      testId: test.id,
      resumed: false,
      startedAt: session.createdAt,
      durationInMinutes: test.durationInMinutes,
    };
  }

  /**
   * Autosave in-progress answers onto the ONGOING session so work survives a
   * localStorage wipe or a device switch. Only the owner's active session is
   * touched. (Requires the draft_answers column — see the add_draft_answers
   * migration. Until applied, this throws and the client falls back to its local
   * draft, which is harmless.)
   */
  public async saveDraft(
    testId: string,
    userId: string,
    sessionId: string,
    answers: Record<string, string>,
  ) {
    const prisma = databaseService.getClient();
    const res = await prisma.practiceSession.updateMany({
      where: { id: sessionId, userId, testId, status: "ONGOING" },
      data: { draftAnswers: answers, draftSavedAt: new Date() } as any,
    });
    return { saved: res.count > 0 };
  }

  public async gradeTest(
    testId: string,
    submissions: Record<string, string>,
    userId?: string,
    sessionId?: string,
  ) {
    const prisma = databaseService.getClient();

    // Fetch all questions with their answers (server-side only)
    // Questions belong to sections, not directly to a test
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { testId },
          { section: { testId } },
        ],
      },
      select: {
        id: true,
        questionText: true,
        questionType: true,
        options: true,
        content: true,
        answer: true,
        explanation: true,
        questionOrder: true,
      },
      orderBy: { questionOrder: "asc" },
    });

    if (questions.length === 0) throw new Error("No questions found for this test.");

    const norm = (s: string) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");

    let correct = 0; // total points earned across all questions/gaps
    let total = 0; // total points available (gaps count individually)
    const details = questions.map((q) => {
      let userAnswer = (submissions[q.id] || "").trim();
      const answerData = q.answer as any;
      const contentData = q.content as any;
      // Options may live in `content.options` (legacy IELTS sections) or on
      // the dedicated `options` column (seller-created quiz tests). Try both.
      const resolvedOptions: string[] =
        (contentData?.options as string[] | undefined) ??
        (q.options as string[] | undefined) ??
        [];
      let correctAnswer = "";
      let isCorrect = false;
      let maxPoints = 1; // gaps override this with the gap count
      let earnedPoints = 0;

      if (q.questionType === "MULTIPLE_CHOICE") {
        const correctIndex = answerData?.correctIndex;
        correctAnswer = resolvedOptions[correctIndex] || `Option ${correctIndex}`;
        isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      } else if (q.questionType === "MULTIPLE_CHOICE_MULTI_ANSWER") {
        const options = resolvedOptions;
        const correctIndices: number[] = answerData?.correctIndices || [];
        correctAnswer = correctIndices.map(idx => String.fromCharCode(65 + idx) + ". " + options[idx]).join(", ");

        const userIndices = userAnswer.split(',').map(s => s.trim()).filter(s => s !== '');
        userAnswer = userIndices.map((idxStr) => {
          const idx = parseInt(idxStr, 10);
          return isNaN(idx) ? idxStr : (String.fromCharCode(65 + Math.max(0, idx)) + ". " + (options[idx] || ""));
        }).join(", ");

        if (userIndices.length > 0 && userIndices.length === correctIndices.length &&
            userIndices.every((idxStr) => correctIndices.includes(parseInt(idxStr, 10)))) {
          isCorrect = true;
        } else {
          isCorrect = false;
        }
      } else if (q.questionType === "GAP_FILL" || q.questionType === "SHORT_ANSWER") {
        // Two shapes:
        //  • Multi-gap Summary Completion → answer = { "9": ["Ridgeway"], "10": ["manuscript"] }
        //    submission = JSON string { "9": "ridgeway", "10": "..." }; each gap is 1 IELTS mark.
        //  • Single fill / short answer → answer = { text: ["variant1", "variant2"] }; submission = plain string.
        const isMultiGap =
          answerData && typeof answerData === "object" && !Array.isArray(answerData) &&
          !Array.isArray(answerData.text) &&
          Object.values(answerData).some((v) => Array.isArray(v));

        if (isMultiGap) {
          const gapKeys = Object.keys(answerData);
          maxPoints = gapKeys.length;
          let userGaps: Record<string, string> = {};
          try {
            const parsed = JSON.parse(submissions[q.id] || "{}");
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) userGaps = parsed;
          } catch { /* malformed submission → no gaps credited */ }

          for (const gid of gapKeys) {
            const accepts: string[] = Array.isArray(answerData[gid]) ? answerData[gid] : [];
            const ua = (userGaps[gid] ?? "").toString();
            if (ua.trim() && accepts.some((a) => norm(a) === norm(ua))) earnedPoints++;
          }
          isCorrect = maxPoints > 0 && earnedPoints === maxPoints;
          correctAnswer = gapKeys
            .map((g) => `${g}: ${(Array.isArray(answerData[g]) ? answerData[g] : []).join(" / ")}`)
            .join("  •  ");
          userAnswer = gapKeys.map((g) => `${g}: ${userGaps[g]?.trim() || "—"}`).join("  •  ");
        } else {
          const acceptedAnswers: string[] = answerData?.text || [];
          correctAnswer = acceptedAnswers[0] || "";
          isCorrect = acceptedAnswers.some((a: string) => norm(a) === norm(userAnswer));
        }
      } else if (q.questionType === "TRUE_FALSE_NOT_GIVEN" || q.questionType === "YES_NO_NOT_GIVEN") {
        correctAnswer = answerData?.correctAnswer || "";
        isCorrect = userAnswer.toUpperCase() === correctAnswer.toUpperCase();
      } else if (q.questionType === "MATCHING") {
        // Authoring stores the matched option under `correctOption` (a letter/text);
        // fall back to legacy `text[]` / `correctAnswer` shapes.
        correctAnswer = answerData?.correctOption || answerData?.text?.[0] || answerData?.correctAnswer || "";
        isCorrect = norm(userAnswer) === norm(correctAnswer);
      }

      // Single-point question types derive their earned points from correctness.
      // (Multi-gap GAP_FILL already accumulated earnedPoints above.)
      if (maxPoints === 1) earnedPoints = isCorrect ? 1 : 0;

      correct += earnedPoints;
      total += maxPoints;

      return {
        questionId: q.id,
        questionOrder: q.questionOrder,
        questionText: contentData?.text || q.questionText || "",
        questionType: q.questionType,
        userAnswer: userAnswer || "(no answer)",
        correctAnswer,
        isCorrect,
        scoreEarned: earnedPoints,
        scoreMax: maxPoints,
        explanation: q.explanation || null,
      };
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    // ─── Look up Band Score from score_conversions ─────────────────────
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: {
        englishTestTypeId: true,
        durationInMinutes: true,
        testSkills: { select: { skill: true } },
      },
    });

    let bandScore: number | null = null;
    if (test?.englishTestTypeId) {
      // Determine skill for lookup (READING or LISTENING)
      const skill = test.testSkills?.[0]?.skill || "READING";

      const conversion = await prisma.scoreConversion.findFirst({
        where: {
          englishTestTypeId: test.englishTestTypeId,
          skill,
          rawScore: correct,
        },
      });

      if (conversion) {
        bandScore = conversion.scaledScore;
      } else {
        // Fallback: find closest rawScore that is <= correct
        const closest = await prisma.scoreConversion.findFirst({
          where: {
            englishTestTypeId: test.englishTestTypeId,
            skill,
            rawScore: { lte: correct },
          },
          orderBy: { rawScore: "desc" },
        });
        bandScore = closest?.scaledScore ?? null;
      }
    }

    // ─── Save to PracticeSession + UserAnswer ──────────────────────────
    let savedSessionId: string | null = null;
    if (userId) {
      const completedScores = {
        status: "COMPLETED" as const,
        completedAt: new Date(),
        overallScaledScore: bandScore ?? percentage,
        rawScoresBySkill: { correct, total, percentage, bandScore },
        scoresBySkill: { details },
      };

      if (sessionId) {
        // Load the session so we can enforce the time limit and replay
        // idempotently if it was already submitted.
        const sess = await prisma.practiceSession.findUnique({
          where: { id: sessionId },
          select: {
            id: true, userId: true, status: true, createdAt: true,
            rawScoresBySkill: true, scoresBySkill: true,
          },
        });
        if (!sess || sess.userId !== userId) {
          throw new ConflictError("This test session is no longer active.");
        }
        if (sess.status === "COMPLETED") {
          // Idempotent replay (double-click / retried request) — return the
          // stored result instead of grading a second time.
          return {
            sessionId: sess.id,
            score: (sess.rawScoresBySkill as any) ?? { correct, total, percentage, bandScore },
            details: ((sess.scoresBySkill as any)?.details as any[]) ?? details,
            alreadySubmitted: true,
          };
        }
        // Server-side time limit (defense-in-depth — the client also auto-submits
        // on time). createdAt is the authoritative clock start, so a refreshed /
        // tampered client can't gain extra time. A generous grace window absorbs
        // clock skew and brief offline/sleep before the late submit is rejected.
        const durMin = test?.durationInMinutes ?? null;
        if (durMin && durMin > 0) {
          const GRACE_MS = 10 * 60 * 1000;
          const deadline = new Date(sess.createdAt).getTime() + durMin * 60_000 + GRACE_MS;
          if (Date.now() > deadline) {
            throw new ForbiddenError("Time is up — this test session has expired.");
          }
        }
        // Close the ONGOING session atomically, so a double submit (double-click /
        // retried request) can't record a second graded attempt.
        const claim = await prisma.practiceSession.updateMany({
          where: { id: sessionId, userId, testId, status: "ONGOING" },
          data: completedScores,
        });
        if (claim.count === 0) {
          // Raced with another submit that just completed it — return that result.
          const prior = await prisma.practiceSession.findUnique({ where: { id: sessionId } });
          if (prior && prior.userId === userId && prior.status === "COMPLETED") {
            return {
              sessionId: prior.id,
              score: (prior.rawScoresBySkill as any) ?? { correct, total, percentage, bandScore },
              details: ((prior.scoresBySkill as any)?.details as any[]) ?? details,
              alreadySubmitted: true,
            };
          }
          throw new ConflictError("This test session is no longer active.");
        }
        savedSessionId = sessionId;
      } else {
        // No session was opened (e.g. a lesson-embedded quiz). Enforce the
        // attempt limit, then record a fresh completed attempt.
        const limitInfo = await prisma.test.findUnique({
          where: { id: testId },
          select: { maxAttempts: true },
        });
        if (limitInfo?.maxAttempts && limitInfo.maxAttempts > 0) {
          const done = await prisma.practiceSession.count({
            where: { userId, testId, status: "COMPLETED" },
          });
          if (done >= limitInfo.maxAttempts) {
            throw new ForbiddenError(
              `You have reached the maximum number of attempts (${limitInfo.maxAttempts}) for this test.`,
            );
          }
        }
        const session = await prisma.practiceSession.create({
          data: { userId, testId, selectedSections: [], ...completedScores },
        });
        savedSessionId = session.id;
      }

      // Build snapshot map so historical answers survive future question edits.
      const questionMap = new Map(questions.map((q) => [q.id, q]));

      // Save individual answers with snapshot of question state at submit time.
      const userAnswerData = details.map((d) => {
        const q = questionMap.get(d.questionId);
        return {
          practiceSessionId: savedSessionId!,
          questionId: d.questionId,
          userId,
          answerText: d.userAnswer,
          isCorrect: d.isCorrect,
          questionSnapshot: q
            ? {
                questionText: q.questionText,
                questionType: q.questionType,
                content: q.content,
                answer: q.answer,
                explanation: q.explanation,
              }
            : null,
          scoreAtSubmit: d.scoreEarned,
        };
      });

      await prisma.userAnswer.createMany({ data: userAnswerData });
    }

    return {
      sessionId: savedSessionId,
      score: { correct, total, percentage, bandScore },
      details,
    };
  }

  // ─── Test History ──────────────────────────────────────────────────────────
  public async getTestHistory(userId: string) {
    const prisma = databaseService.getClient();
    return await prisma.practiceSession.findMany({
      where: { userId },
      select: {
        id: true,
        testId: true,
        status: true,
        createdAt: true,
        completedAt: true,
        overallScaledScore: true,
        rawScoresBySkill: true,
        test: {
          select: {
            title: true,
            slug: true,
            durationInMinutes: true,
            testSkills: { select: { skill: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public async getAttemptDetail(sessionId: string) {
    const prisma = databaseService.getClient();
    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          select: { title: true, slug: true, durationInMinutes: true,
            testSkills: { select: { skill: true } } },
        },
        userAnswers: {
          include: {
            question: {
              select: { questionText: true, questionType: true, content: true,
                answer: true, answerReference: true, explanation: true, questionOrder: true },
            },
          },
          orderBy: { question: { questionOrder: "asc" } },
        },
      },
    });
    if (!session) throw new Error("Attempt not found");
    return session;
  }

  // ─── Temp: Seed Score Conversions ────────────────────────────────────────
  public async seedScoreConversions() {
    const prisma = databaseService.getClient();

    let ielts = await prisma.englishTestType.findFirst({
      where: { name: { contains: "IELTS", mode: "insensitive" } },
    });

    if (!ielts) {
      ielts = await prisma.englishTestType.create({ data: { name: "IELTS Academic" } });
    }

    const id = ielts.id;

    await prisma.scoreConversion.deleteMany({ where: { englishTestTypeId: id } });

    const table: [number, number][] = [
      [40,9.0],[39,9.0],[38,8.5],[37,8.5],[36,8.0],[35,8.0],
      [34,7.5],[33,7.5],[32,7.0],[31,7.0],[30,7.0],
      [29,6.5],[28,6.5],[27,6.5],
      [26,6.0],[25,6.0],[24,6.0],[23,6.0],
      [22,5.5],[21,5.5],[20,5.5],
      [19,5.0],[18,5.0],[17,5.0],[16,5.0],
      [15,4.5],[14,4.5],[13,4.5],
      [12,4.0],[11,4.0],[10,4.0],
      [9,3.5],[8,3.5],[7,3.5],
      [6,3.0],[5,3.0],[4,2.5],[3,2.5],
      [2,2.0],[1,2.0],[0,0.0],
    ];

    const data: any[] = [];
    for (const skill of ["READING", "LISTENING"]) {
      for (const [raw, band] of table) {
        data.push({ englishTestTypeId: id, skill, rawScore: raw, scaledScore: band });
      }
    }

    const result = await prisma.scoreConversion.createMany({ data });
    return { inserted: result.count, ieltsId: id, ieltsName: ielts.name };
  }
}

export const testService = new TestService();
