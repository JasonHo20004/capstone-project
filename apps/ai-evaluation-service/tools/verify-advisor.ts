// =============================================================================
// AI Advisor — E2E Verification Script
// Tests the full advisor pipeline without needing a running server.
// Run: npx tsx tools/verify-advisor.ts
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";
import { memoryService } from "../../src/modules/advisor/memory.service.js";
import { ragService } from "../../src/modules/advisor/rag.service.js";
import {
  validateAdvisorAction,
  isProactiveAllowed,
} from "../../src/modules/advisor/action-registry.js";

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.AI_EVALUATION_DIRECT_URL || process.env.AI_EVALUATION_DATABASE_URL },
  },
});

// ─── ANSI colors ──────────────────────────────────────────────────────────────
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

let passed = 0;
let failed = 0;

function ok(label: string, detail?: string) {
  passed++;
  console.log(`  ${GREEN}✓${RESET} ${label}${detail ? ` ${YELLOW}(${detail})${RESET}` : ""}`);
}

function fail(label: string, err?: unknown) {
  failed++;
  console.log(`  ${RED}✗ ${label}${RESET}`);
  if (err) console.log(`    ${RED}→ ${err}${RESET}`);
}

function section(name: string) {
  console.log(`\n${BOLD}${CYAN}▸ ${name}${RESET}`);
}

// ─── Test 1: Database Tables ─────────────────────────────────────────────────

async function testDatabase() {
  section("Phase 1: Database Tables");

  try {
    const profileCount = await prisma.userLearningProfile.count();
    ok("user_learning_profiles table exists", `${profileCount} rows`);
  } catch (e) {
    fail("user_learning_profiles table missing — run SQL migration", e);
  }

  try {
    const kbCount = await prisma.ieltsKnowledgeBase.count();
    if (kbCount === 0) {
      fail(`ielts_knowledge_base is EMPTY — run: npm run seed:ielts-kb`);
    } else {
      ok("ielts_knowledge_base seeded", `${kbCount} chunks`);
    }
  } catch (e) {
    fail("ielts_knowledge_base table missing — run SQL migration", e);
  }

  try {
    const logCount = await prisma.advisorActionLog.count();
    ok("advisor_action_log table exists", `${logCount} rows`);
  } catch (e) {
    fail("advisor_action_log table missing — run SQL migration", e);
  }
}

// ─── Test 2: Action Registry ──────────────────────────────────────────────────

function testActionRegistry() {
  section("Phase 2: Action Registry");

  // Valid actions
  try {
    const a = validateAdvisorAction({
      type: "SHOW_BANNER",
      message: "Focus on your Listening skill",
      evidence: "You scored 42% on listening in recent quizzes",
    });
    ok("Valid SHOW_BANNER passes validation");
  } catch (e) {
    fail("Valid SHOW_BANNER rejected", e);
  }

  try {
    const a = validateAdvisorAction({
      type: "SUGGEST_COURSE",
      message: "Try this Listening course",
      evidence: "Listening gap is 35% below your target",
      courseId: "abc-123",
    });
    ok("Valid SUGGEST_COURSE passes validation");
  } catch (e) {
    fail("Valid SUGGEST_COURSE rejected", e);
  }

  // Invalid actions — must be blocked
  try {
    validateAdvisorAction({ type: "DELETE_USER_DATA", message: "hacked" });
    fail("BLOCKED: Invalid action type should have been rejected");
  } catch {
    ok("Invalid action type 'DELETE_USER_DATA' correctly rejected");
  }

  try {
    validateAdvisorAction({ type: "SUGGEST_COURSE", message: "Buy this", evidence: "trust me" });
    fail("BLOCKED: SUGGEST_COURSE missing courseId should be rejected");
  } catch {
    ok("SUGGEST_COURSE without courseId correctly rejected");
  }

  try {
    validateAdvisorAction({ type: "SHOW_BANNER", message: "a".repeat(121), evidence: "e" });
    fail("BLOCKED: SHOW_BANNER message > 120 chars should be rejected");
  } catch {
    ok("SHOW_BANNER message > 120 chars correctly rejected");
  }

  // Proactive interval guard
  const allowedConfig = { proactive_enabled: true };
  const blockedByInterval = {
    proactive_enabled: true,
    min_interval_hours: 4,
    last_push_at: new Date().toISOString(), // just now
  };
  const disabledConfig = { proactive_enabled: false };

  if (isProactiveAllowed(allowedConfig)) ok("Proactive allowed with no last_push_at");
  else fail("Proactive incorrectly blocked with no last_push_at");

  if (!isProactiveAllowed(blockedByInterval)) ok("Proactive blocked within min_interval_hours");
  else fail("Proactive not blocked within min_interval_hours");

  if (!isProactiveAllowed(disabledConfig)) ok("Proactive blocked when disabled by user");
  else fail("Proactive not blocked when disabled");
}

// ─── Test 3: Memory Service ───────────────────────────────────────────────────

