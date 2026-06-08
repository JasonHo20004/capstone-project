// =============================================================================
// Flashcard Service — Demo Seed
// -----------------------------------------------------------------------------
// Seeds Tag, FlashcardDeck, Flashcard, DeckTag, and UserFlashcardProgress.
//
// Fully idempotent: every row uses a deterministic UUID (deckId/flashcardId
// helpers, Tags via id('tag', name)) and is written with upsert keyed on its
// primary key, so this script is safe to re-run against the live DB. Nothing is
// ever deleted.
//
// Cross-service reference: FlashcardDeck.userId = userId(ownerKey) — the same
// UUID the identity service assigns to that user.
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  LEARNERS,
  SELLERS,
  daysAgo,
  daysFromNow,
  id,
  userId,
  deckId,
  flashcardId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.FLASHCARD_DIRECT_URL ?? process.env.FLASHCARD_DATABASE_URL } },
});

// Reference the imported user catalogs so they participate in seed validation
// even though owners/learners are addressed by key below.
const KNOWN_USER_KEYS = new Set([
  ...LEARNERS.map((u) => u.key),
  ...SELLERS.map((u) => u.key),
]);

const TTS_BASE = "https://cdn.demo.capstone.local/tts";
const audioFor = (key: string) => `${TTS_BASE}/${key}.mp3`;

// ─── Tags ────────────────────────────────────────────────────────────────────

const TAG_NAMES = [
  "IELTS",
  "TOEIC",
  "Business",
  "Travel",
  "Food",
  "Phrasal Verbs",
  "Academic",
  "Daily",
] as const;

type TagName = (typeof TAG_NAMES)[number];

// ─── Decks ─────────────────────────────────────────────────────────────────

type FlashcardStatus = "LEARNING" | "REVIEW";

interface DemoFlashcard {
  // Suffix appended to the deck key to form the flashcard key, e.g. "-1".
  suffix: string;
  front: string;
  back: string;
  example: string;
  audio: boolean;
}

interface DemoDeck {
  key: string;
  title: string;
  description: string;
  ownerKey: string;
  isPublic: boolean;
  createdDaysAgo: number;
  tags: TagName[];
  cards: DemoFlashcard[];
}

