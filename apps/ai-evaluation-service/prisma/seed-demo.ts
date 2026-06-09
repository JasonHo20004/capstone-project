import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import {
  LEARNERS,
  SPEAKING_TOPICS,
  PRACTICE_SESSIONS,
  daysAgo,
  daysFromNow,
  hoursAgo,
  id,
  userId,
  courseId,
  speakingTopicId,
  practiceSessionId,
} from "../../../seed-shared/index.js";

// Seed via the direct (non-pooled, port 5432) connection — the pgbouncer pooler
// (6543) closes Prisma's prepared statements mid-bulk-write (P1017).
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.AI_EVALUATION_DIRECT_URL ?? process.env.AI_EVALUATION_DATABASE_URL } },
});

// =============================================================================
// SpeakingTopic — 4 rows from SPEAKING_TOPICS (admin topic bank)
// =============================================================================

const SPEAKING_TOPIC_CONTENT: Record<
  string,
  {
    part1Questions: string[];
    part2Topic: string;
    part2Bullets: string[];
    part2FinalPrompt: string;
    part3Questions: string[];
  }
> = {
  "topic-hometown": {
    part1Questions: [
      "Where is your hometown?",
      "What do you like most about living there?",
      "Has your hometown changed much in recent years?",
      "Would you like to continue living there in the future?",
      "Do many tourists visit your hometown?",
    ],
    part2Topic: "Describe a place in your hometown that you enjoy visiting.",
    part2Bullets: [
      "where this place is",
      "how often you go there",
      "what you do when you are there",
    ],
    part2FinalPrompt: "and explain why you enjoy visiting this place.",
    part3Questions: [
      "How have hometowns changed for younger generations?",
      "Why do some people prefer to live in big cities rather than small towns?",
      "What are the advantages of growing up in a rural area?",
      "Do you think governments should invest more in local communities?",
    ],
  },
  "topic-work": {
    part1Questions: [
      "Do you work or are you a student?",
      "What do you enjoy most about your work or studies?",
      "Is there anything you would like to change about your job or course?",
      "What skills are important for your field?",
      "Do you prefer working alone or in a team?",
    ],
    part2Topic: "Describe a skill you would like to learn for your future career.",
    part2Bullets: [
      "what the skill is",
      "how you would learn it",
      "why this skill is useful for your career",
    ],
    part2FinalPrompt: "and explain how this skill could change your future.",
    part3Questions: [
      "Why do many people change careers during their lives?",
      "How important is work-life balance in modern society?",
      "Should companies provide more training for their employees?",
      "Do you think remote work will become more common in the future?",
      "How has technology changed the way people work?",
    ],
  },
  "topic-tech": {
    part1Questions: [
      "How often do you use social media?",
      "What is your favourite piece of technology?",
      "Do you think you spend too much time online?",
      "How has technology changed communication with your friends?",
    ],
    part2Topic: "Describe a piece of technology you find useful in daily life.",
    part2Bullets: [
      "what the technology is",
      "how often you use it",
      "what you use it for",
    ],
    part2FinalPrompt: "and explain why you find this technology so useful.",
    part3Questions: [
      "What are the negative effects of social media on young people?",
      "Do you think technology makes people less social?",
      "How might artificial intelligence change education?",
      "Should there be stricter rules about data privacy?",
      "Is it possible for people to live without smartphones today?",
      "How can parents control children's screen time effectively?",
    ],
  },
  "topic-env": {
    part1Questions: [
      "Do you do anything to protect the environment?",
      "Is recycling common where you live?",
      "Has the weather changed in your country recently?",
      "Do you prefer spending time indoors or outdoors?",
    ],
    part2Topic: "Describe an environmental problem in your area.",
    part2Bullets: [
      "what the problem is",
      "what causes it",
      "how it affects local people",
    ],
    part2FinalPrompt: "and explain what could be done to solve this problem.",
    part3Questions: [
      "What can individuals do to reduce climate change?",
      "Should governments tax companies that pollute the environment?",
      "How effective is recycling at solving waste problems?",
      "Do you think future generations will live in a cleaner world?",
      "Why do some people ignore environmental warnings?",
      "How can schools teach children about sustainability?",
    ],
  },
};

