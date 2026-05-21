// =============================================================================
// Generate Placement Test Audio (Gemini TTS multi-speaker → S3)
//
// Usage:
//   npx tsx prisma/generate-placement-audio.ts
//   npx tsx prisma/generate-placement-audio.ts --limit 10
//   npx tsx prisma/generate-placement-audio.ts --force        # regenerate even if audio_url is set
//   npx tsx prisma/generate-placement-audio.ts --dry-run
//
// Requirements:
//   - GEMINI_API_KEY in env
//   - AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in env
//   - Bucket: capstone-project-media-asset
// =============================================================================

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const BUCKET = "capstone-project-media-asset";
const REGION = process.env.AWS_REGION || "ap-southeast-1";
const KEY_PREFIX = "placement-audio";
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";

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

// ─── Speaker assignment ──────────────────────────────────────────────────────
// Gemini multi-speaker TTS requires a fixed `speaker` label on each turn.
// We parse the audio_script for labels like "Man:", "Woman:", "A:", "B:" etc.
// and remap them to two canonical speakers with stable voices.

interface ScriptTurn {
  speaker: string; // "Speaker1" | "Speaker2"
  text: string;
}

interface ParsedScript {
  turns: ScriptTurn[];
  speaker1Label: string;
  speaker2Label: string;
}

// Voices reference: https://ai.google.dev/gemini-api/docs/speech-generation
const VOICE_MALE = process.env.GEMINI_TTS_VOICE_M || "Charon";
const VOICE_FEMALE = process.env.GEMINI_TTS_VOICE_F || "Kore";

function parseScript(script: string): ParsedScript {
  // Split by lines that look like "Label:" at start
  const lineRe = /^\s*([A-Za-z][A-Za-z0-9 _-]{0,20}):\s*(.+)$/;
  const rawTurns: { label: string; text: string }[] = [];

  for (const line of script.split(/\r?\n/)) {
    const m = line.match(lineRe);
    if (m) rawTurns.push({ label: m[1]!.trim(), text: m[2]!.trim() });
    else if (rawTurns.length > 0 && line.trim()) {
      // Continuation of previous turn
      rawTurns[rawTurns.length - 1]!.text += " " + line.trim();
    }
  }

  if (rawTurns.length === 0) {
    // No labels — treat as a single narrator
    return {
      turns: [{ speaker: "Speaker1", text: script.trim() }],
      speaker1Label: "Narrator",
      speaker2Label: "Narrator",
    };
  }

  // Discover distinct labels in order of appearance, map first two to Speaker1/2
  const distinct: string[] = [];
  for (const t of rawTurns) {
    if (!distinct.includes(t.label)) distinct.push(t.label);
    if (distinct.length >= 2) break;
  }
  const label1 = distinct[0]!;
  const label2 = distinct[1] ?? distinct[0]!;

  const turns: ScriptTurn[] = rawTurns.map((t) => ({
    speaker: t.label === label1 ? "Speaker1" : "Speaker2",
    text: t.text,
  }));

  return { turns, speaker1Label: label1, speaker2Label: label2 };
}

function pickVoice(label: string): string {
  const l = label.toLowerCase();
  if (l.startsWith("man") || l === "m" || l === "male" || l.includes("boy")) return VOICE_MALE;
  if (l.startsWith("woman") || l === "w" || l === "f" || l === "female" || l.includes("girl") || l.includes("lady")) return VOICE_FEMALE;
  // Default: A → male, B → female
  if (l === "a") return VOICE_MALE;
  if (l === "b") return VOICE_FEMALE;
  return VOICE_MALE;
}

// ─── Gemini TTS ──────────────────────────────────────────────────────────────

function buildTtsPrompt(parsed: ParsedScript, audioContext: string): string {
  const intro = `TTS the following dialogue naturally. Scene: ${audioContext}. Speak with realistic intonation, mild pauses between turns, no sound effects.\n\n`;
  const body = parsed.turns
    .map((t) => `${t.speaker === "Speaker1" ? parsed.speaker1Label : parsed.speaker2Label}: ${t.text}`)
    .join("\n");
  return intro + body;
}

async function synthesize(ai: GoogleGenAI, parsed: ParsedScript, audioContext: string): Promise<Buffer> {
  const prompt = buildTtsPrompt(parsed, audioContext);

  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: parsed.speaker1Label,
              voiceConfig: { prebuiltVoiceConfig: { voiceName: pickVoice(parsed.speaker1Label) } },
            },
            {
              speaker: parsed.speaker2Label,
              voiceConfig: { prebuiltVoiceConfig: { voiceName: pickVoice(parsed.speaker2Label) } },
            },
          ],
        },
      },
    } as never,
  });

  const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data);
  const data = (part as any)?.inlineData?.data as string | undefined;
  const mime = (part as any)?.inlineData?.mimeType as string | undefined;
  if (!data) throw new Error("Gemini TTS returned no audio data");

  const pcm = Buffer.from(data, "base64");
  // Gemini returns raw PCM (mimeType like "audio/L16;rate=24000"). Wrap to WAV.
  return pcmToWav(pcm, parseSampleRate(mime));
}

function parseSampleRate(mime: string | undefined): number {
  if (!mime) return 24000;
  const m = mime.match(/rate=(\d+)/);
  return m ? parseInt(m[1]!, 10) : 24000;
}

function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
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
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) are not set");
  }

  const ai = new GoogleGenAI({ apiKey });
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
  console.log(" Placement Audio Generator (Gemini TTS → S3)");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(` Model:    ${TTS_MODEL}`);
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
      if (flags.dryRun) {
        console.log(
          `${tag} — would synthesize ${parsed.turns.length} turn(s), speakers: ${parsed.speaker1Label} / ${parsed.speaker2Label}`,
        );
        ok++;
        continue;
      }

      console.log(`${tag} — synthesizing (${parsed.turns.length} turns)...`);
      const wav = await synthesize(ai, parsed, r.audioContext ?? "");
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
