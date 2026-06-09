import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  TESTS,
  COURSES,
  PRACTICE_SESSIONS,
  LEARNERS,
  daysAgo,
  daysFromNow,
  hoursAgo,
  id,
  userId,
  courseId,
  testId,
  sectionId,
  passageId,
  questionId,
  practiceSessionId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.ASSESSMENT_DIRECT_URL ?? process.env.ASSESSMENT_DATABASE_URL } },
});

// ─── Static demo content ──────────────────────────────────────────────────────
// All content is in English (the learning material). UI labels elsewhere may be
// Vietnamese, but test questions / passages / transcripts are English.

const AUDIO_BASE = "https://cdn.demo.capstone.local/audio";

// JSON value type compatible with Prisma's InputJsonValue (no `unknown`).
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

// English test types — keyed by id('etype', name) as the PK so they are
// idempotent (EnglishTestType has no natural unique column).
const IELTS_TYPE_ID = id("etype", "IELTS");
const TOEIC_TYPE_ID = id("etype", "TOEIC");

function etypeIdFor(type: "IELTS" | "TOEIC"): string {
  return type === "IELTS" ? IELTS_TYPE_ID : TOEIC_TYPE_ID;
}

// ─── Question content definitions for the 3 detailed tests ─────────────────────
// Each entry carries everything needed to upsert a Question row plus, for
// COMPLETED sessions, to build a deterministic UserAnswer.

interface SeedQuestion {
  key: string; // stable question key → questionId(key)
  questionType:
    | "TRUE_FALSE_NOT_GIVEN"
    | "GAP_FILL"
    | "FILL_IN_THE_BLANK"
    | "MULTIPLE_CHOICE"
    | "TOEIC_SINGLE_CHOICE";
  questionText: string;
  questionOrder: number;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string;
  wordLimit?: number;
  explanation: string;
  content?: JsonObject | null;
  answer?: JsonObject | null;
}

// ── IELTS Reading Set 1 ──
const IELTS_READING_PASSAGE = `The Origins of Coffee Cultivation

Coffee, one of the world's most widely consumed beverages, traces its origins to the highland forests of Ethiopia, where the coffee plant grew wild long before anyone thought to roast its beans. According to a popular legend, a goatherd named Kaldi noticed that his goats became unusually energetic after eating the bright red cherries of a certain shrub. Although the story is almost certainly apocryphal, it reflects a genuine truth: the stimulating properties of coffee were discovered through observation of its effects rather than through deliberate experimentation.

By the fifteenth century, coffee cultivation and trade had moved across the Red Sea to Yemen, where Sufi monasteries used the drink to stay alert during long nights of prayer. The port city of Mocha became so closely associated with the coffee trade that its name survives today as a term for a particular style of the drink. From Yemen, knowledge of coffee spread rapidly to the wider Islamic world, and coffee houses—lively centres of conversation, music, and commerce—appeared in cities such as Cairo and Istanbul.

For a long time, the nations of the Arabian Peninsula guarded their monopoly carefully, forbidding the export of fertile beans that could be planted elsewhere. This control eventually broke down, however, when seedlings were smuggled out and successfully grown in other tropical regions. By the eighteenth century, coffee had become a truly global commodity, cultivated on plantations across Asia, the Caribbean, and South America, and woven into the daily routines of millions of people far from its Ethiopian birthplace.`;

const IELTS_READING_QUESTIONS: SeedQuestion[] = [
  {
    key: "ielts-r1-q1",
    questionType: "TRUE_FALSE_NOT_GIVEN",
    questionText:
      "The wild coffee plant grew in Ethiopia before people began to roast its beans.",
    questionOrder: 1,
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correctAnswerIndex: 0,
    correctAnswer: "TRUE",
    explanation:
      "Paragraph 1 states the plant 'grew wild ... long before anyone thought to roast its beans', so the statement is TRUE.",
    content: { statement: "true_false_not_given" },
    answer: { correct: "TRUE" },
  },
  {
    key: "ielts-r1-q2",
    questionType: "TRUE_FALSE_NOT_GIVEN",
    questionText:
      "The legend of Kaldi the goatherd is supported by strong historical evidence.",
    questionOrder: 2,
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correctAnswerIndex: 1,
    correctAnswer: "FALSE",
    explanation:
      "The text calls the story 'almost certainly apocryphal', which contradicts the claim of strong evidence, so it is FALSE.",
    content: { statement: "true_false_not_given" },
    answer: { correct: "FALSE" },
  },
  {
    key: "ielts-r1-q3",
    questionType: "TRUE_FALSE_NOT_GIVEN",
    questionText: "Kaldi sold his goats after discovering the coffee cherries.",
    questionOrder: 3,
    options: ["TRUE", "FALSE", "NOT GIVEN"],
    correctAnswerIndex: 2,
    correctAnswer: "NOT GIVEN",
    explanation:
      "The passage never mentions Kaldi selling his goats, so the information is NOT GIVEN.",
    content: { statement: "true_false_not_given" },
    answer: { correct: "NOT GIVEN" },
  },
  {
    key: "ielts-r1-q4",
    questionType: "GAP_FILL",
    questionText:
      "By the fifteenth century, coffee cultivation had moved across the Red Sea to ________.",
    questionOrder: 4,
    correctAnswer: "Yemen",
    wordLimit: 1,
    explanation:
      "Paragraph 2: coffee 'had moved across the Red Sea to Yemen'.",
    content: { gaps: 1 },
    answer: { accepted: ["Yemen"] },
  },
  {
    key: "ielts-r1-q5",
    questionType: "GAP_FILL",
    questionText:
      "The port city of ________ gave its name to a particular style of the drink.",
    questionOrder: 5,
    correctAnswer: "Mocha",
    wordLimit: 1,
    explanation:
      "Paragraph 2 identifies the port city of Mocha, whose name survives as a style of coffee.",
    content: { gaps: 1 },
    answer: { accepted: ["Mocha"] },
  },
  {
    key: "ielts-r1-q6",
    questionType: "GAP_FILL",
    questionText:
      "Coffee became a global commodity by the ________ century, grown across Asia, the Caribbean and South America.",
    questionOrder: 6,
    correctAnswer: "eighteenth",
    wordLimit: 1,
    explanation:
      "Paragraph 3: 'By the eighteenth century, coffee had become a truly global commodity'.",
    content: { gaps: 1 },
    answer: { accepted: ["eighteenth", "18th"] },
  },
];