const DECKS: DemoDeck[] = [
  {
    key: "deck-ielts-aca",
    title: "IELTS Academic Word List 1",
    description: "Từ vựng học thuật thiết yếu cho IELTS band 6.5+, kèm ví dụ trong ngữ cảnh.",
    ownerKey: "seller-minh",
    isPublic: true,
    createdDaysAgo: 120,
    tags: ["IELTS", "Academic"],
    cards: [
      { suffix: "-1", front: "analyse", back: "(v) phân tích — examine in detail to understand or explain", example: "Researchers analyse the data before drawing conclusions.", audio: true },
      { suffix: "-2", front: "significant", back: "(adj) đáng kể, quan trọng — large enough to be noticed or have an effect", example: "There was a significant increase in tuition fees last year.", audio: true },
      { suffix: "-3", front: "establish", back: "(v) thiết lập, thành lập — to set up or create something that lasts", example: "The university was established in 1965.", audio: false },
      { suffix: "-4", front: "consequently", back: "(adv) do đó, vì vậy — as a result of something", example: "He missed the deadline and consequently lost marks.", audio: true },
      { suffix: "-5", front: "hypothesis", back: "(n) giả thuyết — an idea proposed as a starting point for investigation", example: "The experiment was designed to test the hypothesis.", audio: false },
      { suffix: "-6", front: "comprehensive", back: "(adj) toàn diện, đầy đủ — complete and including everything necessary", example: "The report offers a comprehensive overview of the issue.", audio: true },
      { suffix: "-7", front: "subsequent", back: "(adj) tiếp theo, sau đó — coming after something in time", example: "The findings were confirmed in subsequent studies.", audio: false },
      { suffix: "-8", front: "phenomenon", back: "(n) hiện tượng — a fact or situation that is observed to exist", example: "Climate change is a global phenomenon affecting everyone.", audio: true },
    ],
  },
  {
    key: "deck-toeic-biz",
    title: "TOEIC Business Vocabulary",
    description: "Từ vựng thương mại thường gặp trong đề TOEIC: hợp đồng, hoá đơn, họp hành.",
    ownerKey: "seller-trang",
    isPublic: true,
    createdDaysAgo: 95,
    tags: ["TOEIC", "Business"],
    cards: [
      { suffix: "-1", front: "invoice", back: "(n) hoá đơn — a document requesting payment for goods or services", example: "Please send the invoice to the accounting department.", audio: true },
      { suffix: "-2", front: "negotiate", back: "(v) đàm phán — to discuss in order to reach an agreement", example: "We need to negotiate better terms with the supplier.", audio: true },
      { suffix: "-3", front: "deadline", back: "(n) hạn chót — the latest time by which something must be done", example: "The deadline for the proposal is next Friday.", audio: false },
      { suffix: "-4", front: "shareholder", back: "(n) cổ đông — a person who owns shares in a company", example: "The shareholders voted to approve the merger.", audio: false },
      { suffix: "-5", front: "reimburse", back: "(v) hoàn trả, bồi hoàn — to pay back money that someone has spent", example: "The company will reimburse you for travel expenses.", audio: true },
      { suffix: "-6", front: "quarterly", back: "(adj/adv) hàng quý — happening every three months", example: "The board reviews performance on a quarterly basis.", audio: false },
      { suffix: "-7", front: "procurement", back: "(n) việc mua sắm, đấu thầu — the process of obtaining supplies", example: "The procurement team handles all vendor contracts.", audio: true },
      { suffix: "-8", front: "stakeholder", back: "(n) bên liên quan — a person with an interest in a business", example: "We must keep all stakeholders informed of the changes.", audio: false },
    ],
  },
  {
    key: "deck-phrasal",
    title: "Common Phrasal Verbs",
    description: "Cụm động từ thông dụng trong giao tiếp hằng ngày, kèm nghĩa và ví dụ.",
    ownerKey: "seller-linh",
    isPublic: true,
    createdDaysAgo: 80,
    tags: ["Phrasal Verbs", "Daily"],
    cards: [
      { suffix: "-1", front: "give up", back: "(phr.v) từ bỏ — to stop trying to do something", example: "Don't give up; you're almost there.", audio: true },
      { suffix: "-2", front: "look after", back: "(phr.v) chăm sóc — to take care of someone or something", example: "Can you look after my dog while I'm away?", audio: false },
      { suffix: "-3", front: "put off", back: "(phr.v) trì hoãn — to postpone or delay something", example: "We had to put off the meeting until next week.", audio: true },
      { suffix: "-4", front: "run into", back: "(phr.v) tình cờ gặp — to meet someone unexpectedly", example: "I ran into an old friend at the airport.", audio: false },
      { suffix: "-5", front: "turn down", back: "(phr.v) từ chối — to reject an offer or request", example: "She turned down the job offer in London.", audio: true },
      { suffix: "-6", front: "bring up", back: "(phr.v) nêu ra, đề cập — to mention or introduce a topic", example: "He brought up an interesting point during the discussion.", audio: false },
      { suffix: "-7", front: "carry on", back: "(phr.v) tiếp tục — to continue doing something", example: "Please carry on with your work.", audio: true },
    ],
  },
  {
    key: "deck-travel",
    title: "Travel Essentials",
    description: "Từ vựng cần thiết khi đi du lịch: sân bay, khách sạn, hỏi đường.",
    ownerKey: "an",
    isPublic: true,
    createdDaysAgo: 45,
    tags: ["Travel", "Daily"],
    cards: [
      { suffix: "-1", front: "boarding pass", back: "(n) thẻ lên máy bay — a document allowing you to board a plane", example: "Please have your boarding pass ready at the gate.", audio: true },
      { suffix: "-2", front: "luggage", back: "(n) hành lý — bags and suitcases for travelling", example: "My luggage was lost during the connecting flight.", audio: false },
      { suffix: "-3", front: "itinerary", back: "(n) lịch trình — a planned route or schedule of a journey", example: "Our itinerary includes three days in Rome.", audio: true },
      { suffix: "-4", front: "departure", back: "(n) sự khởi hành — the act of leaving on a journey", example: "The departure time has been delayed by an hour.", audio: false },
      { suffix: "-5", front: "currency", back: "(n) tiền tệ — the system of money used in a country", example: "You can exchange currency at the airport.", audio: true },
      { suffix: "-6", front: "reservation", back: "(n) sự đặt chỗ — an arrangement to keep something for a customer", example: "I'd like to make a reservation for two nights.", audio: false },
      { suffix: "-7", front: "sightseeing", back: "(n) sự tham quan — visiting interesting places as a tourist", example: "We spent the afternoon sightseeing in the old town.", audio: false },
    ],
  },
  {
    key: "deck-food",
    title: "Food & Cooking",
    description: "Từ vựng về ẩm thực và nấu nướng cho hội thoại đời thường.",
    ownerKey: "chi",
    isPublic: true,
    createdDaysAgo: 30,
    tags: ["Food", "Daily"],
    cards: [
      { suffix: "-1", front: "recipe", back: "(n) công thức nấu ăn — a set of instructions for preparing a dish", example: "This recipe takes only twenty minutes to prepare.", audio: true },
      { suffix: "-2", front: "ingredient", back: "(n) nguyên liệu — any food used to make a particular dish", example: "Fresh basil is the key ingredient in this sauce.", audio: false },
      { suffix: "-3", front: "simmer", back: "(v) ninh nhỏ lửa — to cook gently just below boiling point", example: "Let the soup simmer for thirty minutes.", audio: true },
      { suffix: "-4", front: "seasoning", back: "(n) gia vị — salt, herbs or spices added to food", example: "Add seasoning to taste before serving.", audio: false },
      { suffix: "-5", front: "leftovers", back: "(n) thức ăn thừa — food remaining after a meal", example: "We had the leftovers for lunch the next day.", audio: false },
      { suffix: "-6", front: "appetizer", back: "(n) món khai vị — a small dish served before the main course", example: "The spring rolls make a great appetizer.", audio: true },
    ],
  },
  {
    key: "deck-an-private",
    title: "An's Tricky Words",
    description: "Bộ thẻ riêng của An: những từ hay nhầm cần ôn lại thường xuyên.",
    ownerKey: "an",
    isPublic: false,
    createdDaysAgo: 18,
    tags: ["Academic"],
    cards: [
      { suffix: "-1", front: "affect", back: "(v) ảnh hưởng đến — to have an influence on something (verb)", example: "The weather can affect your mood.", audio: false },
      { suffix: "-2", front: "effect", back: "(n) tác động, kết quả — a change that results from an action (noun)", example: "The new policy had a positive effect on sales.", audio: false },
      { suffix: "-3", front: "principle", back: "(n) nguyên tắc — a fundamental truth or rule", example: "She refused to compromise her principles.", audio: false },
      { suffix: "-4", front: "principal", back: "(n/adj) hiệu trưởng; chính yếu — the head of a school; most important", example: "The principal addressed the students this morning.", audio: false },
      { suffix: "-5", front: "complement", back: "(v/n) bổ sung — something that completes or goes well with another", example: "The wine complements the cheese perfectly.", audio: false },
      { suffix: "-6", front: "compliment", back: "(v/n) lời khen — a polite expression of praise", example: "She gave me a nice compliment on my presentation.", audio: false },
    ],
  },
  {
    key: "deck-dung-aca",
    title: "Dũng's Academic Deck",
    description: "Từ vựng học thuật nâng cao cho mục tiêu IELTS 7.5 và viết luận.",
    ownerKey: "dung",
    isPublic: true,
    createdDaysAgo: 60,
    tags: ["Academic", "IELTS"],
    cards: [
      { suffix: "-1", front: "advocate", back: "(v) ủng hộ, biện hộ — to publicly support a particular cause", example: "Many economists advocate for higher taxes on carbon.", audio: true },
      { suffix: "-2", front: "deteriorate", back: "(v) xấu đi, suy thoái — to become progressively worse", example: "Air quality continues to deteriorate in large cities.", audio: false },
      { suffix: "-3", front: "inevitable", back: "(adj) không thể tránh khỏi — certain to happen", example: "Some degree of conflict is inevitable in any team.", audio: true },
      { suffix: "-4", front: "underlying", back: "(adj) tiềm ẩn, nền tảng — important but not immediately obvious", example: "We must address the underlying causes of poverty.", audio: false },
      { suffix: "-5", front: "compelling", back: "(adj) thuyết phục, hấp dẫn — convincing and powerful", example: "She made a compelling argument for reform.", audio: true },
      { suffix: "-6", front: "diminish", back: "(v) giảm bớt, suy giảm — to make or become smaller or less", example: "The pain gradually diminished over time.", audio: false },
      { suffix: "-7", front: "prevalent", back: "(adj) phổ biến, thịnh hành — widespread in a particular area", example: "This attitude is prevalent among younger workers.", audio: false },
      { suffix: "-8", front: "scrutiny", back: "(n) sự xem xét kỹ — critical observation or examination", example: "The proposal came under close scrutiny from the board.", audio: true },
    ],
  },
  {
    key: "deck-daily",
    title: "Daily Conversation",
    description: "Cụm từ và từ vựng giao tiếp hằng ngày cho người mới bắt đầu.",
    ownerKey: "ha",
    isPublic: true,
    createdDaysAgo: 12,
    tags: ["Daily"],
    cards: [
      { suffix: "-1", front: "How's it going?", back: "(phrase) Dạo này thế nào? — an informal greeting asking about wellbeing", example: "Hey Tom, how's it going?", audio: true },
      { suffix: "-2", front: "I appreciate it", back: "(phrase) Tôi rất cảm kích — a way to express gratitude", example: "Thanks for helping me move; I appreciate it.", audio: false },
      { suffix: "-3", front: "no worries", back: "(phrase) không sao đâu — a casual way to say it's fine", example: "No worries, I can wait a few more minutes.", audio: true },
      { suffix: "-4", front: "by the way", back: "(phrase) nhân tiện — used to introduce a new topic", example: "By the way, did you finish the report?", audio: false },
      { suffix: "-5", front: "make sense", back: "(phrase) hợp lý, dễ hiểu — to be reasonable or understandable", example: "Your explanation makes sense now.", audio: false },
      { suffix: "-6", front: "catch up", back: "(phrase) gặp lại, hàn huyên — to talk with someone after time apart", example: "Let's catch up over coffee this weekend.", audio: true },
    ],
  },
];

