/**
 * Import Dictation JSON into database
 * 
 * Usage:
 *   npx tsx tools/import-dictation.ts tools/sim_0101_dictation.json --audioUrl "https://your-s3-url/sim_0101.mp3"
 * 
 * Or with local placeholder:
 *   npx tsx tools/import-dictation.ts tools/sim_0101_dictation.json
 */

import fs from "fs";
import path from "path";

// ─── Config ──────────────────────────────────────────────────────────────────
const API_BASE = process.env.API_URL || "http://localhost:3003";
const INSTRUCTION_KEYWORDS = [
  "questions", "look at", "you will hear", "listen carefully",
  "now turn to", "that is the end", "before you hear",
  "you have some time", "now listen", "section",
  "part one", "part two", "part three", "part four",
  "example", "answer the questions", "read the questions",
  "first you have", "complete the", "choose the correct",
  "write no more than", "label the",
  "has been written", "now we shall begin", "we shall begin",
  "the answer is", "so the answer", "you can see",
  "in the space", "on the form", "on your answer sheet",
  "end of section", "end of part",
];
const NON_LATIN = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;

// ─── Parse args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const jsonPath = args[0];
const audioUrlFlag = args.indexOf("--audioUrl");
const audioUrl = audioUrlFlag !== -1 ? args[audioUrlFlag + 1] : "";

if (!jsonPath) {
  console.error("Usage: npx tsx tools/import-dictation.ts <json-file> [--audioUrl <url>]");
  process.exit(1);
}

// ─── Read JSON ───────────────────────────────────────────────────────────────
const raw = JSON.parse(fs.readFileSync(path.resolve(jsonPath), "utf-8"));
let sentences: { index: number; text: string; startTime: number; endTime: number }[] = raw.sentences;

console.log(`\n📂 File: ${jsonPath}`);
console.log(`📊 Raw sentences: ${sentences.length}`);

// ─── Clean: Remove hallucinations ────────────────────────────────────────────
const beforeHallucination = sentences.length;
sentences = sentences.filter((s) => {
  const duration = s.endTime - s.startTime;
  const hasNonLatin = NON_LATIN.test(s.text);
  const isTooShort = duration < 0.5 && s.text.split(" ").length > 3;
  if (hasNonLatin || isTooShort) {
    console.log(`  🗑️ Hallucination: [${s.startTime}s] "${s.text.slice(0, 50)}"`);
    return false;
  }
  return true;
});

// ─── Clean: Remove narrator instructions ─────────────────────────────────────
const beforeInstructions = sentences.length;
const removedInstructions: string[] = [];
sentences = sentences.filter((s) => {
  const lower = s.text.toLowerCase();
  const matched = INSTRUCTION_KEYWORDS.some((kw) => lower.includes(kw));
  if (matched) {
    removedInstructions.push(s.text.slice(0, 60));
    return false;
  }
  return true;
});

// ─── Clean: Remove duplicate intro (example section) ─────────────────────────
let dupeRemoved = 0;
if (sentences.length > 10) {
  const firstText = sentences[0]?.text.toLowerCase().trim().slice(0, 40) || "";
  let dupeStart = -1;
  for (let i = 3; i < Math.min(15, sentences.length); i++) {
    if (sentences[i].text.toLowerCase().trim().slice(0, 40) === firstText) {
      dupeStart = i;
      break;
    }
  }
  if (dupeStart > 0) {
    dupeRemoved = dupeStart;
    sentences = sentences.slice(dupeStart);
  }
}

// ─── Re-index ────────────────────────────────────────────────────────────────
sentences.forEach((s, i) => { s.index = i; });

// ─── Report ──────────────────────────────────────────────────────────────────
console.log(`\n📊 Cleaning Results:`);
console.log(`   Hallucinations: ${beforeHallucination - beforeInstructions + (beforeHallucination - sentences.length - removedInstructions.length - dupeRemoved)} removed`);
console.log(`   Instructions:   ${removedInstructions.length} removed`);
console.log(`   Duplicate intro:${dupeRemoved} removed`);
console.log(`   Final:          ${sentences.length} sentences ✅`);

if (removedInstructions.length > 0) {
  console.log(`\n🗑️ Removed instructions:`);
  removedInstructions.forEach((t) => console.log(`   ✂️ "${t}"`));
}

// ─── Build payload ───────────────────────────────────────────────────────────
const payload = {
  title: raw.title || "Untitled Exercise",
  description: raw.description || "",
  audioUrl: audioUrl || `placeholder://${raw.audioFileName || "audio.mp3"}`,
  level: raw.level || "B2",
  category: raw.category || "General",
  sentences,
};

console.log(`\n📝 Exercise: "${payload.title}"`);
console.log(`🎵 Audio: ${payload.audioUrl}`);
console.log(`📊 Sentences: ${payload.sentences.length}`);

// ─── Preview first 5 sentences ───────────────────────────────────────────────
console.log(`\n👀 Preview:`);
sentences.slice(0, 5).forEach((s) => {
  console.log(`   [${s.index}] (${s.startTime}s-${s.endTime}s) ${s.text.slice(0, 60)}`);
});

// ─── POST to API ─────────────────────────────────────────────────────────────
console.log(`\n⏳ Posting to ${API_BASE}/api/dictation ...`);

try {
  const res = await fetch(`${API_BASE}/api/dictation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`❌ API Error (${res.status}): ${error}`);
    process.exit(1);
  }

  const result = await res.json();
  console.log(`\n✅ Exercise created!`);
  console.log(`   ID: ${result.data?.id}`);
  console.log(`   Title: ${result.data?.title}`);
  console.log(`   Sentences: ${result.data?.sentences?.length}`);
} catch (err: any) {
  console.error(`❌ Failed to connect: ${err.message}`);
  console.error(`   Make sure backend is running at ${API_BASE}`);
  process.exit(1);
}
