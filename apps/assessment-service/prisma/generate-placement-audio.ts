// =============================================================================
// Generate Placement Test Audio (Google Cloud TTS → S3)
//
// Usage:
//   npx tsx prisma/generate-placement-audio.ts
//   npx tsx prisma/generate-placement-audio.ts --limit 10
//   npx tsx prisma/generate-placement-audio.ts --force        # regenerate even if audio_url is set
//   npx tsx prisma/generate-placement-audio.ts --dry-run
//
// Requirements:
//   - GOOGLE_TTS_KEY_FILE=/path/to/KeyFile-tts.json  (or GOOGLE_APPLICATION_CREDENTIALS)
//   - AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in env
//   - Bucket: capstone-project-media-asset
//
// Optional tuning:
//   GOOGLE_TTS_LANG            Language code (default: en-US)
//   GOOGLE_TTS_VOICE_TIER      Voice tier: chirp3-hd | studio | neural2 | wavenet | standard (default: chirp3-hd)
//   GOOGLE_TTS_VOICE_M         Pin a specific male voice name (disables rotation)
//   GOOGLE_TTS_VOICE_F         Pin a specific female voice name (disables rotation)
//   GOOGLE_TTS_SPEAKING_RATE   Speaking rate 0.5–2.0 (default: 0.92 — slightly slower for test clarity)
// =============================================================================

import "dotenv/config";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const BUCKET = "capstone-project-media-asset";
const REGION = process.env.AWS_REGION || "ap-southeast-1";
const KEY_PREFIX = "placement-audio";
const LANG = process.env.GOOGLE_TTS_LANG || "en-US";
const SAMPLE_RATE = 24000;
// 0.92 = slightly slower than native speed — clear for a test, still natural.
const SPEAKING_RATE = parseFloat(process.env.GOOGLE_TTS_SPEAKING_RATE ?? "0.92");
// Gap between speaker turns. 350 ms feels like a real conversational handoff.
const SILENCE_BETWEEN_TURNS_MS = 350;

// ─── CLI ─────────────────────────────────────────────────────────────────────

interface CliFlags {
  limit: number | null;
  force: boolean;
  dryRun: boolean;
}

function parseFlags(): CliFlags {
  const args = process.argv.slice(2);
  let limit: number | null = null;
  let force = false;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--limit") limit = Math.max(1, parseInt(args[++i] ?? "0", 10) || 0) || null;
    else if (a === "--force") force = true;
    else if (a === "--dry-run") dryRun = true;
  }
  return { limit, force, dryRun };
}

// ─── Voice pools ─────────────────────────────────────────────────────────────
// Gender assignments are from the official Google Cloud TTS docs.
// Each tier lists [maleVoices, femaleVoices] in full voice-name format.
// We rotate a DISTINCT pair per question (keyed on question.id) so the
// whole placement test is not read by the same two voices throughout.

type Tier = "chirp3-hd" | "studio" | "neural2" | "wavenet" | "standard";