// ── IELTS Listening Set 1 ──
const IELTS_LISTENING_TRANSCRIPT = `Good afternoon, and welcome to the City Library induction. My name is Sarah and I'll be showing you around today. The library is open from nine in the morning until eight in the evening on weekdays, and until five o'clock on Saturdays. We're closed on Sundays. To borrow books you'll need a membership card, which is free for all residents. You can take out up to twelve items at a time, and the standard loan period is three weeks. If you need longer, most items can be renewed online twice. Please remember that the study rooms on the second floor must be booked in advance at the front desk.`;

const IELTS_LISTENING_QUESTIONS: SeedQuestion[] = [
  {
    key: "ielts-l1-q1",
    questionType: "FILL_IN_THE_BLANK",
    questionText:
      "On weekdays the library closes at ________ in the evening.",
    questionOrder: 1,
    correctAnswer: "eight",
    wordLimit: 1,
    explanation: "The guide says the library is open 'until eight in the evening on weekdays'.",
    content: { gaps: 1 },
    answer: { accepted: ["eight", "8", "8pm", "8 pm"] },
  },
  {
    key: "ielts-l1-q2",
    questionType: "FILL_IN_THE_BLANK",
    questionText: "A membership card is ________ for all residents.",
    questionOrder: 2,
    correctAnswer: "free",
    wordLimit: 1,
    explanation: "The card 'is free for all residents'.",
    content: { gaps: 1 },
    answer: { accepted: ["free"] },
  },
  {
    key: "ielts-l1-q3",
    questionType: "MULTIPLE_CHOICE",
    questionText: "How many items can a member borrow at a time?",
    questionOrder: 3,
    options: ["Up to eight", "Up to ten", "Up to twelve", "Up to twenty"],
    correctAnswerIndex: 2,
    explanation: "The guide states you can take out 'up to twelve items at a time'.",
    content: { choices: 4 },
    answer: { correctIndex: 2 },
  },
  {
    key: "ielts-l1-q4",
    questionType: "MULTIPLE_CHOICE",
    questionText: "What is the standard loan period?",
    questionOrder: 4,
    options: ["One week", "Two weeks", "Three weeks", "Four weeks"],
    correctAnswerIndex: 2,
    explanation: "'The standard loan period is three weeks.'",
    content: { choices: 4 },
    answer: { correctIndex: 2 },
  },
  {
    key: "ielts-l1-q5",
    questionType: "FILL_IN_THE_BLANK",
    questionText: "Most items can be renewed online ________ times.",
    questionOrder: 5,
    correctAnswer: "two",
    wordLimit: 1,
    explanation: "Items 'can be renewed online twice', i.e. two times.",
    content: { gaps: 1 },
    answer: { accepted: ["two", "twice", "2"] },
  },
  {
    key: "ielts-l1-q6",
    questionType: "MULTIPLE_CHOICE",
    questionText: "Where must the study rooms be booked?",
    questionOrder: 6,
    options: ["Online only", "At the front desk", "By phone", "On the second floor noticeboard"],
    correctAnswerIndex: 1,
    explanation: "Study rooms 'must be booked in advance at the front desk'.",
    content: { choices: 4 },
    answer: { correctIndex: 1 },
  },
];

// ── TOEIC Mini — Listening section ──
const TOEIC_LISTENING_QUESTIONS: SeedQuestion[] = [
  {
    key: "toeic-q1",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText: "What does the woman ask the man to do?",
    questionOrder: 1,
    options: [
      "Reschedule a meeting",
      "Send a report",
      "Book a flight",
      "Call a client",
    ],
    correctAnswerIndex: 1,
    explanation: "She asks him to forward the quarterly report before noon.",
    content: { part: "Part 3" },
    answer: { correctIndex: 1 },
  },
  {
    key: "toeic-q2",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText: "Where most likely are the speakers?",
    questionOrder: 2,
    options: ["At a bank", "In an airport", "At an office", "In a restaurant"],
    correctAnswerIndex: 2,
    explanation: "References to a printer and a colleague's desk indicate an office.",
    content: { part: "Part 3" },
    answer: { correctIndex: 2 },
  },
  {
    key: "toeic-q3",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText: "When will the new shipment arrive?",
    questionOrder: 3,
    options: ["On Monday", "On Wednesday", "On Friday", "Next month"],
    correctAnswerIndex: 1,
    explanation: "The announcement states the shipment is expected on Wednesday.",
    content: { part: "Part 4" },
    answer: { correctIndex: 1 },
  },
  {
    key: "toeic-q4",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText: "What is the main purpose of the announcement?",
    questionOrder: 4,
    options: [
      "To advertise a sale",
      "To introduce a new manager",
      "To explain a schedule change",
      "To recruit volunteers",
    ],
    correctAnswerIndex: 2,
    explanation: "The speaker explains that the maintenance schedule has changed.",
    content: { part: "Part 4" },
    answer: { correctIndex: 2 },
  },
];