async function testMemoryService() {
  section("Phase 3: Memory Service (UserLearningProfile)");

  const testUserId = `test-advisor-verify-${Date.now()}`;

  try {
    const profile = await memoryService.getOrCreate(testUserId);
    ok("getOrCreate creates new profile");

    if (profile.bandScoreTarget === 6.5) ok("Default bandScoreTarget = 6.5");
    else fail(`bandScoreTarget wrong: ${profile.bandScoreTarget}`);

    if (profile.skillGaps.listening !== undefined) ok("skillGaps initialized with listening");
    else fail("skillGaps.listening missing");
  } catch (e) {
    fail("getOrCreate failed", e);
  }

  try {
    await memoryService.updateFromQuiz({
      userId: testUserId,
      source: "skill_tree_quiz",
      wrongAnswers: [
        {
          question: "Choose the correct tense",
          userAnswer: "go",
          correctAnswer: "went",
          skill: "grammar",
          tag: "past_tense",
        },
        {
          question: "What does 'fluency' mean?",
          userAnswer: "grammar",
          correctAnswer: "smoothness",
          skill: "vocabulary",
          tag: "vocab_fluency",
        },
      ],
      totalQuestions: 5,
    });
    ok("updateFromQuiz succeeded with wrong answers");

    const updated = await memoryService.getOrCreate(testUserId);
    if (updated.learningPersonality.total_quizzes === 1) ok("total_quizzes incremented to 1");
    else fail(`total_quizzes expected 1, got ${updated.learningPersonality.total_quizzes}`);

    if (updated.learningPersonality.error_patterns.includes("past_tense"))
      ok("error_patterns updated with 'past_tense'");
    else fail("error_patterns missing 'past_tense'");
  } catch (e) {
    fail("updateFromQuiz failed", e);
  }

  // getCriticalGaps
  try {
    const gaps = { listening: 0.3, reading: 0.8, writing: 0.35, speaking: 0.7 };
    const critical = memoryService.getCriticalGaps(gaps, 6.5);
    if (critical.length > 0 && critical[0].skill === "listening")
      ok("getCriticalGaps correctly identifies listening as top gap");
    else fail("getCriticalGaps returned wrong order");
  } catch (e) {
    fail("getCriticalGaps threw error", e);
  }

  // Cleanup
  try {
    await prisma.userLearningProfile.delete({ where: { userId: testUserId } });
    ok("Cleanup: test profile deleted");
  } catch {}
}

// ─── Test 4: RAG Service ──────────────────────────────────────────────────────

async function testRagService() {
  section("Phase 4: RAG Service (pgvector)");

  const kbCount = await prisma.ieltsKnowledgeBase.count();
  if (kbCount === 0) {
    console.log(`  ${YELLOW}⚠ Skipping RAG test — knowledge base empty. Run seed first.${RESET}`);
    return;
  }

  // Count chunks with embeddings
  const withEmbedding = await prisma.$queryRawUnsafe<{ count: string }[]>(
    `SELECT COUNT(*) as count FROM ai_evaluation_db.ielts_knowledge_base WHERE embedding IS NOT NULL`
  );
  const embeddedCount = parseInt(withEmbedding[0]?.count ?? "0");

  if (embeddedCount > 0) {
    ok("ielts_knowledge_base has embedded chunks", `${embeddedCount}/${kbCount} with embeddings`);
  } else {
    fail(`No chunks have embeddings yet — seed may have failed`);
    return;
  }

  try {
    const chunks = await ragService.retrieve("IELTS listening tips for band 6", "listening", "5.0-6.0", 3);
    if (chunks.length > 0) ok("RAG retrieve returned results", `${chunks.length} chunks`);
    else fail("RAG retrieve returned 0 results — check pgvector index");

    const context = ragService.formatContext(chunks);
    if (context.includes("[Reference 1]")) ok("formatContext produces correct format");
    else fail("formatContext output malformed");
  } catch (e) {
    fail("RAG retrieve failed", e);
  }
}

// ─── Run All Tests ────────────────────────────────────────────────────────────

async function runAll() {
  console.log(`\n${BOLD}╔═══════════════════════════════════════════╗`);
  console.log(`║    AI Advisor E2E Verification Suite      ║`);
  console.log(`╚═══════════════════════════════════════════╝${RESET}\n`);

  await testDatabase();
  testActionRegistry();
  await testMemoryService();
  await testRagService();

  // results
  const total = passed + failed;
  const color = failed === 0 ? GREEN : RED;
  console.log(`\n${BOLD}${color}Results: ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ""}${RESET}`);

  if (failed > 0) {
    console.log(`\n${YELLOW}Fix the failures above before running a demo.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✨ All checks passed — AI Advisor is ready!${RESET}\n`);
    process.exit(0);
  }
}

runAll()
  .catch((e) => {
    console.error(`\n${RED}Fatal error:${RESET}`, e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