// ─── User progress (SRS state) ───────────────────────────────────────────────

interface DemoProgress {
  learnerKey: string;
  deckKey: string;
  cardSuffix: string;
  status: FlashcardStatus;
  repetitions: number;
  easeFactor: number;
  interval: number;
  learningStep: number;
  nextReviewDaysFromNow: number; // negative = overdue
}

// SRS rows for 5 learners across PUBLIC decks they would study. Negative
// nextReviewDaysFromNow values are intentionally overdue cards.
const PROGRESS: DemoProgress[] = [
  // An — studying travel (own public) + IELTS academic
  { learnerKey: "an", deckKey: "deck-travel", cardSuffix: "-1", status: "REVIEW", repetitions: 4, easeFactor: 2.5, interval: 12, learningStep: 0, nextReviewDaysFromNow: 5 },
  { learnerKey: "an", deckKey: "deck-travel", cardSuffix: "-2", status: "REVIEW", repetitions: 3, easeFactor: 2.4, interval: 8, learningStep: 0, nextReviewDaysFromNow: -1 },
  { learnerKey: "an", deckKey: "deck-ielts-aca", cardSuffix: "-1", status: "LEARNING", repetitions: 1, easeFactor: 2.3, interval: 1, learningStep: 1, nextReviewDaysFromNow: 0 },
  { learnerKey: "an", deckKey: "deck-ielts-aca", cardSuffix: "-2", status: "LEARNING", repetitions: 0, easeFactor: 2.5, interval: 0, learningStep: 0, nextReviewDaysFromNow: -2 },
  { learnerKey: "an", deckKey: "deck-ielts-aca", cardSuffix: "-3", status: "REVIEW", repetitions: 2, easeFactor: 2.6, interval: 6, learningStep: 0, nextReviewDaysFromNow: 3 },
  { learnerKey: "an", deckKey: "deck-phrasal", cardSuffix: "-1", status: "REVIEW", repetitions: 5, easeFactor: 2.7, interval: 18, learningStep: 0, nextReviewDaysFromNow: 9 },

  // Bình — TOEIC business + phrasal verbs
  { learnerKey: "binh", deckKey: "deck-toeic-biz", cardSuffix: "-1", status: "REVIEW", repetitions: 6, easeFactor: 2.7, interval: 21, learningStep: 0, nextReviewDaysFromNow: 10 },
  { learnerKey: "binh", deckKey: "deck-toeic-biz", cardSuffix: "-2", status: "REVIEW", repetitions: 4, easeFactor: 2.5, interval: 10, learningStep: 0, nextReviewDaysFromNow: 2 },
  { learnerKey: "binh", deckKey: "deck-toeic-biz", cardSuffix: "-3", status: "REVIEW", repetitions: 3, easeFactor: 2.4, interval: 7, learningStep: 0, nextReviewDaysFromNow: -1 },
  { learnerKey: "binh", deckKey: "deck-toeic-biz", cardSuffix: "-5", status: "LEARNING", repetitions: 1, easeFactor: 2.3, interval: 1, learningStep: 2, nextReviewDaysFromNow: 0 },
  { learnerKey: "binh", deckKey: "deck-phrasal", cardSuffix: "-3", status: "REVIEW", repetitions: 5, easeFactor: 2.6, interval: 15, learningStep: 0, nextReviewDaysFromNow: 7 },
  { learnerKey: "binh", deckKey: "deck-phrasal", cardSuffix: "-5", status: "LEARNING", repetitions: 2, easeFactor: 2.4, interval: 2, learningStep: 1, nextReviewDaysFromNow: 1 },

  // Chi — food (own public) + daily
  { learnerKey: "chi", deckKey: "deck-food", cardSuffix: "-1", status: "REVIEW", repetitions: 3, easeFactor: 2.5, interval: 6, learningStep: 0, nextReviewDaysFromNow: 4 },
  { learnerKey: "chi", deckKey: "deck-food", cardSuffix: "-2", status: "LEARNING", repetitions: 1, easeFactor: 2.3, interval: 1, learningStep: 1, nextReviewDaysFromNow: 0 },
  { learnerKey: "chi", deckKey: "deck-food", cardSuffix: "-3", status: "LEARNING", repetitions: 0, easeFactor: 2.5, interval: 0, learningStep: 0, nextReviewDaysFromNow: -2 },
  { learnerKey: "chi", deckKey: "deck-daily", cardSuffix: "-1", status: "REVIEW", repetitions: 2, easeFactor: 2.4, interval: 4, learningStep: 0, nextReviewDaysFromNow: 2 },
  { learnerKey: "chi", deckKey: "deck-daily", cardSuffix: "-3", status: "LEARNING", repetitions: 1, easeFactor: 2.2, interval: 1, learningStep: 2, nextReviewDaysFromNow: 1 },

  // Dũng — own academic deck + IELTS academic
  { learnerKey: "dung", deckKey: "deck-dung-aca", cardSuffix: "-1", status: "REVIEW", repetitions: 6, easeFactor: 2.7, interval: 20, learningStep: 0, nextReviewDaysFromNow: 8 },
  { learnerKey: "dung", deckKey: "deck-dung-aca", cardSuffix: "-2", status: "REVIEW", repetitions: 5, easeFactor: 2.6, interval: 14, learningStep: 0, nextReviewDaysFromNow: 6 },
  { learnerKey: "dung", deckKey: "deck-dung-aca", cardSuffix: "-3", status: "REVIEW", repetitions: 4, easeFactor: 2.5, interval: 9, learningStep: 0, nextReviewDaysFromNow: -1 },
  { learnerKey: "dung", deckKey: "deck-dung-aca", cardSuffix: "-4", status: "LEARNING", repetitions: 2, easeFactor: 2.4, interval: 2, learningStep: 1, nextReviewDaysFromNow: 0 },
  { learnerKey: "dung", deckKey: "deck-ielts-aca", cardSuffix: "-4", status: "REVIEW", repetitions: 3, easeFactor: 2.5, interval: 7, learningStep: 0, nextReviewDaysFromNow: 3 },
  { learnerKey: "dung", deckKey: "deck-ielts-aca", cardSuffix: "-5", status: "REVIEW", repetitions: 4, easeFactor: 2.6, interval: 11, learningStep: 0, nextReviewDaysFromNow: 5 },
  { learnerKey: "dung", deckKey: "deck-ielts-aca", cardSuffix: "-8", status: "LEARNING", repetitions: 1, easeFactor: 2.3, interval: 1, learningStep: 2, nextReviewDaysFromNow: -2 },

  // Hà — own daily deck + TOEIC business
  { learnerKey: "ha", deckKey: "deck-daily", cardSuffix: "-2", status: "REVIEW", repetitions: 4, easeFactor: 2.6, interval: 10, learningStep: 0, nextReviewDaysFromNow: 4 },
  { learnerKey: "ha", deckKey: "deck-daily", cardSuffix: "-4", status: "REVIEW", repetitions: 3, easeFactor: 2.5, interval: 6, learningStep: 0, nextReviewDaysFromNow: 2 },
  { learnerKey: "ha", deckKey: "deck-daily", cardSuffix: "-6", status: "LEARNING", repetitions: 1, easeFactor: 2.3, interval: 1, learningStep: 1, nextReviewDaysFromNow: 0 },
  { learnerKey: "ha", deckKey: "deck-toeic-biz", cardSuffix: "-2", status: "REVIEW", repetitions: 5, easeFactor: 2.6, interval: 13, learningStep: 0, nextReviewDaysFromNow: 7 },
  { learnerKey: "ha", deckKey: "deck-toeic-biz", cardSuffix: "-6", status: "LEARNING", repetitions: 0, easeFactor: 2.5, interval: 0, learningStep: 0, nextReviewDaysFromNow: -1 },
];