const VOICE_TIERS: Record<Tier, { male: string[]; female: string[] }> = {
  // Google's newest premium tier (~30 en-US voices). Lots of distinct voices per
  // gender — ideal for multi-speaker dialogues. Voice names are astronomical bodies.
  "chirp3-hd": {
    male: [
      "en-US-Chirp3-HD-Achird", "en-US-Chirp3-HD-Algenib", "en-US-Chirp3-HD-Algieba",
      "en-US-Chirp3-HD-Alnilam", "en-US-Chirp3-HD-Charon", "en-US-Chirp3-HD-Enceladus",
      "en-US-Chirp3-HD-Fenrir", "en-US-Chirp3-HD-Iapetus", "en-US-Chirp3-HD-Orus",
      "en-US-Chirp3-HD-Puck", "en-US-Chirp3-HD-Rasalgethi", "en-US-Chirp3-HD-Sadachbia",
      "en-US-Chirp3-HD-Sadaltager", "en-US-Chirp3-HD-Schedar", "en-US-Chirp3-HD-Umbriel",
      "en-US-Chirp3-HD-Zubenelgenubi",
    ],
    female: [
      "en-US-Chirp3-HD-Achernar", "en-US-Chirp3-HD-Aoede", "en-US-Chirp3-HD-Autonoe",
      "en-US-Chirp3-HD-Callirrhoe", "en-US-Chirp3-HD-Despina", "en-US-Chirp3-HD-Erinome",
      "en-US-Chirp3-HD-Gacrux", "en-US-Chirp3-HD-Kore", "en-US-Chirp3-HD-Laomedeia",
      "en-US-Chirp3-HD-Leda", "en-US-Chirp3-HD-Pulcherrima", "en-US-Chirp3-HD-Sulafat",
      "en-US-Chirp3-HD-Vindemiatrix", "en-US-Chirp3-HD-Zephyr",
    ],
  },
  // Premium narration tier — only ONE male (Q) and ONE female (O) voice exist for
  // en-US Studio, so two same-gender speakers cannot be distinguished on this tier.
  studio: {
    male: ["en-US-Studio-Q"],
    female: ["en-US-Studio-O"],
  },
  neural2: {
    male: ["en-US-Neural2-C", "en-US-Neural2-D", "en-US-Neural2-I"],
    female: ["en-US-Neural2-A", "en-US-Neural2-E", "en-US-Neural2-F", "en-US-Neural2-G", "en-US-Neural2-H", "en-US-Neural2-J"],
  },
  wavenet: {
    male: ["en-US-WaveNet-A", "en-US-WaveNet-B", "en-US-WaveNet-D", "en-US-WaveNet-I", "en-US-WaveNet-J"],
    female: ["en-US-WaveNet-C", "en-US-WaveNet-E", "en-US-WaveNet-F", "en-US-WaveNet-G", "en-US-WaveNet-H"],
  },
  standard: {
    male: ["en-US-Standard-A", "en-US-Standard-B", "en-US-Standard-D", "en-US-Standard-I", "en-US-Standard-J"],
    female: ["en-US-Standard-C", "en-US-Standard-E", "en-US-Standard-F", "en-US-Standard-G", "en-US-Standard-H"],
  },
};

const TIER: Tier = (process.env.GOOGLE_TTS_VOICE_TIER as Tier) || "chirp3-hd";
const PINNED_MALE = process.env.GOOGLE_TTS_VOICE_M || null;
const PINNED_FEMALE = process.env.GOOGLE_TTS_VOICE_F || null;

