import "dotenv/config";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// ─── Load Environment Variables ──────────────────────────────────────────────
const assessmentEnvPath = path.resolve("apps/assessment-service/.env");
if (fs.existsSync(assessmentEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(assessmentEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const aiEvalEnvPath = path.resolve("apps/ai-evaluation-service/.env");
if (fs.existsSync(aiEvalEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(aiEvalEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const paymentEnvPath = path.resolve("apps/payment-service/.env");
if (fs.existsSync(paymentEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(paymentEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

// ─── Import Prisma Clients & Helpers ─────────────────────────────────────────
import { PrismaClient as AssessmentPrisma } from "../apps/assessment-service/generated/prisma/index.js";
import { PrismaClient as AiEvalPrisma } from "../apps/ai-evaluation-service/generated/prisma/index.js";
import { PrismaClient as PaymentPrisma } from "../apps/payment-service/generated/prisma/index.js";
import { id, testId, sectionId, questionId } from "../seed-shared/index.js";

const assessmentDirectUrl = process.env.ASSESSMENT_DIRECT_URL ?? process.env.ASSESSMENT_DATABASE_URL;
const aiEvalDirectUrl = process.env.AI_EVALUATION_DIRECT_URL ?? process.env.AI_EVALUATION_DATABASE_URL;
const paymentDirectUrl = process.env.PAYMENT_DIRECT_URL ?? process.env.PAYMENT_DATABASE_URL;

if (!assessmentDirectUrl || !aiEvalDirectUrl || !paymentDirectUrl) {
  console.error("❌ Error: Connection strings not found in env files!");
  process.exit(1);
}

const assessmentPrisma = new AssessmentPrisma({
  datasources: { db: { url: assessmentDirectUrl } }
});

const aiEvalPrisma = new AiEvalPrisma({
  datasources: { db: { url: aiEvalDirectUrl } }
});

const paymentPrisma = new PaymentPrisma({
  datasources: { db: { url: paymentDirectUrl } }
});

// ─── Command Line Parsing ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const userIdArgFlag = args.indexOf("--userId");
let targetUserId = userIdArgFlag !== -1 ? args[userIdArgFlag + 1] : "";

if (!targetUserId) {
  console.error("❌ Error: Missing --userId argument!");
  console.log("Usage: npx tsx tools/seed-user-history.ts --userId <UUID>");
  process.exit(1);
}

// Validate UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(targetUserId)) {
  console.error(`❌ Error: "${targetUserId}" is not a valid UUID!`);
  process.exit(1);
}

console.log(`\n🌱 Starting enhanced custom seed for user ID: ${targetUserId}`);

// ─── Mock Data Configurations ───────────────────────────────────────────────

const READING_TEST_ID = testId("ielts-reading-1");
const READING_SECTION_ID = sectionId("ielts-r1-sec");
const LISTENING_TEST_ID = testId("ielts-listening-1");
const LISTENING_SECTION_ID = sectionId("ielts-l1-sec");
const SPEAKING_TOPIC_ID = id("speakingTopic", "topic-tech");

// 1. Reading Attempts (Progression: 6.0 -> 6.5 -> 7.5)
const READING_ATTEMPTS = [
  {
    attemptNum: 1,
    daysAgo: 10,
    durationMins: 50,
    band: 6.0,
    rawScore: 28,
    answers: [
      { key: "ielts-r1-q1", userOptIdx: 0, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q2", userOptIdx: 0, userAnsText: null, isCorrect: false }, // Incorrect (correct is 1)
      { key: "ielts-r1-q3", userOptIdx: 0, userAnsText: null, isCorrect: false }, // Incorrect (correct is 2)
      { key: "ielts-r1-q4", userOptIdx: null, userAnsText: "Yemen", isCorrect: true }, // Correct
      { key: "ielts-r1-q5", userOptIdx: null, userAnsText: "Mocha", isCorrect: true }, // Correct
      { key: "ielts-r1-q6", userOptIdx: null, userAnsText: "fifteenth", isCorrect: false } // Incorrect (correct is eighteenth)
    ]
  },
  {
    attemptNum: 2,
    daysAgo: 6,
    durationMins: 48,
    band: 6.5,
    rawScore: 30,
    answers: [
      { key: "ielts-r1-q1", userOptIdx: 0, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q2", userOptIdx: 1, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q3", userOptIdx: 0, userAnsText: null, isCorrect: false }, // Incorrect (correct is 2)
      { key: "ielts-r1-q4", userOptIdx: null, userAnsText: "Yemen", isCorrect: true }, // Correct
      { key: "ielts-r1-q5", userOptIdx: null, userAnsText: "Mocha", isCorrect: true }, // Correct
      { key: "ielts-r1-q6", userOptIdx: null, userAnsText: "fifteenth", isCorrect: false } // Incorrect
    ]
  },
  {
    attemptNum: 3,
    daysAgo: 2,
    durationMins: 45,
    band: 7.5,
    rawScore: 33,
    answers: [
      { key: "ielts-r1-q1", userOptIdx: 0, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q2", userOptIdx: 1, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q3", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-r1-q4", userOptIdx: null, userAnsText: "Yemen", isCorrect: true }, // Correct
      { key: "ielts-r1-q5", userOptIdx: null, userAnsText: "Mocha", isCorrect: true }, // Correct
      { key: "ielts-r1-q6", userOptIdx: null, userAnsText: "seventeenth", isCorrect: false } // Incorrect (correct is eighteenth)
    ]
  }
];

const READING_QUESTION_INFOS: Record<string, { type: string; text: string; opt: string[]; ansIdx: number | null; ansText: string }> = {
  "ielts-r1-q1": { type: "TRUE_FALSE_NOT_GIVEN", text: "The wild coffee plant grew in Ethiopia before people began to roast its beans.", opt: ["TRUE", "FALSE", "NOT GIVEN"], ansIdx: 0, ansText: "TRUE" },
  "ielts-r1-q2": { type: "TRUE_FALSE_NOT_GIVEN", text: "The legend of Kaldi the goatherd is supported by strong historical evidence.", opt: ["TRUE", "FALSE", "NOT GIVEN"], ansIdx: 1, ansText: "FALSE" },
  "ielts-r1-q3": { type: "TRUE_FALSE_NOT_GIVEN", text: "Kaldi sold his goats after discovering the coffee cherries.", opt: ["TRUE", "FALSE", "NOT GIVEN"], ansIdx: 2, ansText: "NOT GIVEN" },
  "ielts-r1-q4": { type: "GAP_FILL", text: "By the fifteenth century, coffee cultivation had moved across the Red Sea to ________.", opt: [], ansIdx: null, ansText: "Yemen" },
  "ielts-r1-q5": { type: "GAP_FILL", text: "The port city of ________ gave its name to a particular style of the drink.", opt: [], ansIdx: null, ansText: "Mocha" },
  "ielts-r1-q6": { type: "GAP_FILL", text: "Coffee became a global commodity by the ________ century, grown across Asia, the Caribbean and South America.", opt: [], ansIdx: null, ansText: "eighteenth" }
};

// 2. Listening Attempts (Progression: 6.0 -> 6.5 -> 7.0)
const LISTENING_ATTEMPTS = [
  {
    attemptNum: 1,
    daysAgo: 9,
    durationMins: 38,
    band: 6.0,
    rawScore: 29,
    answers: [
      { key: "ielts-l1-q1", userOptIdx: null, userAnsText: "eight", isCorrect: true }, // Correct
      { key: "ielts-l1-q2", userOptIdx: null, userAnsText: "cheap", isCorrect: false }, // Incorrect (correct is free)
      { key: "ielts-l1-q3", userOptIdx: 0, userAnsText: null, isCorrect: false }, // Incorrect (correct is 2)
      { key: "ielts-l1-q4", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-l1-q5", userOptIdx: null, userAnsText: "one", isCorrect: false }, // Incorrect (correct is two)
      { key: "ielts-l1-q6", userOptIdx: 1, userAnsText: null, isCorrect: true } // Correct
    ]
  },
  {
    attemptNum: 2,
    daysAgo: 5,
    durationMins: 36,
    band: 6.5,
    rawScore: 31,
    answers: [
      { key: "ielts-l1-q1", userOptIdx: null, userAnsText: "eight", isCorrect: true }, // Correct
      { key: "ielts-l1-q2", userOptIdx: null, userAnsText: "free", isCorrect: true }, // Correct
      { key: "ielts-l1-q3", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-l1-q4", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-l1-q5", userOptIdx: null, userAnsText: "three", isCorrect: false }, // Incorrect (correct is two)
      { key: "ielts-l1-q6", userOptIdx: 0, userAnsText: null, isCorrect: false } // Incorrect (correct is 1)
    ]
  },
  {
    attemptNum: 3,
    daysAgo: 1,
    durationMins: 35,
    band: 7.0,
    rawScore: 34,
    answers: [
      { key: "ielts-l1-q1", userOptIdx: null, userAnsText: "eight", isCorrect: true }, // Correct
      { key: "ielts-l1-q2", userOptIdx: null, userAnsText: "free", isCorrect: true }, // Correct
      { key: "ielts-l1-q3", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-l1-q4", userOptIdx: 2, userAnsText: null, isCorrect: true }, // Correct
      { key: "ielts-l1-q5", userOptIdx: null, userAnsText: "three", isCorrect: false }, // Incorrect (correct is two)
      { key: "ielts-l1-q6", userOptIdx: 1, userAnsText: null, isCorrect: true } // Correct
    ]
  }
];

const LISTENING_QUESTION_INFOS: Record<string, { type: string; text: string; opt: string[]; ansIdx: number | null; ansText: string }> = {
  "ielts-l1-q1": { type: "FILL_IN_THE_BLANK", text: "On weekdays the library closes at ________ in the evening.", opt: [], ansIdx: null, ansText: "eight" },
  "ielts-l1-q2": { type: "FILL_IN_THE_BLANK", text: "A membership card is ________ for all residents.", opt: [], ansIdx: null, ansText: "free" },
  "ielts-l1-q3": { type: "MULTIPLE_CHOICE", text: "How many items can a member borrow at a time?", opt: ["Up to eight", "Up to ten", "Up to twelve", "Up to twenty"], ansIdx: 2, ansText: "Up to twelve" },
  "ielts-l1-q4": { type: "MULTIPLE_CHOICE", text: "What is the standard loan period?", opt: ["One week", "Two weeks", "Three weeks", "Four weeks"], ansIdx: 2, ansText: "Three weeks" },
  "ielts-l1-q5": { type: "FILL_IN_THE_BLANK", text: "Most items can be renewed online ________ times.", opt: [], ansIdx: null, ansText: "two" },
  "ielts-l1-q6": { type: "MULTIPLE_CHOICE", text: "Where must the study rooms be booked?", opt: ["Online only", "At the front desk", "By phone", "On the second floor noticeboard"], ansIdx: 1, ansText: "At the front desk" }
};

// 3. Writing Attempts (Progression: 6.0 -> 6.5 -> 7.5)
const WRITING_ATTEMPTS = [
  {
    attemptNum: 1,
    daysAgo: 8,
    essayText: "Nowadays many people choose to live in big cities instead of the countryside. There are several reasons for this trend. Firstly, cities offer more job opportunities and higher salaries, which attract young workers. Secondly, urban areas have better hospitals, schools and entertainment. However, living in a city also has disadvantages such as pollution, traffic and high cost of living. In my opinion, although cities are convenient, the countryside provides a calmer and healthier lifestyle. People should think carefully about their priorities before deciding where to live, because both options have clear advantages and disadvantages.",
    overallBand: 6.0,
    criteria: {
      task_achievement: { score: 6.0, feedback: "The main ideas are relevant, but the arguments lack depth and supporting examples." },
      coherence: { score: 6.0, feedback: "Logical structure, but transitions between sentences are mechanical and repetitive." },
      lexical: { score: 6.0, feedback: "Basic vocabulary is mostly accurate. Repetitive phrasing ('advantages and disadvantages')." },
      grammar: { score: 5.5, feedback: "Mainly simple sentences. Errors in article usage and singular/plural nouns occur." }
    },
    highlightedErrors: [
      { original: "both options have clear advantages and disadvantages", suggestion: "avoid repeating the prompt's exact words", type: "lexical" }
    ],
    overallFeedback: "A clear response. To improve, focus on expanding each paragraph with concrete examples and avoid repeating vocabulary."
  },
  {
    attemptNum: 2,
    daysAgo: 4,
    essayText: "In recent years, online shopping has become extremely popular around the world. Many customers prefer buying products on the internet because it saves time and offers a wide variety of choices. In addition, prices online are often cheaper than in traditional stores. On the other hand, online shopping has some problems. Customers cannot try products before buying, and sometimes the items they receive are different from the pictures. Moreover, online fraud is increasing. To conclude, online shopping is convenient but buyers should be careful and only use trusted websites to avoid losing their money.",
    overallBand: 6.5,
    criteria: {
      task_achievement: { score: 6.5, feedback: "Both sides of the argument are presented. The conclusion clearly wraps up the points." },
      coherence: { score: 6.5, feedback: "Good paragraph structure with simple cohesive devices (e.g. 'In addition', 'On the other hand')." },
      lexical: { score: 6.5, feedback: "Sufficient vocabulary to discuss the topic. Good use of collocations like 'online fraud'." },
      grammar: { score: 6.0, feedback: "A mix of simple and compound sentences. Minor errors in preposition placement." }
    },
    highlightedErrors: [
      { original: "prices online are often cheaper", suggestion: "online prices are often cheaper", type: "grammar" }
    ],
    overallFeedback: "A solid band 6.5 answer. Work on using a wider range of linking phrases and introducing complex grammatical structures."
  },
  {
    attemptNum: 3,
    daysAgo: 2,
    essayText: `In the contemporary era, the rapid proliferation of technology has fundamentally reshaped human existence, sparking a debate on whether these advancements have complicated our lives or made them more convenient. While some argue that constant connectivity and digital demands generate unprecedented stress, I believe that technology, when managed mindfully, significantly simplifies daily routines and enhances general comfort.

On the one hand, critics of technological integration emphasize the psychological and social burdens it imposes. The primary concern is the blurring of boundaries between professional and personal life. With smartphones and remote work platforms, employees are often expected to be accessible around the clock, leading to chronic burnout. Furthermore, the constant influx of information through social media feeds creates a phenomenon known as 'information overload,' which can trigger anxiety and reduce attention spans. For instance, many individuals find themselves compulsively checking notifications, a habit that undermines their ability to engage in deep, focused thinking. Thus, for those who struggle to regulate their digital consumption, technology can indeed become a major source of cognitive complexity and stress.

On the one hand, the benefits of technology in streamlining daily operations are undeniable. From a practical standpoint, automation and smart applications have eliminated numerous tedious tasks. Online banking, e-commerce, and digital navigation systems save valuable time and physical effort. Moreover, in the realm of education and healthcare, technology have not only made life simpler by removing physical barriers but also more comfortable by providing instant solutions to complex needs.

In conclusion, although the misapplication of digital tools can induce anxiety and create professional pressure, the positive impacts of technology far outweigh its drawbacks. By automating routine tasks and expanding access to vital services, technology serves as an invaluable tool for human comfort. Ultimately, the key to a simpler life lies in our capacity to establish healthy boundaries with our devices.`,
    overallBand: 7.5,
    criteria: {
      task_achievement: { score: 7.5, feedback: "Fully addresses both viewpoints and details a clear, personal stance in the introduction and conclusion." },
      coherence: { score: 8.0, feedback: "Smooth progression. Paragraphs are logical and use sophisticated linking devices." },
      lexical: { score: 7.5, feedback: "Strong range of academic vocabulary ('proliferation', 'democratized', 'burnout') used with precision." },
      grammar: { score: 7.0, feedback: "A variety of complex sentences used with good control. Minor slip in subject-verb agreement." }
    },
    highlightedErrors: [
      { original: "technology have not only made", suggestion: "technology has not only made", type: "grammar" }
    ],
    overallFeedback: "Excellent structural organization and rich vocabulary. To score 8.0+, eliminate minor grammatical slips and ensure agreement in singular nouns."
  }
];

const SPEAKING_TURNS = [
  { role: "examiner", content: "How has technology changed communication?", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { role: "candidate", content: "Personally, I believe that technology has revolutionized the way we communicate. In the past, people had to write letters and wait for weeks to receive a response. Nowadays, we can connect with anyone around the world in a split second.", timestamp: new Date(Date.now() - 3590000).toISOString() },
  { role: "examiner", content: "Do you find any specific piece of technology useful in your daily life?", timestamp: new Date(Date.now() - 3550000).toISOString() },
  { role: "candidate", content: "Yes, definitely. For example, my noise-canceling headphones are really useful in my daily life because they help me block out background noise and focus on studying.", timestamp: new Date(Date.now() - 3540000).toISOString() },
  { role: "examiner", content: "Do you think technology makes people less social?", timestamp: new Date(Date.now() - 3500000).toISOString() },
  { role: "candidate", content: "It's a double-edged sword. On one hand, it connects us with people who are far away, but on the other hand, it can isolate us from the people sitting right next to us. I often see people in restaurants looking at screens rather than talking.", timestamp: new Date(Date.now() - 3490000).toISOString() }
];

const SPEAKING_TRANSCRIPT = `Personally, I believe that technology has revolutionized the way we communicate. In the past, people had to write letters and wait for weeks to receive a response. Nowadays, we can connect with anyone around the world in a split second. However, this has also led to some drawbacks, such as a decrease in face-to-face interactions. Also, noise-canceling headphones are really useful in my daily life because they help me block out background noise and focus on studying.`;

// 4. Speaking Attempts (Progression: 6.0 -> 6.5 -> 7.0)
const SPEAKING_ATTEMPTS = [
  {
    attemptNum: 1,
    daysAgo: 7,
    topicTitle: "Hometown & Living Place",
    topicKey: "topic-hometown",
    transcript: "So, about my hometown, it is a small town near the mountains. I like it because it is quiet and the air is fresh. We have a nice market and friendly people. I think it has changed a little, there are more shops now.",
    overallBand: 6.0,
    criteria: {
      fluency: { score: 6.0, comment: "Spoke with steady speed but frequent hesitations when searching for basic words." },
      lexical: { score: 6.0, comment: "Vocabulary is adequate for basic topics but lacks range and precise description." },
      grammar: { score: 5.5, comment: "Mostly simple structures. Several errors with prepositions and noun plurals." },
      pronunciation: { score: 6.0, comment: "Words are generally clear, but flat intonation makes it hard to sound natural." },
      summary: "A basic band 6.0 speaking effort. To improve, try extending your answers and using linking words like 'however' or 'because'."
    },
    turns: [
      { role: "examiner", content: "Where is your hometown?", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3600000).toISOString() },
      { role: "candidate", content: "My hometown is a small town near the mountains.", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3590000).toISOString() },
      { role: "examiner", content: "What do you like most about living there?", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3580000).toISOString() },
      { role: "candidate", content: "I like it because it is quiet and the air is fresh. We have a nice market and friendly people.", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3570000).toISOString() }
    ],
    audioUrl: "https://cdn.demo.capstone.local/speaking/custom-speaking-1.webm",
    duration: 55.2
  },
  {
    attemptNum: 2,
    daysAgo: 3,
    topicTitle: "Work & Study",
    topicKey: "topic-work",
    transcript: "Currently, I am studying English at university. I really enjoy my course because it allows me to discover new cultures. In the future, I hope to work in a multinational company where I can practice English every day. I prefer working in a team because we can support each other.",
    overallBand: 6.5,
    criteria: {
      fluency: { score: 6.5, comment: "Speech is mostly coherent and flows reasonably well. Minor hesitations." },
      lexical: { score: 7.0, comment: "Good range of work-related vocabulary (e.g. 'multinational', 'support each other')." },
      grammar: { score: 6.0, comment: "Mix of simple and complex sentences, though minor slips with verb tenses occur." },
      pronunciation: { score: 6.5, comment: "Pronunciation is clear. Some struggles with word stress on longer terms." },
      summary: "A good band 6.5 attempt. Focus on grammatical range and using conditionals ('If I had...', 'I would...') to improve."
    },
    turns: [
      { role: "examiner", content: "Do you work or are you a student?", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 3600000).toISOString() },
      { role: "candidate", content: "Currently, I am studying English at university. I really enjoy my course because it allows me to discover new cultures.", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 3590000).toISOString() },
      { role: "examiner", content: "Do you prefer working alone or in a team?", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 3580000).toISOString() },
      { role: "candidate", content: "I prefer working in a team because we can support each other and share ideas.", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 3570000).toISOString() }
    ],
    audioUrl: "https://cdn.demo.capstone.local/speaking/custom-speaking-2.webm",
    duration: 68.4
  },
  {
    attemptNum: 3,
    daysAgo: 1,
    topicTitle: "Technology & Social Media",
    topicKey: "topic-tech",
    transcript: "Personally, I believe that technology has revolutionized the way we communicate. In the past, people had to write letters and wait for weeks to receive a response. Nowadays, we can connect with anyone around the world in a split second. However, this has also led to some drawbacks, such as a decrease in face-to-face interactions. Also, noise-canceling headphones are really useful in my daily life because they help me block out background noise and focus on studying.",
    overallBand: 7.0,
    criteria: {
      fluency: { score: 7.5, comment: "Spoke with good flow and very little hesitation. Cohesive devices were used naturally (e.g., 'double-edged sword', 'on one hand')." },
      lexical: { score: 7.0, comment: "Good range of vocabulary related to technology and feelings (e.g., 'revolutionized', 'democratized', 'comparison trap')." },
      grammar: { score: 6.5, comment: "Grammar was generally accurate, but there were minor errors with prepositions and complex sentence structures." },
      pronunciation: { score: 7.0, comment: "Pronunciation was clear and easy to follow. Intonation was natural, though there were slight struggles with word endings (like -s and -ed)." },
      summary: "A very solid band 7.0 speaking performance. Great job on maintaining flow and coherence! Work on grammatical range to score higher."
    },
    turns: SPEAKING_TURNS,
    audioUrl: "https://cdn.demo.capstone.local/speaking/custom-speaking-3.webm",
    duration: 125.4
  }
];

// ─── Execution ───────────────────────────────────────────────────────────────

async function main() {
  // 1. Verify tests exist
  const readingTest = await assessmentPrisma.test.findUnique({ where: { id: READING_TEST_ID } });
  const listeningTest = await assessmentPrisma.test.findUnique({ where: { id: LISTENING_TEST_ID } });

  if (!readingTest || !listeningTest) {
    console.error("❌ Error: Core IELTS tests are not seeded in assessment_db!");
    console.log("Please run the main seed script first: pnpm seed:demo:assessment");
    process.exit(1);
  }

  // --- Clean existing custom seed records for this specific user ---
  console.log("🧹 Cleaning old custom seed entries for this user...");
  
  const allReadingSessionIds = READING_ATTEMPTS.map(a => id("practiceSession", `custom-reading-${a.attemptNum}-${targetUserId}`));
  const allListeningSessionIds = LISTENING_ATTEMPTS.map(a => id("practiceSession", `custom-listening-${a.attemptNum}-${targetUserId}`));
  const allSessionIds = [...allReadingSessionIds, ...allListeningSessionIds];
  
  await assessmentPrisma.userAnswer.deleteMany({
    where: { practiceSessionId: { in: allSessionIds } }
  });
  
  await assessmentPrisma.practiceSession.deleteMany({
    where: { id: { in: allSessionIds } }
  });

  const allWritingIds = WRITING_ATTEMPTS.map(a => id("writing", `custom-writing-${a.attemptNum}-${targetUserId}`));
  await aiEvalPrisma.writingEvaluation.deleteMany({
    where: { id: { in: allWritingIds } }
  });

  const allSpeakingIds = SPEAKING_ATTEMPTS.map(a => id("speaking", `custom-speaking-${a.attemptNum}-${targetUserId}`));
  const allSpeakingSessionIds = SPEAKING_ATTEMPTS.map(a => id("spksession", `custom-speaking-session-${a.attemptNum}-${targetUserId}`));

  await aiEvalPrisma.speakingEvaluation.deleteMany({
    where: { id: { in: allSpeakingIds } }
  });

  await aiEvalPrisma.speakingSession.deleteMany({
    where: { id: { in: allSpeakingSessionIds } }
  });

  // Clean custom subscription
  const subId = id("subscription", `custom-sub-${targetUserId}`);
  await paymentPrisma.userSubscription.deleteMany({
    where: { id: subId }
  });

  console.log("✨ Old entries cleaned.");

  // ===========================================================================
  // 1.5 Seed Pro Subscription
  // ===========================================================================
  console.log("💳 Seeding Pro subscription in payment_db...");
  const proPlan = await paymentPrisma.userPlan.findFirst({
    where: { type: "PRO" }
  });

  if (!proPlan) {
    console.warn("⚠️ Warning: PRO plan not found in payment_db! Skipping subscription seed.");
  } else {
    await paymentPrisma.userSubscription.create({
      data: {
        id: subId,
        userId: targetUserId,
        planId: proPlan.id,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 1 year duration
        isActive: true
      }
    });
    console.log("   ✅ Pro subscription seeded successfully.");
  }

  // ===========================================================================
  // 2. Seed Reading Practice Sessions (3 Attempts)
  // ===========================================================================
  console.log("📖 Seeding Reading test history (3 attempts)...");
  
  for (const attempt of READING_ATTEMPTS) {
    const sessionKey = `custom-reading-${attempt.attemptNum}-${targetUserId}`;
    const sessionId = id("practiceSession", sessionKey);
    const createdAt = new Date(Date.now() - attempt.daysAgo * 24 * 60 * 60 * 1000);
    const completedAt = new Date(createdAt.getTime() + attempt.durationMins * 60 * 1000);

    await assessmentPrisma.practiceSession.create({
      data: {
        id: sessionId,
        userId: targetUserId,
        testId: READING_TEST_ID,
        selectedSections: [READING_SECTION_ID],
        status: "COMPLETED",
        createdAt,
        completedAt,
        overallScaledScore: attempt.band,
        rawScoresBySkill: { READING: attempt.rawScore },
        scoresBySkill: { READING: attempt.band }
      }
    });

    for (const q of attempt.answers) {
      const answerId = id("answer", `${sessionKey}-${q.key}`);
      const qInfo = READING_QUESTION_INFOS[q.key];

      await assessmentPrisma.userAnswer.create({
        data: {
          id: answerId,
          practiceSessionId: sessionId,
          questionId: questionId(q.key),
          userId: targetUserId,
          selectedOptionIndex: q.userOptIdx,
          answerText: q.userAnsText,
          isCorrect: q.isCorrect,
          scoreAtSubmit: q.isCorrect ? 1.0 : 0.0,
          questionSnapshot: {
            questionType: qInfo.type,
            questionText: qInfo.text,
            correctAnswer: qInfo.ansText,
            correctAnswerIndex: qInfo.ansIdx
          }
        }
      });
    }
    console.log(`   ✅ Reading Attempt ${attempt.attemptNum} (Band ${attempt.band}) seeded.`);
  }

  // ===========================================================================
  // 3. Seed Listening Practice Sessions (3 Attempts)
  // ===========================================================================
  console.log("🎧 Seeding Listening test history (3 attempts)...");

  for (const attempt of LISTENING_ATTEMPTS) {
    const sessionKey = `custom-listening-${attempt.attemptNum}-${targetUserId}`;
    const sessionId = id("practiceSession", sessionKey);
    const createdAt = new Date(Date.now() - attempt.daysAgo * 24 * 60 * 60 * 1000);
    const completedAt = new Date(createdAt.getTime() + attempt.durationMins * 60 * 1000);

    await assessmentPrisma.practiceSession.create({
      data: {
        id: sessionId,
        userId: targetUserId,
        testId: LISTENING_TEST_ID,
        selectedSections: [LISTENING_SECTION_ID],
        status: "COMPLETED",
        createdAt,
        completedAt,
        overallScaledScore: attempt.band,
        rawScoresBySkill: { LISTENING: attempt.rawScore },
        scoresBySkill: { LISTENING: attempt.band }
      }
    });

    for (const q of attempt.answers) {
      const answerId = id("answer", `${sessionKey}-${q.key}`);
      const qInfo = LISTENING_QUESTION_INFOS[q.key];

      await assessmentPrisma.userAnswer.create({
        data: {
          id: answerId,
          practiceSessionId: sessionId,
          questionId: questionId(q.key),
          userId: targetUserId,
          selectedOptionIndex: q.userOptIdx,
          answerText: q.userAnsText,
          isCorrect: q.isCorrect,
          scoreAtSubmit: q.isCorrect ? 1.0 : 0.0,
          questionSnapshot: {
            questionType: qInfo.type,
            questionText: qInfo.text,
            correctAnswer: qInfo.ansText,
            correctAnswerIndex: qInfo.ansIdx
          }
        }
      });
    }
    console.log(`   ✅ Listening Attempt ${attempt.attemptNum} (Band ${attempt.band}) seeded.`);
  }

  // ===========================================================================
  // 4. Seed Writing AI Evaluations (3 Attempts)
  // ===========================================================================
  console.log("✍️ Seeding Writing test history & AI evaluations (3 attempts)...");

  for (const attempt of WRITING_ATTEMPTS) {
    const evalId = id("writing", `custom-writing-${attempt.attemptNum}-${targetUserId}`);
    const createdAt = new Date(Date.now() - attempt.daysAgo * 24 * 60 * 60 * 1000);
    const completedAt = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 mins evaluation latency

    await aiEvalPrisma.writingEvaluation.create({
      data: {
        id: evalId,
        userId: targetUserId,
        essayText: attempt.essayText,
        overallBand: attempt.overallBand,
        criteria: attempt.criteria,
        highlightedErrors: attempt.highlightedErrors,
        overallFeedback: attempt.overallFeedback,
        status: "COMPLETED",
        jobId: `custom_w_job_${attempt.attemptNum}_${targetUserId}`,
        createdAt,
        completedAt
      }
    });
    console.log(`   ✅ Writing Attempt ${attempt.attemptNum} (Band ${attempt.overallBand}) seeded.`);
  }

  // ===========================================================================
  // 5. Seed Speaking AI Sessions & Evaluations (3 Attempts)
  // ===========================================================================
  console.log("🗣️ Seeding Speaking test history & AI evaluations (3 attempts)...");

  for (const attempt of SPEAKING_ATTEMPTS) {
    const speakSessionId = id("spksession", `custom-speaking-session-${attempt.attemptNum}-${targetUserId}`);
    const speakEvalId = id("speaking", `custom-speaking-${attempt.attemptNum}-${targetUserId}`);
    const createdAt = new Date(Date.now() - attempt.daysAgo * 24 * 60 * 60 * 1000);
    const completedAt = new Date(createdAt.getTime() + 12 * 60 * 1000); // 12 mins evaluation latency

    // Speaking Session Cue card template
    const cueCard = {
      topic: `Describe something about ${attempt.topicTitle.toLowerCase()}.`,
      bullets: ["what it is", "why you like or dislike it", "how it affects you"],
      finalPrompt: `and explain your general opinion on ${attempt.topicTitle.toLowerCase()}.`,
      prepTimeSeconds: 60,
      speakTimeSeconds: 120
    };

    // Create interactive speaking session
    await aiEvalPrisma.speakingSession.create({
      data: {
        id: speakSessionId,
        userId: targetUserId,
        topicId: id("speakingTopic", attempt.topicKey),
        currentPart: 3,
        currentStep: 3,
        status: "COMPLETED",
        topic: attempt.topicTitle,
        cueCard,
        turns: attempt.turns,
        overallBand: attempt.overallBand,
        fluencyScore: attempt.criteria.fluency.score,
        lexicalScore: attempt.criteria.lexical.score,
        grammarScore: attempt.criteria.grammar.score,
        pronunciationScore: attempt.criteria.pronunciation.score,
        detailedFeedback: {
          fluency: attempt.criteria.fluency,
          lexical: attempt.criteria.lexical,
          grammar: attempt.criteria.grammar,
          pronunciation: attempt.criteria.pronunciation,
          summary: attempt.criteria.summary
        },
        createdAt,
        completedAt
      }
    });

    // Create speaking evaluation
    await aiEvalPrisma.speakingEvaluation.create({
      data: {
        id: speakEvalId,
        userId: targetUserId,
        sessionId: speakSessionId,
        audioUrl: attempt.audioUrl,
        transcript: attempt.transcript,
        duration: attempt.duration,
        overallBand: attempt.overallBand,
        pronunciationScore: attempt.criteria.pronunciation.score,
        fluencyScore: attempt.criteria.fluency.score,
        vocabScore: attempt.criteria.lexical.score,
        grammarScore: attempt.criteria.grammar.score,
        feedback: attempt.criteria.summary,
        status: "COMPLETED",
        jobId: `custom_s_job_${attempt.attemptNum}_${targetUserId}`,
        createdAt,
        completedAt
      }
    });

    console.log(`   ✅ Speaking Attempt ${attempt.attemptNum} (Band ${attempt.overallBand}) seeded.`);
  }

  console.log(`\n🎉 All ${READING_ATTEMPTS.length + LISTENING_ATTEMPTS.length + WRITING_ATTEMPTS.length + SPEAKING_ATTEMPTS.length} test history attempts successfully seeded for user ${targetUserId}!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:");
    console.error(e);
  })
  .finally(async () => {
    await assessmentPrisma.$disconnect();
    await aiEvalPrisma.$disconnect();
    await paymentPrisma.$disconnect();
  });