// ─── Seed steps ──────────────────────────────────────────────────────────────

async function seedTags(): Promise<Map<TagName, string>> {
  const tagIdByName = new Map<TagName, string>();
  for (const name of TAG_NAMES) {
    const tagId = id("tag", name);
    tagIdByName.set(name, tagId);
    await prisma.tag.upsert({
      where: { id: tagId },
      update: { name },
      create: { id: tagId, name },
    });
  }
  return tagIdByName;
}

async function seedDecksAndCards(): Promise<void> {
  for (const deck of DECKS) {
    if (!KNOWN_USER_KEYS.has(deck.ownerKey)) {
      throw new Error(`Deck "${deck.key}" references unknown owner key "${deck.ownerKey}".`);
    }
    const dId = deckId(deck.key);
    const ownerId = userId(deck.ownerKey);
    const createdAt = daysAgo(deck.createdDaysAgo);

    await prisma.flashcardDeck.upsert({
      where: { id: dId },
      update: {
        title: deck.title,
        description: deck.description,
        isPublic: deck.isPublic,
        userId: ownerId,
        createdAt,
      },
      create: {
        id: dId,
        title: deck.title,
        description: deck.description,
        isPublic: deck.isPublic,
        userId: ownerId,
        createdAt,
      },
    });

    for (const card of deck.cards) {
      const cardKey = `${deck.key}${card.suffix}`;
      const fId = flashcardId(cardKey);
      const audioUrl = card.audio ? audioFor(cardKey) : null;
      await prisma.flashcard.upsert({
        where: { id: fId },
        update: {
          frontContent: card.front,
          backContent: card.back,
          exampleSentence: card.example,
          audioUrl,
          videoUrl: null,
          deckId: dId,
        },
        create: {
          id: fId,
          frontContent: card.front,
          backContent: card.back,
          exampleSentence: card.example,
          audioUrl,
          videoUrl: null,
          deckId: dId,
        },
      });
    }
  }
}

