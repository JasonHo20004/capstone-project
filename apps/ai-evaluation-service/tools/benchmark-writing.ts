// =============================================================================
// Writing Grading Calibration Benchmark
// Runs the LIVE grading pipeline (Gemini Pro only, same as writing.route.ts)
// against essays of known quality tiers, and checks:
//   1) Calibration  — does the AI band land in the band range a human would give?
//   2) Rank order   — does a stronger essay always score higher than a weaker one?
//   3) Consistency  — re-grading the same essay, how much does the band move?
//
// NOTE: these are CONSTRUCTED reference essays with defensible target ranges, not
// officially examiner-marked papers. This validates internal calibration + rank
// ordering. For a true "agreement with human markers" number, feed essays that
// already have official IELTS band scores.
//
// Run: pnpm --filter @capstone/ai-evaluation-service exec tsx tools/benchmark-writing.ts
// =============================================================================

import "dotenv/config";
import { geminiClient } from "../src/llm/gemini.client.js";
import { WRITING_TASK2_PROMPT } from "../src/llm/prompts.js";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const QUESTION =
  "Some people believe that universities should focus on providing academic knowledge, " +
  "while others think they should prepare students for their future careers. " +
  "Discuss both views and give your own opinion.";

interface Sample {
  label: string;
  expMin: number;
  expMax: number;
  text: string;
}

const SAMPLES: Sample[] = [
  {
    label: "HIGH (native-like, developed)",
    expMin: 8.0,
    expMax: 9.0,
    text: `The question of whether universities ought to prioritise academic knowledge or vocational preparation has become increasingly pertinent as graduate employment grows more competitive. While I acknowledge the value of career-oriented training, I would argue that the primary mission of a university is to cultivate rigorous intellectual skills.

Those who advocate a career-focused approach contend that universities should equip students with practical, job-ready competencies. There is undeniable merit in this view: a computer science graduate who has mastered current programming frameworks, for instance, will integrate into the workplace far more smoothly than one versed only in abstract theory. Given the substantial fees students now pay, expecting a tangible return in the form of employability seems entirely reasonable.

Nevertheless, I believe an exclusively vocational emphasis is short-sighted. Specific technical skills date quickly, whereas the capacity to analyse evidence, construct a coherent argument and adapt to unfamiliar problems endures throughout a career. A graduate trained merely to follow established procedures may struggle the moment an industry shifts, while one taught to think critically can continually retrain. Moreover, universities have historically served a broader purpose than employment alone, fostering the informed, questioning citizens on which healthy societies depend.

In conclusion, although preparing students for the workplace is a legitimate concern, it should complement rather than replace the development of transferable intellectual abilities. Universities serve their students best by teaching them how to think, not simply what to do.`,
  },
  {
    label: "UPPER-MID (clear, some slips)",
    expMin: 6.5,
    expMax: 7.0,
    text: `Nowadays, there is a debate about university should teach academic skills or prepare students for their career. In my opinion, both of them are important, but career preparation is more useful for students.

On the one hand, many people think academic skills are the main purpose of university. Students can learn how to research, analyse information and write reports, which are useful abilities. These skills also help them to continue studying in higher level such as master or PhD. For example, a student who has strong academic background can easily do a research project.

On the other hand, I believe preparing students for their future job is more important. When students graduate, most of them want to find a good job immediately. If university only teach theory, they will face difficulties because companies require practical experience. Therefore, universities should provide internships and practical courses so that students can get ready for working environment.

In conclusion, although academic skills have their own value, I think universities should focus more on career preparation because it brings more benefits for students in the real life.`,
  },
  {
    label: "MID (errors, repetitive)",
    expMin: 5.5,
    expMax: 6.0,
    text: `These days many people discuss about university. Some people say university must give academic skills and other people say university must prepare students for career. I will discuss both and give my opinion.

First, academic skills is very important. Student go to university to learn many knowledge from books and teacher. They learn how to write and how to read difficult text. This is good for them because they become more clever.

Second, career is also important. After university student need a job. If they don't have skill for job they cannot work in company. So university should teach them about job too. For example computer or business skill.

In my opinion both are important but I think career is more important because everybody need money to live. So university should help student to find job easily.

In conclusion, university must teach academic skill and also career skill for students future.`,
  },
  {
    label: "LOW (frequent errors, simple)",
    expMin: 4.0,
    expMax: 4.5,
    text: `University is very important for everybody in the world. Some people they think university give academic and some people think give job skill. I want to talk about this topic now.

University is place for study. Student learn english, math and science. This subject is help them in future life. Also they make many friend in university and have happy time.

For job is also need because no money no life. People must working after finish study. Company want people who have experience and can do the work good.

So my opinion is university very good and student must go to university for have bright future and good job for they family.`,
  },
];