// ── TOEIC Mini — Reading section ──
const TOEIC_READING_QUESTIONS: SeedQuestion[] = [
  {
    key: "toeic-q5",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText:
      "The marketing team will ________ the new campaign at the end of the month.",
    questionOrder: 5,
    options: ["launch", "launches", "launching", "launched"],
    correctAnswerIndex: 0,
    explanation: "After the modal 'will', the base form 'launch' is required.",
    content: { part: "Part 5" },
    answer: { correctIndex: 0 },
  },
  {
    key: "toeic-q6",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText:
      "All employees must submit their expense reports ________ Friday.",
    questionOrder: 6,
    options: ["since", "by", "until", "from"],
    correctAnswerIndex: 1,
    explanation: "'By Friday' expresses a deadline; 'until' would imply continuous action.",
    content: { part: "Part 5" },
    answer: { correctIndex: 1 },
  },
  {
    key: "toeic-q7",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText:
      "The conference has been postponed ________ unforeseen circumstances.",
    questionOrder: 7,
    options: ["because", "due to", "so that", "in order to"],
    correctAnswerIndex: 1,
    explanation: "'Due to' is followed by a noun phrase; 'because' needs a clause.",
    content: { part: "Part 6" },
    answer: { correctIndex: 1 },
  },
  {
    key: "toeic-q8",
    questionType: "TOEIC_SINGLE_CHOICE",
    questionText:
      "According to the notice, what should visitors do upon arrival?",
    questionOrder: 8,
    options: [
      "Pay a deposit",
      "Sign in at reception",
      "Wear a uniform",
      "Park in the basement",
    ],
    correctAnswerIndex: 1,
    explanation: "The notice instructs visitors to sign in at the reception desk.",
    content: { part: "Part 7" },
    answer: { correctIndex: 1 },
  },
];

// Map a detailed test key → ordered list of its questions (across all sections).
const DETAILED_QUESTIONS: Record<string, SeedQuestion[]> = {
  "ielts-reading-1": IELTS_READING_QUESTIONS,
  "ielts-listening-1": IELTS_LISTENING_QUESTIONS,
  "toeic-mini": [...TOEIC_LISTENING_QUESTIONS, ...TOEIC_READING_QUESTIONS],
};

// Section ids per detailed test (used for selectedSections on practice sessions).
const SECTION_IDS_BY_TEST: Record<string, string[]> = {
  "ielts-reading-1": [sectionId("ielts-r1-sec")],
  "ielts-listening-1": [sectionId("ielts-l1-sec")],
  "toeic-mini": [sectionId("toeic-listen-sec"), sectionId("toeic-read-sec")],
};

// ─── Seeders ───────────────────────────────────────────────────────────────────

async function seedEnglishTestTypes(): Promise<void> {
  await prisma.englishTestType.upsert({
    where: { id: IELTS_TYPE_ID },
    update: { name: "IELTS" },
    create: { id: IELTS_TYPE_ID, name: "IELTS" },
  });
  await prisma.englishTestType.upsert({
    where: { id: TOEIC_TYPE_ID },
    update: { name: "TOEIC" },
    create: { id: TOEIC_TYPE_ID, name: "TOEIC" },
  });
}

async function seedScoreConversions(): Promise<void> {
  // raw → band/scaled. IELTS reading & listening + a couple of TOEIC rows.
  const rows: {
    key: string;
    englishTestTypeId: string;
    skill: "READING" | "LISTENING";
    rawScore: number;
    scaledScore: number;
  }[] = [
    // IELTS Reading
    { key: "ielts-r-30", englishTestTypeId: IELTS_TYPE_ID, skill: "READING", rawScore: 30, scaledScore: 6.0 },
    { key: "ielts-r-35", englishTestTypeId: IELTS_TYPE_ID, skill: "READING", rawScore: 35, scaledScore: 7.0 },
    { key: "ielts-r-39", englishTestTypeId: IELTS_TYPE_ID, skill: "READING", rawScore: 39, scaledScore: 8.0 },
    // IELTS Listening
    { key: "ielts-l-30", englishTestTypeId: IELTS_TYPE_ID, skill: "LISTENING", rawScore: 30, scaledScore: 6.5 },
    { key: "ielts-l-35", englishTestTypeId: IELTS_TYPE_ID, skill: "LISTENING", rawScore: 35, scaledScore: 7.5 },
    { key: "ielts-l-38", englishTestTypeId: IELTS_TYPE_ID, skill: "LISTENING", rawScore: 38, scaledScore: 8.5 },
    // TOEIC (raw correct count → scaled, simplified)
    { key: "toeic-l-80", englishTestTypeId: TOEIC_TYPE_ID, skill: "LISTENING", rawScore: 80, scaledScore: 400 },
    { key: "toeic-r-80", englishTestTypeId: TOEIC_TYPE_ID, skill: "READING", rawScore: 80, scaledScore: 380 },
  ];

  for (const r of rows) {
    const rowId = id("sc", r.key);
    await prisma.scoreConversion.upsert({
      where: { id: rowId },
      update: {
        englishTestTypeId: r.englishTestTypeId,
        skill: r.skill,
        rawScore: r.rawScore,
        scaledScore: r.scaledScore,
      },
      create: {
        id: rowId,
        englishTestTypeId: r.englishTestTypeId,
        skill: r.skill,
        rawScore: r.rawScore,
        scaledScore: r.scaledScore,
      },
    });
  }
}

async function seedTestsAndSkills(): Promise<void> {
  for (const t of TESTS) {
    const tId = testId(t.key);
    await prisma.test.upsert({
      where: { id: tId },
      update: {
        title: t.title,
        slug: t.slug,
        status: t.status,
        durationInMinutes: t.durationInMinutes,
        totalScore: t.totalScore,
        passingScore: t.passingScore,
        englishTestTypeId: etypeIdFor(t.type),
        practiceCount: t.practiceCount,
        maxAttempts: t.maxAttempts,
        testType: null,
        sellerId: userId(t.sellerKey),
      },
      create: {
        id: tId,
        title: t.title,
        slug: t.slug,
        status: t.status,
        durationInMinutes: t.durationInMinutes,
        totalScore: t.totalScore,
        passingScore: t.passingScore,
        englishTestTypeId: etypeIdFor(t.type),
        practiceCount: t.practiceCount,
        maxAttempts: t.maxAttempts,
        testType: null,
        sellerId: userId(t.sellerKey),
        createdAt: daysAgo(120),
      },
    });

    for (const skill of t.skills) {
      await prisma.testSkill.upsert({
        where: { testId_skill: { testId: tId, skill } },
        update: {},
        create: { testId: tId, skill },
      });
    }
  }
}