async function seedSpeakingTopics() {
  for (const t of SPEAKING_TOPICS) {
    const content = SPEAKING_TOPIC_CONTENT[t.key];
    const data = {
      id: speakingTopicId(t.key),
      title: t.title,
      isActive: true,
      isPremium: t.isPremium,
      part1Questions: content.part1Questions,
      part2Topic: content.part2Topic,
      part2Bullets: content.part2Bullets,
      part2FinalPrompt: content.part2FinalPrompt,
      part3Questions: content.part3Questions,
    };
    await prisma.speakingTopic.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// WritingEvaluation — 8 rows
// =============================================================================

interface WritingRow {
  key: string;
  learnerKey: string;
  sessionKey: string | null;
  essayText: string;
  overallBand: number | null;
  criteria: object | null;
  highlightedErrors: object[] | null;
  overallFeedback: string | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdDaysAgo: number;
}

const writingCriteria = (
  ta: number,
  cc: number,
  lr: number,
  gra: number,
  feedback: { ta: string; cc: string; lr: string; gra: string }
) => ({
  task_achievement: { score: ta, feedback: feedback.ta },
  coherence: { score: cc, feedback: feedback.cc },
  lexical: { score: lr, feedback: feedback.lr },
  grammar: { score: gra, feedback: feedback.gra },
});

const WRITING_ROWS: WritingRow[] = [
  {
    key: "w-dung-1",
    learnerKey: "dung",
    sessionKey: "ps-dung-reading",
    essayText:
      "Some people believe that universities should focus only on academic subjects, while others argue that they should also prepare students for the world of work. In my opinion, a balanced approach is the most effective. Academic knowledge develops critical thinking and a deep understanding of a discipline, which remains valuable throughout life. However, practical skills such as communication, teamwork and problem solving are equally important for graduates entering competitive job markets. Universities that combine theory with internships and project-based learning produce graduates who are both knowledgeable and employable. Therefore, rather than choosing one priority over the other, institutions should integrate both academic and vocational elements into their curricula.",
    overallBand: 7.5,
    criteria: writingCriteria(7.5, 7.5, 8.0, 7.0, {
      ta: "The essay fully addresses both views and presents a clear, well-supported position.",
      cc: "Ideas are logically organised with effective use of cohesive devices and clear paragraphing.",
      lr: "A wide range of vocabulary is used naturally, including precise collocations such as 'competitive job markets'.",
      gra: "A mix of complex structures is used, though one or two minor slips with articles appear.",
    }),
    highlightedErrors: [
      { original: "produce graduates who are both knowledgeable and employable", suggestion: "no change needed", type: "style" },
    ],
    overallFeedback:
      "A strong, well-balanced response with a clear position and confident control of academic vocabulary. To reach band 8, eliminate the few minor article errors and vary sentence openings further.",
    status: "COMPLETED",
    createdDaysAgo: 20,
  },
  {
    key: "w-lan-1",
    learnerKey: "lan",
    sessionKey: "ps-lan-reading",
    essayText:
      "It is sometimes argued that governments should spend money on public services rather than on the arts. While essential services clearly deserve priority, I believe that funding the arts also brings significant long-term benefits. Hospitals, schools and transport systems directly affect people's daily welfare, so they must be adequately financed. Nevertheless, museums, theatres and music programmes enrich cultural identity, support tourism and improve mental wellbeing. A society that neglects creativity risks becoming purely functional and uninspiring. Consequently, a sensible government should allocate the majority of its budget to public services while still reserving a reasonable proportion for cultural investment, ensuring both prosperity and a vibrant national life.",
    overallBand: 8.0,
    criteria: writingCriteria(8.0, 8.0, 8.0, 8.0, {
      ta: "Both sides are addressed and a nuanced position is consistently developed.",
      cc: "The response is logically sequenced with sophisticated linking and well-managed paragraphs.",
      lr: "Vocabulary is wide-ranging and used with precision, e.g. 'enrich cultural identity'.",
      gra: "A wide range of structures is used with full flexibility and accuracy.",
    }),
    highlightedErrors: [],
    overallFeedback:
      "An excellent, mature essay with strong cohesion and precise lexis. This is a convincing band 8 response.",
    status: "COMPLETED",
    createdDaysAgo: 30,
  },
  {
    key: "w-an-1",
    learnerKey: "an",
    sessionKey: "ps-an-reading",
    essayText:
      "Nowadays many people choose to live in big cities instead of the countryside. There are several reasons for this trend. Firstly, cities offer more job opportunities and higher salaries, which attract young workers. Secondly, urban areas have better hospitals, schools and entertainment. However, living in a city also has disadvantages such as pollution, traffic and high cost of living. In my opinion, although cities are convenient, the countryside provides a calmer and healthier lifestyle. People should think carefully about their priorities before deciding where to live, because both options have clear advantages and disadvantages.",
    overallBand: 6.0,
    criteria: writingCriteria(6.0, 6.0, 6.0, 5.5, {
      ta: "The position is clear and main ideas are relevant, but some points are underdeveloped.",
      cc: "Paragraphing is logical and basic linkers are used, though transitions are sometimes mechanical.",
      lr: "An adequate range of vocabulary is used with occasional repetition of 'advantages and disadvantages'.",
      gra: "Simple and some complex sentences appear, but errors with subject-verb agreement reduce accuracy.",
    }),
    highlightedErrors: [
      { original: "cities offer more job opportunities", suggestion: "cities offer more job opportunities (good)", type: "lexical" },
      { original: "both options have clear advantages and disadvantages", suggestion: "avoid repeating 'advantages and disadvantages'", type: "lexical" },
    ],
    overallFeedback:
      "A competent essay with clear structure. To progress, develop each idea with examples and use a wider range of linking phrases instead of repeating the same expressions.",
    status: "COMPLETED",
    createdDaysAgo: 12,
  },
  {
    key: "w-binh-1",
    learnerKey: "binh",
    sessionKey: "ps-binh-reading",
    essayText:
      "In recent years, online shopping has become extremely popular around the world. Many customers prefer buying products on the internet because it saves time and offers a wide variety of choices. In addition, prices online are often cheaper than in traditional stores. On the other hand, online shopping has some problems. Customers cannot try products before buying, and sometimes the items they receive are different from the pictures. Moreover, online fraud is increasing. To conclude, online shopping is convenient but buyers should be careful and only use trusted websites to avoid losing their money.",
    overallBand: 6.5,
    criteria: writingCriteria(6.5, 6.5, 6.5, 6.0, {
      ta: "The task is addressed with relevant ideas and a clear conclusion.",
      cc: "Information is logically organised, though some sentences could be linked more smoothly.",
      lr: "Vocabulary is sufficient and mostly appropriate, with a few less precise word choices.",
      gra: "A mix of structures is attempted; minor errors with prepositions occasionally occur.",
    }),
    highlightedErrors: [
      { original: "prices online are often cheaper", suggestion: "online prices are often cheaper", type: "grammar" },
      { original: "online fraud is increasing", suggestion: "online fraud is on the rise", type: "lexical" },
    ],
    overallFeedback:
      "A solid band 6.5 answer with balanced content. Focus on smoother cohesion between sentences and more varied vocabulary to reach band 7.",
    status: "COMPLETED",
    createdDaysAgo: 9,
  },
  {
    key: "w-ha-1",
    learnerKey: "ha",
    sessionKey: null,
    essayText:
      "Many companies today allow their staff to work from home. This change has both positive and negative effects on employees and businesses. On the positive side, remote work reduces commuting time and gives workers more flexibility to balance their personal and professional lives. Companies can also save money on office space. However, working from home can lead to isolation and make communication between team members more difficult. Some employees also find it hard to stay motivated without direct supervision. Overall, I believe remote work is beneficial if companies provide clear guidelines and the right technology to keep teams connected and productive.",
    overallBand: 6.5,
    criteria: writingCriteria(6.5, 7.0, 6.5, 6.0, {
      ta: "Both effects are discussed and a clear opinion is given in the conclusion.",
      cc: "Paragraphs are well organised with a logical progression of ideas.",
      lr: "A good range of work-related vocabulary is used, e.g. 'balance their personal and professional lives'.",
      gra: "Complex sentences are attempted; a few errors with verb forms slightly reduce accuracy.",
    }),
    highlightedErrors: [
      { original: "make communication between team members more difficult", suggestion: "no change needed", type: "style" },
    ],
    overallFeedback:
      "A clear and well-structured response. To improve, add a specific example for each side and tighten grammatical accuracy in complex sentences.",
    status: "COMPLETED",
    createdDaysAgo: 5,
  },
  {
    key: "w-giang-1",
    learnerKey: "giang",
    sessionKey: null,
    essayText:
      "These days a lot of students study abroad to get a better education. I think this is a good idea for many reasons. First, students can learn a new language and experience a different culture. Second, foreign universities sometimes have better facilities and teachers. But there are also some difficulties. Living far from family can be lonely, and the cost of studying overseas is very high. In conclusion, studying abroad is a great chance for young people, but they need to prepare carefully and have enough money before they go.",
    overallBand: 5.5,
    criteria: writingCriteria(5.5, 5.5, 5.5, 5.0, {
      ta: "The main idea is clear but the discussion stays fairly general with limited development.",
      cc: "Simple sequencing words are used; paragraphing is present but transitions are basic.",
      lr: "Everyday vocabulary is used adequately, with little variety in expression.",
      gra: "Mostly simple sentences; errors with articles and verb tense affect clarity at times.",
    }),
    highlightedErrors: [
      { original: "get a better education", suggestion: "receive a better education", type: "lexical" },
      { original: "the cost of studying overseas is very high", suggestion: "studying overseas is very expensive", type: "lexical" },
    ],
    overallFeedback:
      "A reasonable attempt with a clear opinion. To move beyond band 5.5, develop each point with examples and use more complex grammatical structures.",
    status: "COMPLETED",
    createdDaysAgo: 3,
  },
  {
    key: "w-nam-1",
    learnerKey: "nam",
    sessionKey: "ps-nam-toeic",
    essayText:
      "Some people think children should start learning a foreign language at primary school, while others believe it is better to begin at secondary school. I am still developing my argument, but I tend to support early learning because young children absorb languages quickly and without fear of making mistakes. Early exposure can also lead to better pronunciation. At the same time, very young learners may lack the discipline required for grammar study, so a playful approach is essential during the first years.",
    overallBand: null,
    criteria: null,
    highlightedErrors: null,
    overallFeedback: null,
    status: "PROCESSING",
    createdDaysAgo: 0,
  },
  {
    key: "w-chi-1",
    learnerKey: "chi",
    sessionKey: null,
    essayText:
      "I want to write about my daily routine and why I think having a routine is helpful for students. Every morning I wake up early, review my vocabulary, and then go to class. In the evening I practise listening for thirty minutes. A regular routine helps me feel organised and reduces stress before exams.",
    overallBand: null,
    criteria: null,
    highlightedErrors: null,
    overallFeedback: null,
    status: "PENDING",
    createdDaysAgo: 0,
  },
];

async function seedWritingEvaluations() {
  for (const r of WRITING_ROWS) {
    const createdAt = hoursAgo(r.createdDaysAgo * 24 + 2);
    const data = {
      id: id("writing", r.key),
      userId: userId(r.learnerKey),
      sessionId: r.sessionKey ? practiceSessionId(r.sessionKey) : null,
      questionId: null,
      essayText: r.essayText,
      overallBand: r.overallBand,
      criteria: r.criteria === null ? undefined : r.criteria,
      highlightedErrors: r.highlightedErrors === null ? undefined : r.highlightedErrors,
      overallFeedback: r.overallFeedback,
      status: r.status,
      jobId: `job_w_${r.key}`,
      createdAt,
      completedAt: r.status === "COMPLETED" ? hoursAgo(r.createdDaysAgo * 24) : null,
    };
    await prisma.writingEvaluation.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// SpeakingEvaluation — 6 rows
// =============================================================================

interface SpeakingEvalRow {
  key: string;
  learnerKey: string;
  transcript: string;
  duration: number;
  overallBand: number | null;
  pronunciation: number | null;
  fluency: number | null;
  vocab: number | null;
  grammar: number | null;
  feedback: string | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdDaysAgo: number;
}

const SPEAKING_EVAL_ROWS: SpeakingEvalRow[] = [
  {
    key: "se-dung-1",
    learnerKey: "dung",
    transcript:
      "Well, my hometown is a fairly large coastal city in central Vietnam, and honestly it's a place I'm quite proud of. What I appreciate most is the balance between modern development and a relaxed seaside atmosphere. Over the past decade it has changed dramatically, with new bridges and tourist resorts springing up, yet the local food culture has remained authentic. If I had the choice, I would definitely consider settling there in the future.",
    duration: 92,
    overallBand: 7.5,
    pronunciation: 7.5,
    fluency: 8.0,
    vocab: 7.5,
    grammar: 7.0,
    feedback:
      "Fluent and coherent delivery with natural intonation. Vocabulary is precise and the response is well developed. Minor grammatical slips with complex tenses prevent a higher score.",
    status: "COMPLETED",
    createdDaysAgo: 6,
  },
  {
    key: "se-lan-1",
    learnerKey: "lan",
    transcript:
      "The skill I would most like to master is public speaking, because in my future research career I'll need to present complex ideas to diverse audiences. I'd approach it by joining a debate club and recording myself regularly to analyse my pacing and body language. Ultimately, becoming a confident speaker would allow me to share my work internationally and collaborate with scholars across the world.",
    duration: 84,
    overallBand: 8.0,
    pronunciation: 8.0,
    fluency: 8.0,
    vocab: 8.0,
    grammar: 8.0,
    feedback:
      "An articulate, well-organised answer delivered with excellent fluency and a wide lexical range. Pronunciation is clear and natural throughout. This is a strong band 8 performance.",
    status: "COMPLETED",
    createdDaysAgo: 4,
  },
  {
    key: "se-an-1",
    learnerKey: "an",
    transcript:
      "Um, I think the most useful technology for me is my smartphone. I use it every day, maybe too much actually. I use it for studying English, listening to podcasts, and chatting with my friends. It is very convenient because I can do many things in one device. Sometimes I think I should reduce my screen time, but it is really helpful for my daily life.",
    duration: 61,
    overallBand: 6.0,
    pronunciation: 6.0,
    fluency: 6.0,
    vocab: 6.0,
    grammar: 5.5,
    feedback:
      "A clear response with relevant content. Some hesitation and fillers affect fluency, and there are minor grammatical errors. Try to extend answers with more examples and reduce repetition of 'I use it'.",
    status: "COMPLETED",
    createdDaysAgo: 7,
  },
  {
    key: "se-binh-1",
    learnerKey: "binh",
    transcript:
      "In my area, the biggest environmental problem is air pollution caused by heavy traffic and a few old factories. It mainly affects elderly people and children, who often suffer from breathing difficulties during rush hour. I believe the local authorities should invest in public transport and encourage people to use electric vehicles, which would gradually reduce emissions and make the air cleaner for everyone.",
    duration: 70,
    overallBand: 6.5,
    pronunciation: 6.5,
    fluency: 6.5,
    vocab: 7.0,
    grammar: 6.0,
    feedback:
      "A well-structured answer with good topic vocabulary such as 'emissions' and 'electric vehicles'. Fluency is steady; a few grammatical errors with relative clauses appear. Extend with one concrete example for band 7.",
    status: "COMPLETED",
    createdDaysAgo: 8,
  },
  {
    key: "se-ha-1",
    learnerKey: "ha",
    transcript:
      "I'd like to talk about a skill I find essential for the workplace, which is effective business writing. In my current role I write emails and reports every day, so being concise and professional really matters. I improve this skill by reading well-written business documents and asking colleagues for feedback. Good writing helps me communicate clearly and builds trust with clients.",
    duration: 66,
    overallBand: 6.5,
    pronunciation: 6.5,
    fluency: 7.0,
    vocab: 6.5,
    grammar: 6.5,
    feedback:
      "A relevant and fluent answer with appropriate professional vocabulary. Pronunciation is generally clear. To improve, use a wider range of complex structures and add a specific workplace example.",
    status: "COMPLETED",
    createdDaysAgo: 3,
  },
  {
    key: "se-giang-1",
    learnerKey: "giang",
    transcript:
      "So, about my hometown, it is a small town near the mountains. I like it because it is quiet and the air is fresh. We have a nice market and friendly people. I think it has changed a little, there are more shops now.",
    duration: 44,
    overallBand: null,
    pronunciation: null,
    fluency: null,
    vocab: null,
    grammar: null,
    feedback: null,
    status: "PROCESSING",
    createdDaysAgo: 0,
  },
];

async function seedSpeakingEvaluations() {
  for (const r of SPEAKING_EVAL_ROWS) {
    const createdAt = hoursAgo(r.createdDaysAgo * 24 + 1);
    const data = {
      id: id("speaking", r.key),
      userId: userId(r.learnerKey),
      sessionId: null,
      questionId: null,
      audioUrl: `https://cdn.demo.capstone.local/speaking/${r.key}.webm`,
      transcript: r.transcript,
      duration: r.duration,
      overallBand: r.overallBand,
      pronunciationScore: r.pronunciation,
      fluencyScore: r.fluency,
      vocabScore: r.vocab,
      grammarScore: r.grammar,
      feedback: r.feedback,
      status: r.status,
      jobId: `job_s_${r.key}`,
      createdAt,
      completedAt: r.status === "COMPLETED" ? hoursAgo(r.createdDaysAgo * 24) : null,
    };
    await prisma.speakingEvaluation.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// SpeakingSession — 6 rows
// =============================================================================

interface SpeakingSessionRow {
  key: string;
  learnerKey: string;
  topicKey: string;
  currentPart: number;
  currentStep: number;
  status: "IN_PROGRESS" | "GRADING" | "COMPLETED" | "ABANDONED";
  overallBand: number | null;
  fluency: number | null;
  lexical: number | null;
  grammar: number | null;
  pronunciation: number | null;
  createdDaysAgo: number;
}

const SPEAKING_SESSION_ROWS: SpeakingSessionRow[] = [
  { key: "ss-dung-1",  learnerKey: "dung",  topicKey: "topic-tech",     currentPart: 3, currentStep: 4, status: "COMPLETED", overallBand: 7.5, fluency: 8.0, lexical: 7.5, grammar: 7.0, pronunciation: 7.5, createdDaysAgo: 6 },
  { key: "ss-lan-1",   learnerKey: "lan",   topicKey: "topic-env",      currentPart: 3, currentStep: 5, status: "COMPLETED", overallBand: 8.0, fluency: 8.0, lexical: 8.0, grammar: 8.0, pronunciation: 8.0, createdDaysAgo: 4 },
  { key: "ss-an-1",    learnerKey: "an",    topicKey: "topic-hometown", currentPart: 3, currentStep: 3, status: "COMPLETED", overallBand: 6.0, fluency: 6.0, lexical: 6.0, grammar: 5.5, pronunciation: 6.0, createdDaysAgo: 7 },
  { key: "ss-binh-1",  learnerKey: "binh",  topicKey: "topic-work",     currentPart: 3, currentStep: 4, status: "COMPLETED", overallBand: 6.5, fluency: 6.5, lexical: 7.0, grammar: 6.0, pronunciation: 6.5, createdDaysAgo: 8 },
  { key: "ss-ha-1",    learnerKey: "ha",    topicKey: "topic-work",     currentPart: 2, currentStep: 1, status: "IN_PROGRESS", overallBand: null, fluency: null, lexical: null, grammar: null, pronunciation: null, createdDaysAgo: 0 },
  { key: "ss-giang-1", learnerKey: "giang", topicKey: "topic-hometown", currentPart: 1, currentStep: 2, status: "IN_PROGRESS", overallBand: null, fluency: null, lexical: null, grammar: null, pronunciation: null, createdDaysAgo: 0 },
];

function buildTurns(topicTitle: string, createdDaysAgo: number, completed: boolean) {
  const base = hoursAgo(createdDaysAgo * 24 + 1).getTime();
  const at = (offsetSec: number) => new Date(base + offsetSec * 1000).toISOString();
  const turns = [
    { role: "examiner", content: `Let's talk about ${topicTitle.toLowerCase()}. Can you tell me a little about it?`, timestamp: at(0) },
    { role: "candidate", content: "Sure. It's a topic I find genuinely interesting and I'm happy to share my thoughts.", timestamp: at(8) },
    { role: "examiner", content: "That's interesting. Could you give me an example?", timestamp: at(40) },
    { role: "candidate", content: "Of course. For instance, in my own experience this comes up quite often in daily life.", timestamp: at(48) },
  ];
  if (completed) {
    turns.push(
      { role: "examiner", content: "Thank you. Now let's move on to some broader questions.", timestamp: at(95) },
      { role: "candidate", content: "I think there are several perspectives worth considering on a wider scale.", timestamp: at(102) }
    );
  }
  return turns;
}

function buildCueCard(topicKey: string) {
  const content = SPEAKING_TOPIC_CONTENT[topicKey];
  return {
    topic: content.part2Topic,
    bullets: content.part2Bullets,
    finalPrompt: content.part2FinalPrompt,
    prepTimeSeconds: 60,
    speakTimeSeconds: 120,
  };
}

function buildDetailedFeedback(row: SpeakingSessionRow) {
  return {
    fluency: { score: row.fluency, comment: "Speech flows at a natural pace with appropriate use of cohesive markers." },
    lexical: { score: row.lexical, comment: "A good range of topic-specific vocabulary is used accurately." },
    grammar: { score: row.grammar, comment: "A variety of structures is attempted with mostly good control." },
    pronunciation: { score: row.pronunciation, comment: "Clear pronunciation with generally natural stress and intonation." },
    summary: `Overall band ${row.overallBand}. A coherent performance across all three parts; focus on extending part 3 answers for further improvement.`,
  };
}

async function seedSpeakingSessions() {
  const topicTitleByKey = Object.fromEntries(SPEAKING_TOPICS.map((t) => [t.key, t.title]));
  for (const r of SPEAKING_SESSION_ROWS) {
    const completed = r.status === "COMPLETED";
    const createdAt = hoursAgo(r.createdDaysAgo * 24 + 1);
    const data = {
      id: id("spksession", r.key),
      userId: userId(r.learnerKey),
      topicId: speakingTopicId(r.topicKey),
      currentPart: r.currentPart,
      currentStep: r.currentStep,
      status: r.status,
      topic: topicTitleByKey[r.topicKey],
      cueCard: buildCueCard(r.topicKey),
      turns: buildTurns(topicTitleByKey[r.topicKey], r.createdDaysAgo, completed),
      overallBand: r.overallBand,
      fluencyScore: r.fluency,
      lexicalScore: r.lexical,
      grammarScore: r.grammar,
      pronunciationScore: r.pronunciation,
      detailedFeedback: completed ? buildDetailedFeedback(r) : undefined,
      createdAt,
      completedAt: completed ? hoursAgo(r.createdDaysAgo * 24) : null,
    };
    await prisma.speakingSession.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// UserSkillTree — 4 rows (an, dung, binh, ha)
// =============================================================================

interface SkillTreeRow {
  key: string;
  learnerKey: string;
  topic: string;
  level: string;
}

const SKILL_TREE_ROWS: SkillTreeRow[] = [
  { key: "st-an-travel",    learnerKey: "an",   topic: "travel",   level: "B1" },
  { key: "st-dung-business",learnerKey: "dung", topic: "business", level: "C1" },
  { key: "st-binh-food",    learnerKey: "binh", topic: "food",     level: "B2" },
  { key: "st-ha-daily",     learnerKey: "ha",   topic: "daily",    level: "B2" },
];

function buildSkillTreeNodes(topic: string) {
  const cap = topic.charAt(0).toUpperCase() + topic.slice(1);
  return [
    { id: `${topic}-n1`, label: `${cap} Vocabulary Basics`, type: "lesson", status: "completed", position: { x: 0, y: 0 }, mixedSkills: ["reading", "vocabulary"], questionTypes: ["multiple_choice"], description: `Core ${topic} vocabulary and common phrases.` },
    { id: `${topic}-n2`, label: `${cap} Listening Practice`, type: "quiz", status: "completed", position: { x: 200, y: 0 }, mixedSkills: ["listening"], questionTypes: ["gap_fill", "multiple_choice"], description: `Listen to ${topic} dialogues and answer questions.` },
    { id: `${topic}-n3`, label: `${cap} Grammar Focus`, type: "lesson", status: "unlocked", position: { x: 400, y: 0 }, mixedSkills: ["grammar"], questionTypes: ["sentence_transformation"], description: `Grammar structures frequently used in ${topic} contexts.` },
    { id: `${topic}-n4`, label: `${cap} Speaking Drill`, type: "quiz", status: "locked", position: { x: 600, y: 0 }, mixedSkills: ["speaking", "vocabulary"], questionTypes: ["open_response"], description: `Practise speaking about ${topic} topics.` },
    { id: `${topic}-n5`, label: `${cap} Mastery Challenge`, type: "boss", status: "locked", position: { x: 800, y: 0 }, mixedSkills: ["reading", "listening", "grammar", "vocabulary"], questionTypes: ["multiple_choice", "gap_fill"], description: `Final mixed-skill challenge for the ${topic} branch.` },
  ];
}

function buildSkillTreeEdges(topic: string) {
  return [
    { id: `${topic}-e1`, source: `${topic}-n1`, target: `${topic}-n2`, animated: true },
    { id: `${topic}-e2`, source: `${topic}-n2`, target: `${topic}-n3`, animated: true },
    { id: `${topic}-e3`, source: `${topic}-n3`, target: `${topic}-n4`, animated: true },
    { id: `${topic}-e4`, source: `${topic}-n4`, target: `${topic}-n5`, animated: true },
  ];
}

async function seedSkillTrees() {
  for (const r of SKILL_TREE_ROWS) {
    const data = {
      id: id("skilltree", r.key),
      userId: userId(r.learnerKey),
      topic: r.topic,
      level: r.level,
      nodes: buildSkillTreeNodes(r.topic),
      edges: buildSkillTreeEdges(r.topic),
    };
    await prisma.userSkillTree.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// MiniQuiz — 5 rows linked to skill trees
// =============================================================================

interface MiniQuizRow {
  key: string;
  learnerKey: string;
  treeKey: string;
  topic: string;
  nodeIndex: number; // 1-based node index within the tree
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  createdDaysAgo: number;
}

const MINI_QUIZ_ROWS: MiniQuizRow[] = [
  { key: "mq-an-1",   learnerKey: "an",   treeKey: "st-an-travel",     topic: "travel",   nodeIndex: 2, status: "COMPLETED",   score: 80, createdDaysAgo: 6 },
  { key: "mq-dung-1", learnerKey: "dung", treeKey: "st-dung-business", topic: "business", nodeIndex: 2, status: "COMPLETED",   score: 100, createdDaysAgo: 5 },
  { key: "mq-binh-1", learnerKey: "binh", treeKey: "st-binh-food",     topic: "food",     nodeIndex: 1, status: "COMPLETED",   score: 60, createdDaysAgo: 4 },
  { key: "mq-ha-1",   learnerKey: "ha",   treeKey: "st-ha-daily",      topic: "daily",    nodeIndex: 3, status: "IN_PROGRESS", score: null, createdDaysAgo: 0 },
  { key: "mq-an-2",   learnerKey: "an",   treeKey: "st-an-travel",     topic: "travel",   nodeIndex: 3, status: "PENDING",     score: null, createdDaysAgo: 0 },
];

function buildQuizQuestions(topic: string) {
  return [
    { question: `Which word best describes a popular ${topic} destination?`, options: ["crowded", "silent", "empty", "broken"], correctIndex: 0, type: "multiple_choice", skill: "vocabulary", tag: topic },
    { question: `Choose the correct sentence about ${topic}.`, options: ["I have been there last year", "I went there last year", "I going there last year", "I goes there last year"], correctIndex: 1, type: "grammar", skill: "grammar", tag: topic },
    { question: `What is a synonym for 'enjoyable' in a ${topic} context?`, options: ["pleasant", "tedious", "harmful", "useless"], correctIndex: 0, type: "multiple_choice", skill: "vocabulary", tag: topic },
    { question: `Fill the gap: 'We ___ to plan our ${topic} carefully.'`, options: ["needs", "need", "needing", "needed to be"], correctIndex: 1, type: "gap_fill", skill: "grammar", tag: topic },
    { question: `Which phrase is most natural when discussing ${topic}?`, options: ["make a decision", "do a decision", "have a decision", "take a decide"], correctIndex: 0, type: "multiple_choice", skill: "vocabulary", tag: topic },
  ];
}

function buildUserAnswers(score: number) {
  // 5 questions; number correct derived from score percentage.
  const correctCount = Math.round((score / 100) * 5);
  const correctIndices = [0, 1, 0, 1, 0];
  return correctIndices.map((ci, i) => {
    const isCorrect = i < correctCount;
    return {
      questionIndex: i,
      selectedIndex: isCorrect ? ci : (ci + 1) % 4,
      isCorrect,
    };
  });
}

async function seedMiniQuizzes() {
  for (const r of MINI_QUIZ_ROWS) {
    const nodeId = `${r.topic}-n${r.nodeIndex}`;
    const completed = r.status === "COMPLETED";
    const data = {
      id: id("miniquiz", r.key),
      userId: userId(r.learnerKey),
      skillTreeId: id("skilltree", r.treeKey),
      nodeId,
      questions: buildQuizQuestions(r.topic),
      userAnswers: completed && r.score !== null ? buildUserAnswers(r.score) : undefined,
      score: r.score,
      totalQuestions: 5,
      status: r.status,
      createdAt: hoursAgo(r.createdDaysAgo * 24 + 1),
      completedAt: completed ? hoursAgo(r.createdDaysAgo * 24) : null,
    };
    await prisma.miniQuiz.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// UserLearningGoal — 6 rows (userId @unique)
// =============================================================================

interface GoalRow {
  learnerKey: string;
  currentLevel: string;
  targetScore: string;
  deadline: string;
  roadmap: object[];
}

const goalRoadmap = (phases: { phase: string; focus: string; weeks: number }[]) =>
  phases.map((p, i) => ({
    order: i + 1,
    phase: p.phase,
    focus: p.focus,
    durationWeeks: p.weeks,
    status: i === 0 ? "in_progress" : "upcoming",
  }));

const GOAL_ROWS: GoalRow[] = [
  {
    learnerKey: "an",
    currentLevel: "B1",
    targetScore: "IELTS 6.5",
    deadline: "2026-12-31",
    roadmap: goalRoadmap([
      { phase: "Foundation", focus: "Reading & Listening strategies", weeks: 6 },
      { phase: "Writing Task 2", focus: "Essay structure and cohesion", weeks: 6 },
      { phase: "Speaking fluency", focus: "Part 2 & 3 development", weeks: 4 },
      { phase: "Mock tests", focus: "Full timed practice", weeks: 4 },
    ]),
  },
  {
    learnerKey: "dung",
    currentLevel: "C1",
    targetScore: "IELTS 7.5",
    deadline: "2026-10-31",
    roadmap: goalRoadmap([
      { phase: "Advanced Writing", focus: "Band 7+ Task 1 & 2", weeks: 5 },
      { phase: "Academic Speaking", focus: "Complex idea expression", weeks: 4 },
      { phase: "Exam refinement", focus: "Timing and accuracy", weeks: 3 },
    ]),
  },
  {
    learnerKey: "lan",
    currentLevel: "C1",
    targetScore: "IELTS 8.0",
    deadline: "2026-09-30",
    roadmap: goalRoadmap([
      { phase: "Precision lexis", focus: "Collocations and paraphrasing", weeks: 4 },
      { phase: "Grammar mastery", focus: "Flexibility and accuracy", weeks: 3 },
      { phase: "Full mocks", focus: "Band 8 consistency", weeks: 4 },
    ]),
  },
  {
    learnerKey: "binh",
    currentLevel: "B2",
    targetScore: "TOEIC 800",
    deadline: "2026-11-30",
    roadmap: goalRoadmap([
      { phase: "Listening Parts 1-4", focus: "Detail and inference", weeks: 5 },
      { phase: "Reading Parts 5-7", focus: "Speed and grammar", weeks: 5 },
      { phase: "Full TOEIC mocks", focus: "Score stabilisation", weeks: 3 },
    ]),
  },
  {
    learnerKey: "ha",
    currentLevel: "B2",
    targetScore: "IELTS 7.0",
    deadline: "2027-01-31",
    roadmap: goalRoadmap([
      { phase: "Business writing", focus: "Formal register", weeks: 4 },
      { phase: "Speaking confidence", focus: "Spontaneous responses", weeks: 4 },
      { phase: "Integrated practice", focus: "All four skills", weeks: 4 },
    ]),
  },
  {
    learnerKey: "giang",
    currentLevel: "B1",
    targetScore: "IELTS 6.0",
    deadline: "2027-03-31",
    roadmap: goalRoadmap([
      { phase: "Core grammar", focus: "Tenses and articles", weeks: 6 },
      { phase: "Vocabulary building", focus: "Topic word lists", weeks: 5 },
      { phase: "Skill practice", focus: "Reading & Listening", weeks: 5 },
    ]),
  },
];

async function seedLearningGoals() {
  for (const r of GOAL_ROWS) {
    const data = {
      id: id("goal", r.learnerKey),
      userId: userId(r.learnerKey),
      currentLevel: r.currentLevel,
      targetScore: r.targetScore,
      deadline: r.deadline,
      roadmap: r.roadmap,
    };
    await prisma.userLearningGoal.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// UserLearningProfile — 8 rows (userId @unique)
// =============================================================================

interface ProfileRow {
  learnerKey: string;
  target: number;
  current: number;
  skillGaps: { listening: number; reading: number; writing: number; speaking: number };
  bestTime: "morning" | "afternoon" | "evening" | "night";
  avgSessionMin: number;
  errorPatterns: string[];
  totalQuizzes: number;
  proactiveEnabled: boolean;
  lastPushHoursAgo: number;
  minIntervalHours: number;
}

const PROFILE_ROWS: ProfileRow[] = [
  { learnerKey: "an",    target: 6.5, current: 6.0, skillGaps: { listening: 0.4, reading: 0.3, writing: 0.6, speaking: 0.5 }, bestTime: "evening",   avgSessionMin: 28, errorPatterns: ["subject_verb_agreement", "article_usage"], totalQuizzes: 14, proactiveEnabled: true,  lastPushHoursAgo: 5,  minIntervalHours: 4 },
  { learnerKey: "binh",  target: 7.0, current: 6.5, skillGaps: { listening: 0.3, reading: 0.4, writing: 0.5, speaking: 0.4 }, bestTime: "morning",   avgSessionMin: 35, errorPatterns: ["preposition_choice"], totalQuizzes: 22, proactiveEnabled: true,  lastPushHoursAgo: 9,  minIntervalHours: 6 },
  { learnerKey: "chi",   target: 5.5, current: 4.5, skillGaps: { listening: 0.6, reading: 0.5, writing: 0.7, speaking: 0.6 }, bestTime: "afternoon", avgSessionMin: 18, errorPatterns: ["basic_word_order", "verb_tense"], totalQuizzes: 6,  proactiveEnabled: true,  lastPushHoursAgo: 30, minIntervalHours: 8 },
  { learnerKey: "dung",  target: 7.5, current: 7.5, skillGaps: { listening: 0.2, reading: 0.2, writing: 0.3, speaking: 0.2 }, bestTime: "night",     avgSessionMin: 45, errorPatterns: ["complex_tense_slips"], totalQuizzes: 41, proactiveEnabled: false, lastPushHoursAgo: 72, minIntervalHours: 12 },
  { learnerKey: "giang", target: 6.0, current: 5.0, skillGaps: { listening: 0.5, reading: 0.6, writing: 0.7, speaking: 0.6 }, bestTime: "evening",   avgSessionMin: 22, errorPatterns: ["article_usage", "limited_vocabulary"], totalQuizzes: 9, proactiveEnabled: true,  lastPushHoursAgo: 14, minIntervalHours: 6 },
  { learnerKey: "ha",    target: 7.0, current: 6.5, skillGaps: { listening: 0.3, reading: 0.4, writing: 0.4, speaking: 0.5 }, bestTime: "morning",   avgSessionMin: 30, errorPatterns: ["relative_clauses"], totalQuizzes: 18, proactiveEnabled: true,  lastPushHoursAgo: 7,  minIntervalHours: 4 },
  { learnerKey: "lan",   target: 8.0, current: 7.5, skillGaps: { listening: 0.1, reading: 0.2, writing: 0.2, speaking: 0.1 }, bestTime: "night",     avgSessionMin: 50, errorPatterns: ["minor_collocation"], totalQuizzes: 53, proactiveEnabled: false, lastPushHoursAgo: 96, minIntervalHours: 12 },
  { learnerKey: "nam",   target: 6.0, current: 5.0, skillGaps: { listening: 0.5, reading: 0.5, writing: 0.6, speaking: 0.5 }, bestTime: "afternoon", avgSessionMin: 20, errorPatterns: ["verb_tense", "spelling"], totalQuizzes: 7, proactiveEnabled: true, lastPushHoursAgo: 40, minIntervalHours: 8 },
];

async function seedLearningProfiles() {
  for (const r of PROFILE_ROWS) {
    const data = {
      id: id("profile", r.learnerKey),
      userId: userId(r.learnerKey),
      bandScoreTarget: r.target,
      bandScoreCurrent: r.current,
      skillGaps: r.skillGaps,
      learningPersonality: {
        best_time: r.bestTime,
        avg_session_min: r.avgSessionMin,
        error_patterns: r.errorPatterns,
        total_quizzes: r.totalQuizzes,
      },
      advisorConfig: {
        proactive_enabled: r.proactiveEnabled,
        last_push_at: hoursAgo(r.lastPushHoursAgo).toISOString(),
        min_interval_hours: r.minIntervalHours,
      },
    };
    await prisma.userLearningProfile.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// IeltsKnowledgeBase — 8 chunks (embedding column left NULL / unmanaged)
// =============================================================================

interface KbRow {
  key: string;
  content: string;
  skill: "listening" | "reading" | "writing" | "speaking" | "general";
  bandRange: string;
  source: string;
  topic: string;
  tags: string[];
}

const KB_ROWS: KbRow[] = [
  {
    key: "kb-writing-coherence",
    content:
      "To achieve band 7 in Writing Task 2, organise your essay into clear paragraphs, each with a single central topic. Use a range of cohesive devices such as 'however', 'consequently' and 'in contrast' accurately, but avoid mechanical overuse. Examiners reward logical progression of ideas more than the sheer number of linking words.",
    skill: "writing",
    bandRange: "6.0-7.0",
    source: "IELTS.org band descriptors",
    topic: "coherence_and_cohesion",
    tags: ["task2", "cohesion", "paragraphing"],
  },
  {
    key: "kb-writing-lexical",
    content:
      "Band 8 candidates use a wide range of vocabulary fluently and flexibly, including less common lexical items and natural collocations such as 'a pressing concern' or 'far-reaching consequences'. Spelling and word formation errors are rare and do not impede communication.",
    skill: "writing",
    bandRange: "7.0-9.0",
    source: "IELTS.org band descriptors",
    topic: "lexical_resource",
    tags: ["task2", "vocabulary", "collocation"],
  },
  {
    key: "kb-speaking-fluency",
    content:
      "Fluency and coherence in the Speaking test means speaking at length without noticeable effort, even if there is some hesitation while searching for ideas. Self-correction is acceptable, but frequent long pauses lower the score. Practise extending answers by adding reasons and examples rather than giving one-word responses.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "IELTS.org band descriptors",
    topic: "fluency_and_coherence",
    tags: ["speaking", "fluency", "part2"],
  },
  {
    key: "kb-speaking-pronunciation",
    content:
      "Pronunciation is assessed on the use of stress, rhythm and intonation, not on having a particular accent. A band 7 speaker is generally easy to understand and uses a range of pronunciation features, with only occasional lapses. Practise sentence stress and connected speech to sound more natural.",
    skill: "speaking",
    bandRange: "6.0-7.0",
    source: "Cambridge IELTS 17",
    topic: "pronunciation",
    tags: ["speaking", "pronunciation", "intonation"],
  },
  {
    key: "kb-reading-tfng",
    content:
      "For True/False/Not Given questions, 'False' means the text directly contradicts the statement, while 'Not Given' means the information is simply absent. A common mistake is choosing 'False' when the text is merely silent on the point. Read carefully and base every answer strictly on what is written, not on outside knowledge.",
    skill: "reading",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 17",
    topic: "true_false_not_given",
    tags: ["reading", "tfng", "strategy"],
  },
  {
    key: "kb-reading-skimming",
    content:
      "Effective readers skim a passage first to grasp the main idea and overall structure before reading questions. Skimming should take about two minutes per passage. Then scan for keywords and synonyms to locate specific answers quickly. Managing time across all three passages is essential for a high reading band.",
    skill: "reading",
    bandRange: "6.0-7.0",
    source: "IELTS.org band descriptors",
    topic: "skimming_and_scanning",
    tags: ["reading", "time_management", "strategy"],
  },
  {
    key: "kb-listening-notes",
    content:
      "In note-completion tasks, read the instructions for the word limit and predict the type of word needed for each gap, such as a number, name or noun. Listen for paraphrases rather than the exact words on the question paper. Check spelling and singular/plural forms when transferring answers.",
    skill: "listening",
    bandRange: "5.0-6.0",
    source: "Cambridge IELTS 17",
    topic: "note_completion",
    tags: ["listening", "note_completion", "prediction"],
  },
  {
    key: "kb-general-bands",
    content:
      "The IELTS band scale runs from 0 to 9 in half-band increments. Each half-band represents a meaningful step in ability, so improving from 6.0 to 6.5 typically requires consistent practice across all four skills. Understanding the public band descriptors helps learners target the exact criteria examiners use.",
    skill: "general",
    bandRange: "4.0-9.0",
    source: "IELTS.org band descriptors",
    topic: "band_scale_overview",
    tags: ["general", "band_scale", "overview"],
  },
];

async function seedKnowledgeBase() {
  for (const r of KB_ROWS) {
    const data = {
      id: id("kb", r.key),
      content: r.content,
      skill: r.skill,
      bandRange: r.bandRange,
      source: r.source,
      metadata: { topic: r.topic, tags: r.tags },
    };
    await prisma.ieltsKnowledgeBase.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// AdvisorActionLog — 10 rows
// =============================================================================

interface AdvisorRow {
  key: string;
  learnerKey: string;
  actionType: "SHOW_BANNER" | "SUGGEST_COURSE" | "UNLOCK_TIP" | "SEND_REMINDER";
  payload: object;
  triggerReason: "quiz_failed" | "idle_4h" | "band_gap_detected" | "user_request";
  deliveredHoursAgo: number | null;
  acknowledgedHoursAgo: number | null;
  createdHoursAgo: number;
}

const ADVISOR_ROWS: AdvisorRow[] = [
  {
    key: "adv-an-1",
    learnerKey: "an",
    actionType: "SHOW_BANNER",
    payload: {
      message: "Bài viết gần đây của bạn cho thấy lỗi chia động từ. Hãy ôn lại phần Grammar Focus nhé!",
      evidence: { skill: "writing", recentBand: 6.0, targetBand: 6.5, errorPattern: "subject_verb_agreement" },
    },
    triggerReason: "band_gap_detected",
    deliveredHoursAgo: 5,
    acknowledgedHoursAgo: 4,
    createdHoursAgo: 5,
  },
  {
    key: "adv-an-2",
    learnerKey: "an",
    actionType: "SUGGEST_COURSE",
    payload: {
      message: "Để cải thiện kỹ năng phát âm, khoá American Pronunciation Pro rất phù hợp với bạn.",
      evidence: { skill: "speaking", gap: 0.5 },
      courseId: courseId("pronunciation-pro"),
    },
    triggerReason: "band_gap_detected",
    deliveredHoursAgo: 28,
    acknowledgedHoursAgo: null,
    createdHoursAgo: 28,
  },
  {
    key: "adv-binh-1",
    learnerKey: "binh",
    actionType: "SUGGEST_COURSE",
    payload: {
      message: "Bạn đang luyện TOEIC rất chăm chỉ. Khoá TOEIC 500 → 800 Bootcamp sẽ giúp bạn bứt phá!",
      evidence: { skill: "reading", currentScore: 780, targetScore: 800 },
      courseId: courseId("toeic-bootcamp"),
    },
    triggerReason: "user_request",
    deliveredHoursAgo: 12,
    acknowledgedHoursAgo: 11,
    createdHoursAgo: 12,
  },
  {
    key: "adv-binh-2",
    learnerKey: "binh",
    actionType: "UNLOCK_TIP",
    payload: {
      message: "Mẹo: Trong Part 7, hãy đọc câu hỏi trước khi đọc đoạn văn để tiết kiệm thời gian.",
      evidence: { skill: "reading", tipId: "toeic_part7_skim" },
    },
    triggerReason: "quiz_failed",
    deliveredHoursAgo: 50,
    acknowledgedHoursAgo: 49,
    createdHoursAgo: 50,
  },
  {
    key: "adv-dung-1",
    learnerKey: "dung",
    actionType: "SHOW_BANNER",
    payload: {
      message: "Tuyệt vời! Bạn đã đạt band mục tiêu 7.5. Hãy thử thách bản thân với mục tiêu cao hơn?",
      evidence: { skill: "overall", currentBand: 7.5, targetBand: 7.5 },
    },
    triggerReason: "band_gap_detected",
    deliveredHoursAgo: 20,
    acknowledgedHoursAgo: null,
    createdHoursAgo: 20,
  },
  {
    key: "adv-giang-1",
    learnerKey: "giang",
    actionType: "SEND_REMINDER",
    payload: {
      message: "Đã 4 giờ rồi bạn chưa luyện tập. Một bài quiz ngắn sẽ giúp duy trì phong độ!",
      evidence: { idleHours: 4, bandGap: 1.0 },
    },
    triggerReason: "idle_4h",
    deliveredHoursAgo: 14,
    acknowledgedHoursAgo: null,
    createdHoursAgo: 14,
  },
  {
    key: "adv-giang-2",
    learnerKey: "giang",
    actionType: "SUGGEST_COURSE",
    payload: {
      message: "Nền tảng ngữ pháp của bạn cần củng cố. Khoá IELTS Foundation 5.0 → 6.5 sẽ rất hữu ích.",
      evidence: { skill: "grammar", gap: 0.7 },
      courseId: courseId("ielts-foundation"),
    },
    triggerReason: "band_gap_detected",
    deliveredHoursAgo: 36,
    acknowledgedHoursAgo: 35,
    createdHoursAgo: 36,
  },
  {
    key: "adv-ha-1",
    learnerKey: "ha",
    actionType: "UNLOCK_TIP",
    payload: {
      message: "Mẹo viết email công sở: mở đầu rõ ràng, một ý chính mỗi đoạn, và kết thúc bằng lời kêu gọi hành động.",
      evidence: { skill: "writing", tipId: "business_email_structure" },
    },
    triggerReason: "user_request",
    deliveredHoursAgo: 7,
    acknowledgedHoursAgo: 6,
    createdHoursAgo: 7,
  },
  {
    key: "adv-nam-1",
    learnerKey: "nam",
    actionType: "SEND_REMINDER",
    payload: {
      message: "Bạn đã không học trong 9 ngày. Quay lại với một buổi luyện nghe TOEIC nhé!",
      evidence: { idleDays: 9, bandGap: 1.0 },
    },
    triggerReason: "idle_4h",
    deliveredHoursAgo: 40,
    acknowledgedHoursAgo: null,
    createdHoursAgo: 40,
  },
  {
    key: "adv-lan-1",
    learnerKey: "lan",
    actionType: "SHOW_BANNER",
    payload: {
      message: "Bạn chỉ còn 0.5 band nữa là đạt mục tiêu 8.0. Hãy tập trung vào độ chính xác ngữ pháp!",
      evidence: { skill: "grammar", currentBand: 7.5, targetBand: 8.0 },
    },
    triggerReason: "band_gap_detected",
    deliveredHoursAgo: 96,
    acknowledgedHoursAgo: 95,
    createdHoursAgo: 96,
  },
];

async function seedAdvisorActionLog() {
  for (const r of ADVISOR_ROWS) {
    const data = {
      id: id("advisor", r.key),
      userId: userId(r.learnerKey),
      actionType: r.actionType,
      payload: r.payload,
      triggerReason: r.triggerReason,
      deliveredAt: r.deliveredHoursAgo === null ? null : hoursAgo(r.deliveredHoursAgo),
      acknowledgedAt: r.acknowledgedHoursAgo === null ? null : hoursAgo(r.acknowledgedHoursAgo),
      createdAt: hoursAgo(r.createdHoursAgo),
    };
    await prisma.advisorActionLog.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  await seedSpeakingTopics();
  await seedWritingEvaluations();
  await seedSpeakingEvaluations();
  await seedSpeakingSessions();
  await seedSkillTrees();
  await seedMiniQuizzes();
  await seedLearningGoals();
  await seedLearningProfiles();
  await seedKnowledgeBase();
  await seedAdvisorActionLog();
}

main()
  .then(() => console.log("✓ ai-evaluation demo seed complete"))
  .catch((err) => {
    console.error("✗ ai-evaluation demo seed failed", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