// FNV-1a — stable, dependency-free hash so a given question.id always maps
// to the same voice pair across runs (re-running --force won't reshuffle voices).
function hashId(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

type Gender = "m" | "f" | "u";

function genderOf(label: string): Gender {
  const l = label.toLowerCase();
  if (l.startsWith("man") || l === "m" || l === "male" || l.includes("boy")) return "m";
  if (l.startsWith("woman") || l === "w" || l === "f" || l === "female" || l.includes("girl") || l.includes("lady"))
    return "f";
  if (l === "a") return "m";
  if (l === "b") return "f";
  return "u";
}

// Resolve each speaker to a CONCRETE gender ("m"/"f"). When a speaker's gender
// is unknown (labels like "Driver", "Customer", "A", "Speaker 1"), we deliberately
// push the two speakers to OPPOSITE genders. A two-person scene read by a male and
// a female voice is always distinguishable and sounds natural — and it sidesteps the
// fact that some tiers (studio) only ship one voice per gender.
function resolveGenders(g1: Gender, g2: Gender, seed: number): [Exclude<Gender, "u">, Exclude<Gender, "u">] {
  const known1 = g1 !== "u";
  const known2 = g2 !== "u";
  if (known1 && known2) return [g1 as "m" | "f", g2 as "m" | "f"];
  if (known1) return [g1 as "m" | "f", g1 === "m" ? "f" : "m"];
  if (known2) return [g2 === "m" ? "f" : "m", g2 as "m" | "f"];
  // Both unknown — split across genders; the seed decides who speaks first.
  return seed & 1 ? ["m", "f"] : ["f", "m"];
}

// Voice pool for a gender, guaranteed to hold at least two DISTINCT voices.
// studio has a single voice per gender, so when two same-gender speakers share a
// scene we borrow extra voices from the neural2 tier to keep them distinguishable.
function poolForGender(gender: "m" | "f"): string[] {
  const tier = VOICE_TIERS[TIER];
  const base = gender === "m" ? tier.male : tier.female;
  if (base.length >= 2) return base;
  const fallback = gender === "m" ? VOICE_TIERS.neural2.male : VOICE_TIERS.neural2.female;
  return [...new Set([...base, ...fallback])];
}

function assignVoices(parsed: ParsedScript, questionId: string): { voice1: string; voice2: string } {
  if (PINNED_MALE && PINNED_FEMALE) return { voice1: PINNED_MALE, voice2: PINNED_FEMALE };

  const seed = hashId(questionId);
  const [eg1, eg2] = resolveGenders(genderOf(parsed.speaker1Label), genderOf(parsed.speaker2Label), seed);

  // Different genders → distinct by construction; pick one voice from each gender pool.
  if (eg1 !== eg2) {
    const pool1 = poolForGender(eg1);
    const pool2 = poolForGender(eg2);
    return {
      voice1: pool1[seed % pool1.length]!,
      voice2: pool2[(seed >>> 8) % pool2.length]!,
    };
  }

  // Same gender → pick two distinct voices from one (augmented) pool.
  const pool = poolForGender(eg1);
  const i1 = seed % pool.length;
  // Offset in [1, len-1] guarantees i2 !== i1 for any pool of length >= 2.
  const i2 = (i1 + 1 + ((seed >>> 8) % (pool.length - 1))) % pool.length;
  return { voice1: pool[i1]!, voice2: pool[i2]! };
}

// ─── Script parsing ──────────────────────────────────────────────────────────

interface ScriptTurn {
  speaker: "Speaker1" | "Speaker2";
  text: string;
}

interface ParsedScript {
  turns: ScriptTurn[];
  speaker1Label: string;
  speaker2Label: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Speaker labels may appear at the start of a line OR inline within a single
// paragraph (e.g. "Customer: ... please. Seller: That is ...").
//
// Pass 1 discovers the label set: a capitalized token (1–3 words) ending in a
// colon that sits at a SENTENCE BOUNDARY — start of script, after . ! ?, or after
// a newline. Anchoring on a sentence boundary is what stops mid-sentence colons
// ("New York: ...") from being mistaken for speakers. Honorifics like "Mr. Smith"
// use a period, never a colon, so they are never matched.
//
// Pass 2 then splits on every occurrence of a KNOWN label + colon — even mid-line
// where a turn didn't end with punctuation — and the label text is dropped from
// what gets spoken.
function parseScript(script: string): ParsedScript {
  const text = script.replace(/\r\n/g, "\n").trim();

  const discoverRe =
    /(?:^|(?<=[.!?])|(?<=\n))\s*([A-Z][A-Za-z'’-]*(?:\s+[A-Z][A-Za-z'’-]*){0,2})\s*:\s+/g;
  const labels: string[] = [];
  for (const m of text.matchAll(discoverRe)) {
    const label = m[1]!.trim();
    if (!labels.includes(label)) labels.push(label);
  }

  if (labels.length === 0) {
    return {
      turns: [{ speaker: "Speaker1", text }],
      speaker1Label: "Narrator",
      speaker2Label: "Narrator",
    };
  }

  const label1 = labels[0]!;
  const label2 = labels[1] ?? labels[0]!;

  // Match known labels longest-first so "Shop Assistant" wins over "Shop".
  const alt = [...labels].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|");
  const splitRe = new RegExp(`(?:^|\\s)(${alt})\\s*:\\s+`, "g");

  const boundaries: { label: string; matchStart: number; contentStart: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = splitRe.exec(text)) !== null) {
    boundaries.push({ label: m[1]!.trim(), matchStart: m.index, contentStart: m.index + m[0].length });
  }

  const turns: ScriptTurn[] = [];
  for (let i = 0; i < boundaries.length; i++) {
    const b = boundaries[i]!;
    const end = i + 1 < boundaries.length ? boundaries[i + 1]!.matchStart : text.length;
    const turnText = text.slice(b.contentStart, end).trim();
    if (turnText) turns.push({ speaker: b.label === label1 ? "Speaker1" : "Speaker2", text: turnText });
  }

  return { turns, speaker1Label: label1, speaker2Label: label2 };
}

// ─── Google Cloud TTS ─────────────────────────────────────────────────────────
// Each turn is synthesised separately (Google Cloud TTS has no native multi-speaker
// config). The resulting LINEAR16 buffers (WAV = 44-byte header + PCM) are stripped
// to raw PCM, interleaved with a brief silence, then reassembled into a single WAV.

function makeSilencePcm(ms: number): Buffer {
  const samples = Math.ceil((SAMPLE_RATE * ms) / 1000);
  return Buffer.alloc(samples * 2, 0); // 16-bit mono = 2 bytes/sample
}

function stripWavHeader(wav: Buffer): Buffer {
  // LINEAR16 from Google Cloud TTS always includes a standard 44-byte WAV header.
  return wav.subarray(44);
}

function pcmToWav(pcm: Buffer): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