async function seedCourseTests(): Promise<void> {
  // Collect unique (courseKey, testKey) pairs: finalTestKey + quiz-lesson testKeys.
  const pairs = new Set<string>();
  const linkData: { courseKey: string; testKey: string }[] = [];

  const addPair = (courseKey: string, testKey: string): void => {
    const sig = `${courseKey}::${testKey}`;
    if (pairs.has(sig)) return;
    pairs.add(sig);
    linkData.push({ courseKey, testKey });
  };

  for (const c of COURSES) {
    if (c.finalTestKey) addPair(c.key, c.finalTestKey);
    for (const m of c.modules) {
      for (const l of m.lessons) {
        if (l.testKey) addPair(c.key, l.testKey);
      }
    }
  }

  for (const { courseKey, testKey } of linkData) {
    const cId = courseId(courseKey);
    const tId = testId(testKey);
    await prisma.courseTest.upsert({
      where: { courseId_testId: { courseId: cId, testId: tId } },
      update: {},
      create: { courseId: cId, testId: tId },
    });
  }
}

async function seedSectionsPassagesQuestions(): Promise<void> {
  // ── IELTS Reading 1 ──
  {
    const tId = testId("ielts-reading-1");
    const secId = sectionId("ielts-r1-sec");
    const psgId = passageId("ielts-r1-p1");

    await prisma.section.upsert({
      where: { id: secId },
      update: {
        title: "Reading Passage 1",
        instruction:
          "Read the passage below and answer Questions 1–6. Choose TRUE, FALSE or NOT GIVEN, and complete the gaps using no more than one word.",
        testId: tId,
        skill: "READING",
        totalQuestions: IELTS_READING_QUESTIONS.length,
        totalScore: 6,
        orderIndex: 0,
      },
      create: {
        id: secId,
        title: "Reading Passage 1",
        instruction:
          "Read the passage below and answer Questions 1–6. Choose TRUE, FALSE or NOT GIVEN, and complete the gaps using no more than one word.",
        testId: tId,
        skill: "READING",
        totalQuestions: IELTS_READING_QUESTIONS.length,
        totalScore: 6,
        orderIndex: 0,
      },
    });

    await prisma.passage.upsert({
      where: { sectionId_passageOrder: { sectionId: secId, passageOrder: 1 } },
      update: { content: IELTS_READING_PASSAGE },
      create: { id: psgId, sectionId: secId, content: IELTS_READING_PASSAGE, passageOrder: 1 },
    });

    for (const q of IELTS_READING_QUESTIONS) {
      await upsertQuestion(q, { sectionId: secId, passageId: psgId, testId: tId });
    }
  }

  // ── IELTS Listening 1 ──
  {
    const tId = testId("ielts-listening-1");
    const secId = sectionId("ielts-l1-sec");

    await prisma.section.upsert({
      where: { id: secId },
      update: {
        title: "Listening Section 1",
        instruction:
          "Listen to the recording and answer Questions 1–6. Write no more than one word for each gap.",
        testId: tId,
        skill: "LISTENING",
        mediaUrl: `${AUDIO_BASE}/ielts-listening-1.mp3`,
        audioTranscript: IELTS_LISTENING_TRANSCRIPT,
        totalQuestions: IELTS_LISTENING_QUESTIONS.length,
        totalScore: 6,
        orderIndex: 0,
      },
      create: {
        id: secId,
        title: "Listening Section 1",
        instruction:
          "Listen to the recording and answer Questions 1–6. Write no more than one word for each gap.",
        testId: tId,
        skill: "LISTENING",
        mediaUrl: `${AUDIO_BASE}/ielts-listening-1.mp3`,
        audioTranscript: IELTS_LISTENING_TRANSCRIPT,
        totalQuestions: IELTS_LISTENING_QUESTIONS.length,
        totalScore: 6,
        orderIndex: 0,
      },
    });

    for (const q of IELTS_LISTENING_QUESTIONS) {
      await upsertQuestion(q, { sectionId: secId, passageId: null, testId: tId });
    }
  }

  // ── TOEIC Mini (2 sections) ──
  {
    const tId = testId("toeic-mini");
    const listenSecId = sectionId("toeic-listen-sec");
    const readSecId = sectionId("toeic-read-sec");

    await prisma.section.upsert({
      where: { id: listenSecId },
      update: {
        title: "Listening",
        instruction: "Listen to the conversations and talks, then choose the best answer.",
        testId: tId,
        skill: "LISTENING",
        mediaUrl: `${AUDIO_BASE}/toeic-mini-listening.mp3`,
        totalQuestions: TOEIC_LISTENING_QUESTIONS.length,
        totalScore: 4,
        orderIndex: 0,
      },
      create: {
        id: listenSecId,
        title: "Listening",
        instruction: "Listen to the conversations and talks, then choose the best answer.",
        testId: tId,
        skill: "LISTENING",
        mediaUrl: `${AUDIO_BASE}/toeic-mini-listening.mp3`,
        totalQuestions: TOEIC_LISTENING_QUESTIONS.length,
        totalScore: 4,
        orderIndex: 0,
      },
    });

    await prisma.section.upsert({
      where: { id: readSecId },
      update: {
        title: "Reading",
        instruction: "Read each sentence or passage and choose the best answer.",
        testId: tId,
        skill: "READING",
        totalQuestions: TOEIC_READING_QUESTIONS.length,
        totalScore: 4,
        orderIndex: 1,
      },
      create: {
        id: readSecId,
        title: "Reading",
        instruction: "Read each sentence or passage and choose the best answer.",
        testId: tId,
        skill: "READING",
        totalQuestions: TOEIC_READING_QUESTIONS.length,
        totalScore: 4,
        orderIndex: 1,
      },
    });

    for (const q of TOEIC_LISTENING_QUESTIONS) {
      await upsertQuestion(q, { sectionId: listenSecId, passageId: null, testId: tId });
    }
    for (const q of TOEIC_READING_QUESTIONS) {
      await upsertQuestion(q, { sectionId: readSecId, passageId: null, testId: tId });
    }
  }
}

