// =============================================================================
// IELTS Knowledge Base Seeder
// Seeds ~120 curated IELTS knowledge chunks into ielts_knowledge_base
// then generates embeddings via Google text-embedding-004 and stores them.
//
// Run: npx tsx tools/seed-ielts-kb/seed.ts
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";
import geminiClient from "../../src/llm/gemini.client.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AI_EVALUATION_DIRECT_URL || process.env.AI_EVALUATION_DATABASE_URL,
    },
  },
});

// ─── Embedding Helper ──────────────────────────────────────────────────────────

// Delegates to the shared Gemini client (Vertex AI first). Same embed path as the
// query side in RagService, so seeded vectors and query vectors share one model
// and live in the same space — a prerequisite for correct cosine similarity.
async function embed(text: string): Promise<number[]> {
  return geminiClient.embed(text);
}

// ─── Knowledge Chunks ─────────────────────────────────────────────────────────
// Source: IELTS.org official band descriptors + Cambridge IELTS published guides

interface KnowledgeChunk {
  content: string;
  skill: string;
  bandRange: string;
  source: string;
}

const IELTS_KNOWLEDGE: KnowledgeChunk[] = [
  // ──────────────── LISTENING ────────────────
  {
    content:
      "IELTS Listening Band 5-6: Students often miss answers because they predict the wrong word form. Train yourself to listen for paraphrases — the recording rarely uses the exact words from the question. Focus on synonyms and related expressions.",
    skill: "listening",
    bandRange: "5.0-6.0",
    source: "IELTS.org Listening Guide",
  },
  {
    content:
      "IELTS Listening Band 5-6: Number and spelling errors are the most common reason for losing marks at this level. Always double-check spellings for proper nouns. Listen carefully for plural vs singular forms.",
    skill: "listening",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 15",
  },
  {
    content:
      "IELTS Listening Band 6-7: Section 3 and 4 require academic listening. In Section 4 (monologue), the answers follow the order of the questions — use this to track your place in the audio. Do not spend more than 5 seconds on a missed answer; move forward.",
    skill: "listening",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 16",
  },
  {
    content:
      "IELTS Listening Band 6-7: Map and diagram labeling questions require fast orientation. Before listening, study the map: identify landmarks, directions (north/south/left/right), and any pre-labeled locations. These give context clues.",
    skill: "listening",
    bandRange: "6.0-7.0",
    source: "IELTS.org Band Descriptors",
  },
  {
    content:
      "IELTS Listening Band 7-9: At this level, candidates must infer meaning from tone, emphasis, and implication. The speaker may contradict themselves or change their mind — listen for hedging language: 'actually', 'on the other hand', 'I'm not sure anymore'.",
    skill: "listening",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },
  {
    content:
      "IELTS Listening: Common error — writing more words than allowed in gap-fill. If the instruction says 'ONE WORD AND/OR A NUMBER', writing 'a large number' is wrong. Always count your words before writing.",
    skill: "listening",
    bandRange: "5.0-6.0",
    source: "IELTS.org Common Mistakes",
  },
  {
    content:
      "IELTS Listening: For multiple-choice questions, eliminate obviously wrong options during the first listening. Distractors are designed to sound similar to correct answers. The speaker often mentions the wrong answer first, then corrects it.",
    skill: "listening",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 14",
  },
  {
    content:
      "IELTS Listening Band 7-9: Matching questions (e.g., matching speakers to opinions) require tracking each speaker separately. Use a simple table with speaker names as rows and options as columns. Eliminate as you listen.",
    skill: "listening",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },

  // ──────────────── READING ────────────────
  {
    content:
      "IELTS Reading Band 5-6: True/False/Not Given is the most failed question type. Key rule: TRUE = information matches; FALSE = information contradicts; NOT GIVEN = information is absent from the text. Do NOT use outside knowledge.",
    skill: "reading",
    bandRange: "5.0-6.0",
    source: "IELTS.org Reading Guide",
  },
  {
    content:
      "IELTS Reading Band 5-6: Skimming means reading very quickly to get the main idea (30-60 seconds per passage). Scanning means searching for a specific word or number. Use skimming first, then scanning to find answers. Never read every word in detail.",
    skill: "reading",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 13",
  },
  {
    content:
      "IELTS Reading Band 6-7: For matching headings questions, read the first and last sentence of each paragraph — the topic sentence almost always contains the main idea. Ignore details inside the paragraph for this question type.",
    skill: "reading",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 15",
  },
  {
    content:
      "IELTS Reading Band 6-7: Paragraph matching questions require understanding of the overall argument, not just keywords. A paragraph might discuss the same topic as an adjacent paragraph — look for which paragraph has the SPECIFIC information asked.",
    skill: "reading",
    bandRange: "6.0-7.0",
    source: "IELTS.org Band Descriptors",
  },
  {
    content:
      "IELTS Reading Band 7-9: Sentence completion requires grammatical compatibility — the completed sentence must be grammatically correct. If the gap is after 'a', the answer must be a singular noun. Check grammar, not just meaning.",
    skill: "reading",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 16",
  },
  {
    content:
      "IELTS Reading: Time management — spend no more than 20 minutes per passage. If a question takes more than 2 minutes, mark your best guess and move on. Unanswered questions score 0.",
    skill: "reading",
    bandRange: "5.0-6.0",
    source: "IELTS.org Test-taking Tips",
  },
  {
    content:
      "IELTS Reading Band 7-9: At higher bands, passage vocabulary becomes technical and academic. Build a habit of understanding words from context rather than exact meanings. Focus on whether a word is positive/negative/neutral and its grammatical role.",
    skill: "reading",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },
  {
    content:
      "IELTS Reading: For Yes/No/Not Given questions (opinion-based), the writer's opinion must be explicitly stated. If the writer's opinion is NOT clearly expressed in the text, the answer is NOT GIVEN — even if you personally disagree or agree.",
    skill: "reading",
    bandRange: "6.0-7.0",
    source: "IELTS.org Common Mistakes",
  },

  // ──────────────── WRITING TASK 1 ────────────────
  {
    content:
      "IELTS Writing Task 1 Band 5-6: A common error is copying data without analysis. Instead of listing every number, identify the TREND. Ask yourself: What is the most significant change? What is the overall pattern? Start with an overview paragraph before details.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "IELTS.org Writing Band Descriptors",
  },
  {
    content:
      "IELTS Writing Task 1 Band 5-6 Overview formula: 'Overall, it is clear that [main trend 1] while [main trend 2].' The overview must NOT include specific data (no numbers). It summarizes the key feature the examiner should notice.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 14",
  },
  {
    content:
      "IELTS Writing Task 1 Band 6-7: For line graphs and bar charts, use precise language: 'rose significantly', 'declined gradually', 'remained relatively stable', 'fluctuated slightly'. Vague language like 'went up' reduces your Lexical Resource score.",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 15",
  },
  {
    content:
      "IELTS Writing Task 1 Band 6-7: Process diagrams require passive voice: 'Water is heated → Steam is produced → Energy is generated.' Each stage must be linked with logical sequencing words: first, then, subsequently, finally, at this point.",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "IELTS.org Task 1 Guide",
  },
  {
    content:
      "IELTS Writing Task 1 Band 7-9: Group data intelligently. Instead of describing each country separately, group them: 'The USA, UK, and Australia all showed similar patterns, rising from X to Y, while Asian countries saw the opposite trend.' This demonstrates analytical skill.",
    skill: "writing",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },
  {
    content:
      "IELTS Writing Task 1: Minimum 150 words required. Below 150 = automatic penalty. Aim for 170-180 words. Spending more than 25 minutes on Task 1 steals time from the more heavily-weighted Task 2.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "IELTS.org Official Rules",
  },

  // ──────────────── WRITING TASK 2 ────────────────
  {
    content:
      "IELTS Writing Task 2 Band 5-6: The most common Task Achievement error is not answering all parts of the question. 'Discuss both views AND give your opinion' requires THREE positions: View A, View B, and YOUR view. Missing your opinion = Band 5 maximum for Task Achievement.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "IELTS.org Band Descriptors Task 2",
  },
  {
    content:
      "IELTS Writing Task 2 Band 5-6 Structure: Introduction (paraphrase + thesis) → Body 1 (main argument) → Body 2 (supporting argument OR counterargument) → Conclusion (restate thesis). Each body paragraph = 1 clear main idea + example + explanation.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 13",
  },
  {
    content:
      "IELTS Writing Task 2 Band 6-7: Coherence & Cohesion requires varied linking devices. Do NOT start every sentence with 'Furthermore' or 'However'. Mix reference words (this, these, such), conjunctions (while, although), and adverbials (consequently, nevertheless).",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "IELTS.org Coherence Guide",
  },
  {
    content:
      "IELTS Writing Task 2 Band 6-7: For Lexical Resource, avoid repeating the same word more than twice. Use synonyms, antonyms, and collocations. 'Important' can become: significant, crucial, vital, essential, pivotal depending on context.",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 16",
  },
  {
    content:
      "IELTS Writing Task 2 Band 7-9: High-band essays show 'position' rather than describing both sides equally. Your argument should build logically, with each paragraph advancing the thesis. Avoid 'on one hand... on the other hand' unless explicitly asked to discuss both views.",
    skill: "writing",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },
  {
    content:
      "IELTS Writing Task 2: Minimum 250 words. Below 250 = score penalty. Aim for 270-290 words. More than 350 words risks introducing errors and wasting time. Quality matters more than quantity above 250.",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "IELTS.org Official Rules",
  },
  {
    content:
      "IELTS Writing Task 2 Band 7-9 Grammar: Use complex structures naturally — relative clauses ('which has led to...'), conditionals ('If this trend continues...'), nominalization ('The introduction of technology has...'), and passive voice for academic objectivity.",
    skill: "writing",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 15",
  },
  {
    content:
      "IELTS Writing Task 2: Introduction template — DO NOT copy the question. Paraphrase it, then state your position. Example: Q: 'Some believe technology improves education. Do you agree?' → 'While technology has transformed many sectors, the extent to which it enhances educational outcomes remains a subject of debate. This essay argues that digital tools can significantly improve learning when implemented strategically.'",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "IELTS.org Writing Guide",
  },

  // ──────────────── SPEAKING ────────────────
  {
    content:
      "IELTS Speaking Band 5-6: The most common error at this band is using short, simple answers. In Part 1, always extend your answer with a reason and example. Formula: Answer + Reason + Example. 'I like football. I play it every weekend with my friends because it keeps me fit.'",
    skill: "speaking",
    bandRange: "5.0-6.0",
    source: "IELTS.org Speaking Band Descriptors",
  },
  {
    content:
      "IELTS Speaking Band 5-6: Filler words ('um', 'uh', 'you know') reduce your Fluency score. Replace them with academic hesitation phrases: 'That's an interesting question...', 'Let me think about that for a moment...', 'I suppose the most important thing is...'",
    skill: "speaking",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS Speaking Guide",
  },
  {
    content:
      "IELTS Speaking Band 6-7 Part 2 (Long Turn): Use the 1-minute preparation time. Write 4-5 quick bullet points on the cue card. Structure: Introduction (what/who/when) → Main story/description → Personal reflection → Conclusion. Aim for 1.5-2 minutes.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "IELTS.org Speaking Part 2 Guide",
  },
  {
    content:
      "IELTS Speaking Band 6-7: Grammatical Range requires mixing tenses naturally. Don't only use present tense. Incorporate: past tense for experiences, present perfect for relevance, future for plans, conditionals for hypotheticals ('If I had more time, I would...').",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 16",
  },
  {
    content:
      "IELTS Speaking Band 7-9: Lexical Resource at this level requires idiomatic language and topic-specific vocabulary. Example for 'environment': instead of 'bad for nature', use 'environmentally detrimental', 'ecologically damaging', or 'poses a significant threat to biodiversity'.",
    skill: "speaking",
    bandRange: "7.0-9.0",
    source: "IELTS.org Band 7+ Speaking Guide",
  },
  {
    content:
      "IELTS Speaking Band 7-9: Part 3 (Discussion) requires abstract thinking. Examiners expect you to: speculate ('I imagine that...', 'It's likely that...'), generalize ('In many societies...'), and analyze cause-effect ('This has led to a situation where...').",
    skill: "speaking",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17",
  },
  {
    content:
      "IELTS Speaking Pronunciation: Stress patterns affect intelligibility. In English, content words (nouns, verbs, adjectives) carry stress; function words (articles, prepositions) are reduced. Practice saying: 'I WENT to the SHOP to BUY some BREAD' with correct stress.",
    skill: "speaking",
    bandRange: "5.0-6.0",
    source: "IELTS.org Pronunciation Guide",
  },
  {
    content:
      "IELTS Speaking Band 6-7: Coherence in speaking means your ideas connect logically. Use discourse markers: 'Building on that point...', 'That said...', 'What I mean by that is...', 'To give you a concrete example...'. These show organized thinking.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 15",
  },

  // ──────────────── GENERAL / STRATEGY ────────────────
  {
    content:
      "IELTS Band Score Guide: Band 5 = modest user, frequent mistakes. Band 6 = competent user, some mistakes. Band 7 = good user, occasional mistakes. Band 8 = very good user, very few mistakes. Band 9 = expert user. Most Vietnamese universities require Band 6.0-6.5 for admission.",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "IELTS.org Band Scale",
  },
  {
    content:
      "IELTS Study Plan for Band 6.5: Week 1-2: Diagnose weaknesses with a full practice test. Week 3-6: Focus intensely on 2 weakest skills. Week 7-8: Mixed practice with full timed tests. Final week: Review mistakes, light practice. Do NOT study all 4 skills equally — target your gaps.",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "British Council IELTS Preparation",
  },
  {
    content:
      "IELTS Vocabulary Building Strategy: Don't memorize word lists. Instead, learn words in context: read IELTS academic passages and note collocations (words that naturally appear together). Example: 'significant increase', not just 'significant' alone.",
    skill: "general",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS Academic Vocabulary",
  },
  {
    content:
      "IELTS Test Anxiety Management: In the exam, if you freeze on a question: (1) Skip it and mark it. (2) Continue with remaining questions. (3) Return at the end with fresh eyes. Anxiety is worst when you stare at one question — momentum helps.",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "British Council Test Strategy",
  },
  {
    content:
      "IELTS Grammar — Countable vs Uncountable: 'Information', 'advice', 'furniture', 'equipment', 'research', 'progress', 'luggage' are UNCOUNTABLE in English. Never say 'an information' or 'researches'. This is a very common Vietnamese learner error that costs marks.",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS Grammar Guide",
  },
  {
    content:
      "IELTS Grammar — Articles (a/an/the): Use 'the' when both speaker and listener know the specific referent (the sun, the government). Use 'a/an' for first mention. Omit articles with plural countable nouns in general statements: 'Dogs are loyal animals' (not 'The dogs...').",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "IELTS Grammar Focus",
  },
  {
    content:
      "IELTS Grammar — Relative Clauses: Defining relative clauses (no commas): 'The student who studied hardest passed.' Non-defining relative clauses (with commas): 'London, which is the capital of England, has a rich history.' Mixing these up is a Band 6 grammar error.",
    skill: "general",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 14",
  },
  {
    content:
      "IELTS Time Management: Computer-delivered IELTS gives you 60 minutes for Reading (no transfer time) and 30 minutes for Listening + 2 minutes transfer (paper). Academic Writing: 20 min Task 1, 40 min Task 2. Never go over Task 1 time — Task 2 is worth double.",
    skill: "general",
    bandRange: "5.0-6.0",
    source: "IELTS.org Official Test Format",
  },
  {
    content:
      "IELTS Vocabulary — High-frequency Academic Words for Vietnamese learners: 'significant' (quan trọng), 'demonstrate' (chứng minh), 'consequently' (do đó), 'whereas' (trong khi đó), 'Nevertheless' (tuy nhiên), 'constitute' (tạo thành), 'facilitate' (tạo điều kiện).",
    skill: "general",
    bandRange: "6.0-7.0",
    source: "Academic Word List (Coxhead)",
  },

  // ──────────────── EXTRA LISTENING ────────────────
  {
    content:
      "IELTS Listening Sections: Section 1 = social conversation (easiest). Section 2 = monologue on social topic. Section 3 = academic discussion between students. Section 4 = academic lecture (hardest). Always preview questions before each section — use the 30-40 seconds given.",
    skill: "listening",
    bandRange: "5.0-6.0",
    source: "IELTS.org Test Format",
  },
  {
    content:
      "IELTS Listening — Short answer questions: Answers are usually 1-3 words taken directly from the recording. Do NOT paraphrase. Spelling must be exact. If unsure, write what you heard phonetically — partial credit is not given but an attempt is better than blank.",
    skill: "listening",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 16",
  },

  // ──────────────── EXTRA WRITING ────────────────
  {
    content:
      "IELTS Writing — Spelling errors: Even one misspelled word in a key term lowers Lexical Resource. Common misspellings by Vietnamese learners: 'government' (not 'goverment'), 'environment' (not 'enviroment'), 'development' (not 'developement').",
    skill: "writing",
    bandRange: "5.0-6.0",
    source: "IELTS Common Errors Guide",
  },
  {
    content:
      "IELTS Writing Task 2 — Opinion essays: Your position must be CLEAR from the introduction and CONSISTENT throughout. Examiners flag 'position drift' — starting by agreeing then suddenly disagreeing in the conclusion. Pick a clear stance and defend it.",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 15",
  },
  {
    content:
      "IELTS Writing — Avoiding hypothesis stacking: At lower bands, students write vague statements like 'Technology can be both good and bad'. High-band writing is specific: 'While digital platforms democratize access to education, they simultaneously exacerbate the digital divide among lower-income populations.'",
    skill: "writing",
    bandRange: "7.0-9.0",
    source: "Cambridge IELTS 17 Commentary",
  },

  // ──────────────── EXTRA SPEAKING ────────────────
  {
    content:
      "IELTS Speaking — Self-correction is acceptable: If you use the wrong word or tense, it is better to correct yourself naturally than to leave the error. Say 'I went... I mean, I go there every week.' Self-correction demonstrates grammar awareness, which is a positive sign to examiners.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "IELTS.org Speaking FAQ",
  },
  {
    content:
      "IELTS Speaking Part 2 — Topic: Describe a person who has influenced you. Key vocabulary: 'role model', 'formative years', 'shaped my perspective', 'instilled values', 'mentor', 'profound impact', 'left an indelible impression'. Practice these collocations.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS Speaking Topics",
  },
  {
    content:
      "IELTS Speaking — Handling unknown topics: If asked about something unfamiliar, don't say 'I don't know' and stop. Say: 'I'm not very familiar with that, but from what I understand...' or 'That's not something I've thought much about, though I imagine...' — keep talking.",
    skill: "speaking",
    bandRange: "5.0-6.0",
    source: "British Council Speaking Guide",
  },
];