async function synthesize(
  client: TextToSpeechClient,
  parsed: ParsedScript,
  voices: { voice1: string; voice2: string },
): Promise<Buffer> {
  const silence = makeSilencePcm(SILENCE_BETWEEN_TURNS_MS);
  const pcmChunks: Buffer[] = [];

  for (let i = 0; i < parsed.turns.length; i++) {
    const turn = parsed.turns[i]!;
    const voiceName = turn.speaker === "Speaker1" ? voices.voice1 : voices.voice2;

    const [response] = await client.synthesizeSpeech({
      input: { text: turn.text },
      voice: { languageCode: LANG, name: voiceName },
      audioConfig: {
        audioEncoding: "LINEAR16" as never,
        sampleRateHertz: SAMPLE_RATE,
        speakingRate: SPEAKING_RATE,
      },
    });

    const raw = response.audioContent;
    if (!raw) throw new Error(`Turn ${i + 1}: Google Cloud TTS returned no audio`);
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as Uint8Array);
    pcmChunks.push(stripWavHeader(buf));

    if (i < parsed.turns.length - 1) pcmChunks.push(silence);
  }

  return pcmToWav(Buffer.concat(pcmChunks));
}

// ─── S3 ──────────────────────────────────────────────────────────────────────

function makeS3Client(): S3Client {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

async function uploadToS3(s3: S3Client, key: string, body: Buffer, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const flags = parseFlags();

  const keyFile = process.env.GOOGLE_TTS_KEY_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyFile) {
    throw new Error(
      "Google Cloud TTS auth not configured.\n" +
        "  Set GOOGLE_TTS_KEY_FILE=/path/to/KeyFile-tts.json\n" +
        "  or GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json",
    );
  }
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) are not set");
  }

  const ttsClient = new TextToSpeechClient({ keyFilename: keyFile });
  const s3 = makeS3Client();

  const where = {
    type: "listening_mcq",
    audioScript: { not: null },
    ...(flags.force ? {} : { audioUrl: null }),
  } as const;

  const rows = await prisma.placementQuestion.findMany({
    where,
    select: { id: true, audioContext: true, audioScript: true, audioUrl: true },
    take: flags.limit ?? undefined,
    orderBy: { createdAt: "asc" },
  });

  console.log("══════════════════════════════════════════════════════════════");
  console.log(" Placement Audio Generator (Google Cloud TTS → S3)");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(` Tier:     ${TIER}${PINNED_MALE ? " (pinned)" : ""}`);
  console.log(` Lang:     ${LANG}`);
  console.log(` Bucket:   ${BUCKET}`);
  console.log(` Region:   ${REGION}`);
  console.log(` Targets:  ${rows.length} listening_mcq row(s)`);
  console.log(` Mode:     ${flags.dryRun ? "DRY-RUN" : "WRITE"}${flags.force ? " (force)" : ""}`);

  let ok = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]!;
    const tag = `[${i + 1}/${rows.length}] ${r.id}`;
    if (!r.audioScript) {
      console.log(`${tag} — no audioScript, skip`);
      skipped++;
      continue;
    }

    try {
      const parsed = parseScript(r.audioScript);
      const voices = assignVoices(parsed, r.id);
      const voiceLabel =
        parsed.speaker1Label === parsed.speaker2Label ? voices.voice1 : `${voices.voice1} + ${voices.voice2}`;

      if (flags.dryRun) {
        console.log(
          `${tag} — would synthesize ${parsed.turns.length} turn(s), speakers: ${parsed.speaker1Label} / ${parsed.speaker2Label} → ${voiceLabel}`,
        );
        ok++;
        continue;
      }

      console.log(`${tag} — synthesizing (${parsed.turns.length} turns) → ${voiceLabel}...`);
      const wav = await synthesize(ttsClient, parsed, voices);
      const key = `${KEY_PREFIX}/${r.id}.wav`;
      const url = await uploadToS3(s3, key, wav, "audio/wav");
      await prisma.placementQuestion.update({ where: { id: r.id }, data: { audioUrl: url } });
      console.log(`${tag} — ✓ ${url}`);
      ok++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${tag} — ✗ ${msg.slice(0, 300)}`);
    }
  }

  console.log("\n──────────────────────────────────────────────────────────────");
  console.log(` Done. ok=${ok}, failed=${failed}, skipped=${skipped}`);
  if (flags.dryRun) console.log(" (dry-run — nothing uploaded or written)");
}

main()
  .catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