async function upsertQuestion(
  q: SeedQuestion,
  refs: { sectionId: string; passageId: string | null; testId: string },
): Promise<void> {
  const qId = questionId(q.key);
  const data = {
    sectionId: refs.sectionId,
    passageId: refs.passageId,
    testId: refs.testId,
    questionText: q.questionText,
    questionType: q.questionType,
    options: q.options ?? [],
    correctAnswerIndex: q.correctAnswerIndex ?? null,
    correctAnswer: q.correctAnswer ?? null,
    wordLimit: q.wordLimit ?? null,
    explanation: q.explanation,
    questionOrder: q.questionOrder,
    content: q.content ?? undefined,
    answer: q.answer ?? undefined,
  };
  await prisma.question.upsert({
    where: { id: qId },
    update: data,
    create: { id: qId, ...data },
  });
}

// Per-test raw/scaled score maps for completed sessions (deterministic demo data).
function scoresForSession(
  testKey: string,
  overall: number | undefined,
): { raw: Record<string, number>; scaled: Record<string, number> } {
  switch (testKey) {
    case "ielts-reading-1":
      return { raw: { READING: 32 }, scaled: { READING: overall ?? 6.0 } };
    case "ielts-listening-1":
      return { raw: { LISTENING: 34 }, scaled: { LISTENING: overall ?? 6.5 } };
    case "toeic-mini":
      return {
        raw: { LISTENING: 78, READING: 70 },
        scaled: { LISTENING: 410, READING: (overall ?? 700) - 410 < 0 ? 300 : (overall ?? 700) - 410 },
      };
    case "grammar-quiz-1":
      return { raw: { READING: 9 }, scaled: { READING: overall ?? 8 } };
    default:
      return { raw: {}, scaled: {} };
  }
}

async function seedPracticeSessions(): Promise<void> {
  for (const ps of PRACTICE_SESSIONS) {
    const psId = practiceSessionId(ps.key);
    const tId = testId(ps.testKey);
    const uId = userId(ps.learnerKey);
    const test = TESTS.find((t) => t.key === ps.testKey);
    const createdAt = daysAgo(ps.daysAgo);

    // selectedSections: section ids if detailed, otherwise skill names.
    const selectedSections =
      test?.detailed && SECTION_IDS_BY_TEST[ps.testKey]
        ? SECTION_IDS_BY_TEST[ps.testKey]
        : (test?.skills ?? []);

    const isCompleted = ps.status === "COMPLETED";
    const { raw, scaled } = isCompleted
      ? scoresForSession(ps.testKey, ps.overallScaledScore)
      : { raw: {}, scaled: {} };

    // completedAt ≈ createdAt + 1h.
    const completedAt = isCompleted
      ? new Date(createdAt.getTime() + 60 * 60 * 1000)
      : null;

    const base = {
      userId: uId,
      testId: tId,
      selectedSections,
      status: ps.status,
      overallScaledScore: isCompleted ? ps.overallScaledScore ?? null : null,
      rawScoresBySkill: isCompleted ? raw : undefined,
      scoresBySkill: isCompleted ? scaled : undefined,
      completedAt,
      draftAnswers: !isCompleted ? { saved: true, answers: {} } : undefined,
      draftSavedAt: !isCompleted ? hoursAgo(1) : null,
    };

    await prisma.practiceSession.upsert({
      where: { id: psId },
      update: base,
      create: { id: psId, createdAt, ...base },
    });
  }
}

async function seedUserAnswers(): Promise<void> {
  for (const ps of PRACTICE_SESSIONS) {
    if (ps.status !== "COMPLETED") continue;
    const test = TESTS.find((t) => t.key === ps.testKey);
    if (!test?.detailed) continue;

    const questions = DETAILED_QUESTIONS[ps.testKey];
    if (!questions) continue;

    const psId = practiceSessionId(ps.key);
    const uId = userId(ps.learnerKey);

    // Roughly match the score: higher overall → more correct. Use a simple
    // deterministic threshold on question order.
    const correctRatio = correctRatioForScore(ps.testKey, ps.overallScaledScore);
    const correctCount = Math.round(questions.length * correctRatio);

    questions.forEach((q, idx) => {
      const isCorrect = idx < correctCount;
      const answerId = id("answer", `${ps.key}-${q.key}`);

      const usesIndex =
        q.questionType === "MULTIPLE_CHOICE" ||
        q.questionType === "TOEIC_SINGLE_CHOICE" ||
        q.questionType === "TRUE_FALSE_NOT_GIVEN";

      let selectedOptionIndex: number | null = null;
      let answerText: string | null = null;

      if (usesIndex) {
        const correctIdx = q.correctAnswerIndex ?? 0;
        const optCount = q.options?.length ?? 4;
        selectedOptionIndex = isCorrect
          ? correctIdx
          : (correctIdx + 1) % Math.max(optCount, 1);
      } else {
        answerText = isCorrect ? q.correctAnswer ?? "" : "incorrect";
      }

      const snapshot = {
        questionType: q.questionType,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer ?? null,
        correctAnswerIndex: q.correctAnswerIndex ?? null,
      };

      void prisma; // ensure ordering retained; actual await below
      pendingAnswerUpserts.push({
        answerId,
        psId,
        questionId: questionId(q.key),
        uId,
        answerText,
        selectedOptionIndex,
        isCorrect,
        snapshot,
        scoreAtSubmit: isCorrect ? 1 : 0,
      });
    });
  }

  for (const a of pendingAnswerUpserts) {
    await prisma.userAnswer.upsert({
      where: {
        practiceSessionId_questionId_userId: {
          practiceSessionId: a.psId,
          questionId: a.questionId,
          userId: a.uId,
        },
      },
      update: {
        answerText: a.answerText,
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect: a.isCorrect,
        questionSnapshot: a.snapshot,
        scoreAtSubmit: a.scoreAtSubmit,
      },
      create: {
        id: a.answerId,
        practiceSessionId: a.psId,
        questionId: a.questionId,
        userId: a.uId,
        answerText: a.answerText,
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect: a.isCorrect,
        questionSnapshot: a.snapshot,
        scoreAtSubmit: a.scoreAtSubmit,
      },
    });
  }
}