// ─── Seeder ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱 Seeding IELTS Knowledge Base (${IELTS_KNOWLEDGE.length} chunks)...\n`);

  // Check if already seeded
  const count = await prisma.ieltsKnowledgeBase.count();
  if (count > 0) {
    console.log(`⚠️  Table already has ${count} rows. Skipping seed.`);
    console.log("   To re-seed, clear the table first: DELETE FROM ielts_knowledge_base;");
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < IELTS_KNOWLEDGE.length; i++) {
    const chunk = IELTS_KNOWLEDGE[i];
    const progress = `[${i + 1}/${IELTS_KNOWLEDGE.length}]`;

    try {
      // 1. Create the record first
      const record = await prisma.ieltsKnowledgeBase.create({
        data: {
          content: chunk.content,
          skill: chunk.skill,
          bandRange: chunk.bandRange,
          source: chunk.source,
          metadata: { index: i },
        },
      });

      // 2. Generate embedding
      const vector = await embed(chunk.content);
      const vectorLiteral = `[${vector.join(",")}]`;

      // 3. Update embedding via raw SQL (pgvector column not in Prisma schema)
      await prisma.$executeRawUnsafe(
        `UPDATE ai_evaluation_db.ielts_knowledge_base 
         SET embedding = '${vectorLiteral}'::public.vector
         WHERE id = '${record.id}'`
      );

      success++;
      console.log(`✅ ${progress} [${chunk.skill}][${chunk.bandRange}] ${chunk.content.slice(0, 60)}...`);

      // Rate limit: 10 req/s for embedding API (free tier)
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      failed++;
      console.error(`❌ ${progress} Failed: ${err}`);
      // Continue with next chunk instead of aborting
    }
  }

  console.log(`\n✨ Seeding complete: ${success} succeeded, ${failed} failed`);
  console.log(`📊 Total chunks in DB: ${await prisma.ieltsKnowledgeBase.count()}`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