async function seedDeckTags(tagIdByName: Map<TagName, string>): Promise<void> {
  for (const deck of DECKS) {
    const dId = deckId(deck.key);
    for (const tagName of deck.tags) {
      const tagId = tagIdByName.get(tagName);
      if (!tagId) {
        throw new Error(`Deck "${deck.key}" references unknown tag "${tagName}".`);
      }
      await prisma.deckTag.upsert({
        where: { tagId_deckId: { tagId, deckId: dId } },
        update: {},
        create: { tagId, deckId: dId },
      });
    }
  }
}

async function seedProgress(): Promise<void> {
  for (const p of PROGRESS) {
    if (!KNOWN_USER_KEYS.has(p.learnerKey)) {
      throw new Error(`Progress references unknown learner key "${p.learnerKey}".`);
    }
    const learnerId = userId(p.learnerKey);
    const fId = flashcardId(`${p.deckKey}${p.cardSuffix}`);
    const nextReviewAt = daysFromNow(p.nextReviewDaysFromNow);
    await prisma.userFlashcardProgress.upsert({
      where: { userId_flashcardId: { userId: learnerId, flashcardId: fId } },
      update: {
        status: p.status,
        repetitions: p.repetitions,
        easeFactor: p.easeFactor,
        interval: p.interval,
        learningStep: p.learningStep,
        nextReviewAt,
      },
      create: {
        userId: learnerId,
        flashcardId: fId,
        status: p.status,
        repetitions: p.repetitions,
        easeFactor: p.easeFactor,
        interval: p.interval,
        learningStep: p.learningStep,
        nextReviewAt,
      },
    });
  }
}

async function main(): Promise<void> {
  const tagIdByName = await seedTags();
  await seedDecksAndCards();
  await seedDeckTags(tagIdByName);
  await seedProgress();

  const totalCards = DECKS.reduce((sum, d) => sum + d.cards.length, 0);
  const totalDeckTags = DECKS.reduce((sum, d) => sum + d.tags.length, 0);
  console.log(
    `  tags=${TAG_NAMES.length} decks=${DECKS.length} flashcards=${totalCards} ` +
      `deckTags=${totalDeckTags} progress=${PROGRESS.length}`,
  );
}

main()
  .then(() => console.log("✓ flashcard demo seed complete"))
  .catch((err) => {
    console.error("✗ flashcard demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