interface PendingAnswer {
  answerId: string;
  psId: string;
  questionId: string;
  uId: string;
  answerText: string | null;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  snapshot: JsonObject;
  scoreAtSubmit: number;
}
const pendingAnswerUpserts: PendingAnswer[] = [];

function correctRatioForScore(testKey: string, overall: number | undefined): number {
  if (overall == null) return 0.5;
  if (testKey === "toeic-mini") {
    // 990 scale → ratio
    return Math.min(1, Math.max(0.3, overall / 990));
  }
  // IELTS band 0–9 → ratio
  return Math.min(1, Math.max(0.3, overall / 9));
}

// ─── Dictation ──────────────────────────────────────────────────────────────

async function seedDictation(): Promise<void> {
  const exercises = [
    {
      key: "dict-ielts-1",
      title: "IELTS Listening — Library Induction",
      description: "Dictation practice based on an IELTS-style library induction talk.",
      audioUrl: `${AUDIO_BASE}/dictation-ielts-library.mp3`,
      level: "B1",
      category: "IELTS Listening",
      isPremium: false,
      sentences: [
        { index: 0, text: "Good afternoon, and welcome to the City Library induction.", startTime: 0.0, endTime: 3.4 },
        { index: 1, text: "The library is open from nine in the morning until eight in the evening.", startTime: 3.4, endTime: 8.1 },
        { index: 2, text: "To borrow books you will need a membership card, which is free for all residents.", startTime: 8.1, endTime: 13.6 },
        { index: 3, text: "The study rooms on the second floor must be booked in advance.", startTime: 13.6, endTime: 18.0 },
      ],
    },
    {
      key: "dict-general-1",
      title: "Everyday English — Making Plans",
      description: "General dictation practice using everyday conversational English.",
      audioUrl: `${AUDIO_BASE}/dictation-everyday-plans.mp3`,
      level: "A2",
      category: "General",
      isPremium: false,
      sentences: [
        { index: 0, text: "Are you free this weekend?", startTime: 0.0, endTime: 2.0 },
        { index: 1, text: "I was thinking we could go to the new museum downtown.", startTime: 2.0, endTime: 6.2 },
        { index: 2, text: "It opens at ten and the tickets are quite cheap.", startTime: 6.2, endTime: 10.0 },
        { index: 3, text: "Let me know if Saturday morning works for you.", startTime: 10.0, endTime: 13.5 },
      ],
    },
  ];

  for (const ex of exercises) {
    const exId = id("dictex", ex.key);
    await prisma.dictationExercise.upsert({
      where: { id: exId },
      update: {
        title: ex.title,
        description: ex.description,
        audioUrl: ex.audioUrl,
        level: ex.level,
        category: ex.category,
        totalSentences: ex.sentences.length,
        isPublished: true,
        isPremium: ex.isPremium,
      },
      create: {
        id: exId,
        title: ex.title,
        description: ex.description,
        audioUrl: ex.audioUrl,
        level: ex.level,
        category: ex.category,
        totalSentences: ex.sentences.length,
        isPublished: true,
        isPremium: ex.isPremium,
        createdAt: daysAgo(60),
      },
    });

    for (const s of ex.sentences) {
      await prisma.dictationSentence.upsert({
        where: { exerciseId_index: { exerciseId: exId, index: s.index } },
        update: { text: s.text, startTime: s.startTime, endTime: s.endTime },
        create: {
          id: id("dictsent", `${ex.key}-${s.index}`),
          exerciseId: exId,
          index: s.index,
          text: s.text,
          startTime: s.startTime,
          endTime: s.endTime,
        },
      });
    }
  }

  const sessions = [
    {
      key: "dsess-an-ielts",
      learnerKey: "an",
      exKey: "dict-ielts-1",
      status: "COMPLETED" as const,
      currentIndex: 4,
      completedCount: 4,
      accuracy: 0.92,
      daysAgo: 6,
    },
    {
      key: "dsess-dung-ielts",
      learnerKey: "dung",
      exKey: "dict-ielts-1",
      status: "COMPLETED" as const,
      currentIndex: 4,
      completedCount: 4,
      accuracy: 0.98,
      daysAgo: 3,
    },
    {
      key: "dsess-chi-general",
      learnerKey: "chi",
      exKey: "dict-general-1",
      status: "IN_PROGRESS" as const,
      currentIndex: 2,
      completedCount: 2,
      accuracy: null as number | null,
      daysAgo: 1,
    },
  ];

  for (const s of sessions) {
    const sId = id("dictsess", s.key);
    const exId = id("dictex", s.exKey);
    const createdAt = daysAgo(s.daysAgo);
    await prisma.dictationSession.upsert({
      where: { id: sId },
      update: {
        userId: userId(s.learnerKey),
        exerciseId: exId,
        currentIndex: s.currentIndex,
        completedCount: s.completedCount,
        accuracy: s.accuracy,
        status: s.status,
        completedAt: s.status === "COMPLETED" ? new Date(createdAt.getTime() + 30 * 60 * 1000) : null,
      },
      create: {
        id: sId,
        userId: userId(s.learnerKey),
        exerciseId: exId,
        currentIndex: s.currentIndex,
        completedCount: s.completedCount,
        accuracy: s.accuracy,
        status: s.status,
        createdAt,
        completedAt: s.status === "COMPLETED" ? new Date(createdAt.getTime() + 30 * 60 * 1000) : null,
      },
    });
  }
}

// ─── Test comments (discussion thread on ielts-reading-1) ─────────────────────