function parseResult(raw: string): any {
  let text = (raw || "").trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  return JSON.parse(text);
}

async function grade(text: string): Promise<any> {
  const userMessage =
    `Please evaluate the following IELTS Writing Task 2 response:\n\n` +
    `**Question/Topic:** ${QUESTION}\n\n` +
    `**Essay:**\n${text}`;
  const raw = await geminiClient.chatCompletion(WRITING_TASK2_PROMPT, userMessage, {
    temperature: 0,
    maxTokens: 8192,
    useProModel: true,
  });
  return parseResult(raw);
}

function crit(r: any) {
  const c = r.criteria || {};
  const s = (k: string) => (c[k]?.score ?? "?");
  return `TR ${s("task_achievement")} | CC ${s("coherence")} | LR ${s("lexical")} | GRA ${s("grammar")}`;
}

async function main() {
  console.log(`\n${BOLD}${CYAN}=== Writing Grading Calibration Benchmark (Gemini Pro only) ===${RESET}\n`);
  console.log(`${DIM}Pipeline: geminiClient.chatCompletion(useProModel:true), temp 0 — identical to writing.route.ts${RESET}\n`);

  const bands: number[] = [];
  let inRange = 0;

  // ── 1) Calibration + rank order ─────────────────────────────────────────────
  console.log(`${BOLD}1) CALIBRATION — AI band vs human target range${RESET}`);
  for (const s of SAMPLES) {
    try {
      const r = await grade(s.text);
      const band = Number(r.overall_band);
      bands.push(band);
      const hit = band >= s.expMin && band <= s.expMax;
      if (hit) inRange++;
      const mark = hit ? `${GREEN}OK in range${RESET}` : `${RED}X off${RESET}`;
      const color = hit ? GREEN : RED;
      console.log(
        `  ${color}${BOLD}${band.toFixed(1)}${RESET}  ${s.label.padEnd(32)} ` +
        `${DIM}target ${s.expMin}-${s.expMax}${RESET}  ${mark}`
      );
      console.log(`        ${DIM}${crit(r)}${RESET}`);
    } catch (e: any) {
      bands.push(NaN);
      console.log(`  ${RED}ERROR grading "${s.label}": ${e.message}${RESET}`);
    }
  }

  // Rank order check (HIGH > UPPER-MID > MID > LOW)
  let monotonic = true;
  for (let i = 1; i < bands.length; i++) {
    if (!(bands[i - 1] >= bands[i])) monotonic = false;
  }
  console.log(
    `\n  ${BOLD}Rank order${RESET} (should be descending): ` +
    `${bands.map((b) => (Number.isFinite(b) ? b.toFixed(1) : "ERR")).join(" >= ")}  ` +
    (monotonic ? `${GREEN}OK${RESET}` : `${RED}X rank inversion!${RESET}`)
  );
  console.log(`  ${BOLD}In-range:${RESET} ${inRange}/${SAMPLES.length}`);

  // ── 2) Consistency — re-grade the MID essay 3× ──────────────────────────────
  console.log(`\n${BOLD}2) CONSISTENCY — same essay graded 3x (variance check)${RESET}`);
  const target = SAMPLES[2]; // MID
  const runs: number[] = [];
  for (let i = 0; i < 3; i++) {
    try {
      const r = await grade(target.text);
      runs.push(Number(r.overall_band));
    } catch (e: any) {
      console.log(`  ${RED}run ${i + 1} error: ${e.message}${RESET}`);
    }
  }
  if (runs.length) {
    const spread = Math.max(...runs) - Math.min(...runs);
    const spreadColor = spread <= 0.5 ? GREEN : spread <= 1.0 ? YELLOW : RED;
    console.log(`  "${target.label}" -> ${runs.map((b) => b.toFixed(1)).join(", ")}`);
    console.log(`  ${BOLD}Spread:${RESET} ${spreadColor}${spread.toFixed(1)} band${RESET} ${DIM}(<=0.5 good, <=1.0 acceptable)${RESET}`);
  }

  console.log(`\n${DIM}Reminder: target ranges are constructed references, not official examiner marks.${RESET}\n`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