async function seedTestComments(): Promise<void> {
  const tId = testId("ielts-reading-1");
  const rootId = id("tcomment", "ielts-r1-root");
  const replyId = id("tcomment", "ielts-r1-reply");

  await prisma.testComment.upsert({
    where: { id: rootId },
    update: {
      testId: tId,
      userId: userId("an"),
      content:
        "For Question 3, why is the answer NOT GIVEN instead of FALSE? The passage never says he kept the goats either.",
      parentCommentId: null,
    },
    create: {
      id: rootId,
      testId: tId,
      userId: userId("an"),
      content:
        "For Question 3, why is the answer NOT GIVEN instead of FALSE? The passage never says he kept the goats either.",
      parentCommentId: null,
      createdAt: daysAgo(11),
    },
  });

  await prisma.testComment.upsert({
    where: { id: replyId },
    update: {
      testId: tId,
      userId: userId("dung"),
      content:
        "Because the text gives no information about selling the goats at all. FALSE would require the passage to contradict it; here it is simply not mentioned, so NOT GIVEN is correct.",
      parentCommentId: rootId,
    },
    create: {
      id: replyId,
      testId: tId,
      userId: userId("dung"),
      content:
        "Because the text gives no information about selling the goats at all. FALSE would require the passage to contradict it; here it is simply not mentioned, so NOT GIVEN is correct.",
      parentCommentId: rootId,
      createdAt: daysAgo(10),
    },
  });
}

// ─── Tutor session + messages (AI tutor for a reading question) ───────────────

async function seedTutorSession(): Promise<void> {
  const psId = practiceSessionId("ps-an-reading");
  const qId = questionId("ielts-r1-q3"); // an existing reading question
  const uId = userId("an");
  const sessionId = id("tutorsess", "an-r1-q3");

  await prisma.tutorSession.upsert({
    where: {
      practiceSessionId_questionId_userId: {
        practiceSessionId: psId,
        questionId: qId,
        userId: uId,
      },
    },
    update: {},
    create: {
      id: sessionId,
      practiceSessionId: psId,
      questionId: qId,
      userId: uId,
      createdAt: daysAgo(11),
    },
  });

  // Resolve the actual session id (may already exist with a different id if the
  // unique key matched). Read it back to attach messages.
  const session = await prisma.tutorSession.findUnique({
    where: {
      practiceSessionId_questionId_userId: {
        practiceSessionId: psId,
        questionId: qId,
        userId: uId,
      },
    },
  });
  if (!session) return;

  const messages = [
    { key: "an-r1-q3-m1", role: "user", content: "I don't understand why Question 3 is NOT GIVEN. Can you explain?", minute: 0 },
    {
      key: "an-r1-q3-m2",
      role: "assistant",
      content:
        "Sure! In TRUE/FALSE/NOT GIVEN questions, NOT GIVEN means the passage neither confirms nor denies the statement. The text never mentions Kaldi selling his goats, so there is no information to judge it as TRUE or FALSE.",
      minute: 1,
    },
    { key: "an-r1-q3-m3", role: "user", content: "So how is that different from FALSE?", minute: 2 },
    {
      key: "an-r1-q3-m4",
      role: "assistant",
      content:
        "Great question. You choose FALSE only when the passage directly contradicts the statement. Here the passage says nothing about the goats being sold, so it cannot contradict it — that is why NOT GIVEN is the correct answer.",
      minute: 3,
    },
  ];

  const baseTime = daysAgo(11).getTime();
  for (const m of messages) {
    await prisma.tutorMessage.upsert({
      where: { id: id("tmsg", m.key) },
      update: { role: m.role, content: m.content },
      create: {
        id: id("tmsg", m.key),
        tutorSessionId: session.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(baseTime + m.minute * 60 * 1000),
      },
    });
  }
}

// ─── Placement test ───────────────────────────────────────────────────────────

interface PlacementQ {
  key: string;
  section: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fill_blank" | "mcq" | "reorder";
  instruction: string;
  prompt: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  correctAnswer?: string;
  fixedFragment?: string;
  fragmentA?: string;
  fragmentB?: string;
  fragmentC?: string;
  correctOrder?: string;
  correctText?: string; // for fill_blank grading reference
  timeLimit: number;
}

const PLACEMENT_QUESTIONS: PlacementQ[] = [
  {
    key: "pq1",
    section: 1,
    difficulty: "easy",
    type: "mcq",
    instruction: "Choose the correct option to complete the sentence.",
    prompt: "She ____ to school every day.",
    optionA: "go",
    optionB: "goes",
    optionC: "going",
    correctAnswer: "B",
    timeLimit: 30,
  },
  {
    key: "pq2",
    section: 1,
    difficulty: "easy",
    type: "fill_blank",
    instruction: "Type the correct word to fill the blank.",
    prompt: "I have lived here ____ 2015.",
    correctAnswer: "since",
    correctText: "since",
    timeLimit: 30,
  },
  {
    key: "pq3",
    section: 2,
    difficulty: "medium",
    type: "mcq",
    instruction: "Choose the option that best completes the sentence.",
    prompt: "If I ____ more time, I would learn another language.",
    optionA: "have",
    optionB: "had",
    optionC: "will have",
    correctAnswer: "B",
    timeLimit: 40,
  },
  {
    key: "pq4",
    section: 2,
    difficulty: "medium",
    type: "reorder",
    instruction: "Arrange the fragments into a correct sentence.",
    prompt: "Put the parts in the correct order.",
    fixedFragment: "She told me",
    fragmentA: "that she",
    fragmentB: "had already",
    fragmentC: "finished the report",
    correctOrder: "ABC",
    timeLimit: 45,
  },
  {
    key: "pq5",
    section: 3,
    difficulty: "hard",
    type: "mcq",
    instruction: "Choose the most appropriate option.",
    prompt: "The proposal was rejected ____ its considerable merits.",
    optionA: "despite",
    optionB: "although",
    optionC: "however",
    correctAnswer: "A",
    timeLimit: 50,
  },
  {
    key: "pq6",
    section: 3,
    difficulty: "hard",
    type: "fill_blank",
    instruction: "Type one word to complete the sentence.",
    prompt: "Rarely ____ we seen such a remarkable performance.",
    correctAnswer: "have",
    correctText: "have",
    timeLimit: 50,
  },
];

const PLACEMENT_Q_IDS = PLACEMENT_QUESTIONS.map((q) => id("pq", q.key));

async function seedPlacementQuestions(): Promise<void> {
  for (const q of PLACEMENT_QUESTIONS) {
    const qId = id("pq", q.key);
    const data = {
      section: q.section,
      difficulty: q.difficulty,
      type: q.type,
      instruction: q.instruction,
      prompt: q.prompt,
      // correctAnswer is VarChar(1) — only single-letter MCQ keys fit. For
      // fill-blank answers (multi-char) we keep the word in optionA as the
      // answer key and leave correctAnswer null to respect the column width.
      optionA:
        q.type === "fill_blank" && q.correctAnswer && q.correctAnswer.length > 1
          ? q.correctAnswer
          : q.optionA ?? null,
      optionB: q.optionB ?? null,
      optionC: q.optionC ?? null,
      correctAnswer:
        q.correctAnswer && q.correctAnswer.length === 1 ? q.correctAnswer : null,
      fixedFragment: q.fixedFragment ?? null,
      fragmentA: q.fragmentA ?? null,
      fragmentB: q.fragmentB ?? null,
      fragmentC: q.fragmentC ?? null,
      correctOrder: q.correctOrder ?? null,
      timeLimit: q.timeLimit,
      isActive: true,
    };
    await prisma.placementQuestion.upsert({
      where: { id: qId },
      update: data,
      create: { id: qId, ...data },
    });
  }
}

interface PlacementSess {
  key: string;
  learnerKey: string;
  status: "completed" | "in_progress";
  cefrLevel?: string;
  rawScore?: number;
  daysAgo: number;
  lastQuestionIndex?: number;
}

const PLACEMENT_SESSIONS: PlacementSess[] = [
  { key: "plc-chi", learnerKey: "chi", status: "completed", cefrLevel: "B1", rawScore: 4, daysAgo: 20 },
  { key: "plc-dung", learnerKey: "dung", status: "completed", cefrLevel: "C1", rawScore: 6, daysAgo: 18 },
  { key: "plc-giang", learnerKey: "giang", status: "in_progress", daysAgo: 1, lastQuestionIndex: 3 },
];

async function seedPlacementSessions(): Promise<void> {
  const maxScore = PLACEMENT_QUESTIONS.length;

  for (const s of PLACEMENT_SESSIONS) {
    const sId = id("ps-placement", s.key);
    const startedAt = daysAgo(s.daysAgo);
    const isCompleted = s.status === "completed";
    const rawScore = s.rawScore ?? 0;
    const percentage = isCompleted ? Number(((rawScore / maxScore) * 100).toFixed(2)) : null;

    const sectionScores = isCompleted
      ? {
          "1": { correct: Math.min(2, rawScore), total: 2 },
          "2": { correct: Math.max(0, Math.min(2, rawScore - 2)), total: 2 },
          "3": { correct: Math.max(0, rawScore - 4), total: 2 },
        }
      : undefined;

    const data = {
      userId: userId(s.learnerKey),
      status: s.status,
      questionIds: PLACEMENT_Q_IDS,
      rawScore: isCompleted ? rawScore : null,
      maxScore: isCompleted ? maxScore : null,
      percentage,
      cefrLevel: isCompleted ? s.cefrLevel ?? null : null,
      sectionScores,
      lastQuestionIndex: s.lastQuestionIndex ?? (isCompleted ? maxScore : 0),
      completedAt: isCompleted ? new Date(startedAt.getTime() + 25 * 60 * 1000) : null,
    };

    await prisma.placementSession.upsert({
      where: { id: sId },
      update: data,
      create: { id: sId, startedAt, createdAt: startedAt, ...data },
    });
  }
}

async function seedPlacementAnswers(): Promise<void> {
  for (const s of PLACEMENT_SESSIONS) {
    if (s.status !== "completed") continue;
    const sId = id("ps-placement", s.key);
    const correctCount = s.rawScore ?? 0;

    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      const isCorrect = idx < correctCount;
      const qId = id("pq", q.key);
      const answerId = id("pa", `${s.key}-${q.key}`);

      // Build a selectedOption / selectedOrder consistent with type + correctness.
      let selectedOption: string | null = null;
      let selectedOrder: string | null = null;

      if (q.type === "mcq") {
        const correct = q.correctAnswer ?? "A";
        const wrong = correct === "A" ? "B" : "A";
        selectedOption = isCorrect ? correct : wrong;
      } else if (q.type === "reorder") {
        const correct = q.correctOrder ?? "ABC";
        selectedOrder = isCorrect ? correct : "BAC";
      } else {
        // fill_blank stores the typed answer in selectedOption (single-char schema
        // limits this; store a sentinel that fits VarChar(1)).
        selectedOption = isCorrect ? "Y" : "N";
      }

      placementAnswerUpserts.push({
        answerId,
        sId,
        qId,
        questionIndex: idx,
        selectedOption,
        selectedOrder,
        isCorrect,
        pointsEarned: isCorrect ? 1 : 0,
        timeSpent: 18 + idx * 3,
      });
    });
  }

  for (const a of placementAnswerUpserts) {
    await prisma.placementAnswer.upsert({
      where: { id: a.answerId },
      update: {
        sessionId: a.sId,
        questionId: a.qId,
        questionIndex: a.questionIndex,
        selectedOption: a.selectedOption,
        selectedOrder: a.selectedOrder,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned,
        timeSpent: a.timeSpent,
      },
      create: {
        id: a.answerId,
        sessionId: a.sId,
        questionId: a.qId,
        questionIndex: a.questionIndex,
        selectedOption: a.selectedOption,
        selectedOrder: a.selectedOrder,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned,
        timeSpent: a.timeSpent,
      },
    });
  }
}

interface PlacementAnswerRow {
  answerId: string;
  sId: string;
  qId: string;
  questionIndex: number;
  selectedOption: string | null;
  selectedOrder: string | null;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}
const placementAnswerUpserts: PlacementAnswerRow[] = [];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await seedEnglishTestTypes();
  await seedScoreConversions();
  await seedTestsAndSkills();
  await seedCourseTests();
  await seedSectionsPassagesQuestions();
  await seedPracticeSessions();
  await seedUserAnswers();
  await seedDictation();
  await seedTestComments();
  await seedTutorSession();
  await seedPlacementQuestions();
  await seedPlacementSessions();
  await seedPlacementAnswers();
}

main()
  .then(() => console.log("✓ assessment demo seed complete"))
  .catch((err) => {
    console.error("✗ assessment demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
