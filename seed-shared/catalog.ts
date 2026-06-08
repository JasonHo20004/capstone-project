// =============================================================================
// Demo Seed — Canonical Catalog (cross-service source of truth)
// -----------------------------------------------------------------------------
// Every entity here is referenced by MORE THAN ONE service database, so it must
// be defined exactly once and imported by each service's seed script. Anything
// that lives in only one service (notifications, evaluations, withdrawals, …)
// is defined locally in that service's seed-demo.ts, referencing the IDs here.
//
// All emails end in @demo.capstone.local and all rows derive their UUID from
// the deterministic registry in ./ids.ts, so the dataset is self-identifying
// and safe to upsert repeatedly.
// =============================================================================

import { userId, courseId, moduleId, lessonId, testId, orderId, couponId, planId, speakingTopicId, practiceSessionId, questionId } from "./ids.js";

// Shared demo password (plaintext). Identity seed hashes this with bcrypt.
export const DEMO_PASSWORD = "Demo@1234";
export const DEMO_EMAIL_DOMAIN = "demo.capstone.local";

// Fixed clock so the dataset is deterministic. Matches the project's "today".
export const NOW = new Date("2026-06-07T09:00:00.000Z");
export function daysAgo(n: number): Date {
  return new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);
}
export function hoursAgo(n: number): Date {
  return new Date(NOW.getTime() - n * 60 * 60 * 1000);
}
export function daysFromNow(n: number): Date {
  return new Date(NOW.getTime() + n * 24 * 60 * 60 * 1000);
}

export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ─── Users ─────────────────────────────────────────────────────────────────

export interface DemoUser {
  key: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth: string; // YYYY-MM-DD
  role: "ADMINISTRATOR" | "COURSESELLER" | null;
  englishLevel?: Cefr;
  learningGoals: string[];
  isEmailVerified: boolean;
  userStatus: "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
  suspendedUntil?: Date;
  statusReason?: string;
  xp: number;
  streak: number;
  lastActiveDaysAgo?: number;
}

const e = (local: string) => `${local}@${DEMO_EMAIL_DOMAIN}`;

export const ADMIN: DemoUser = {
  key: "admin",
  email: e("admin"),
  fullName: "Trần Quản Trị",
  phoneNumber: "+84900000001",
  dateOfBirth: "1988-04-12",
  role: "ADMINISTRATOR",
  learningGoals: [],
  isEmailVerified: true,
  userStatus: "ACTIVE",
  xp: 0,
  streak: 0,
  lastActiveDaysAgo: 0,
};

export const SELLERS: DemoUser[] = [
  {
    key: "seller-linh",
    email: e("linh.teacher"),
    fullName: "Nguyễn Mỹ Linh",
    phoneNumber: "+84900100001",
    dateOfBirth: "1991-07-22",
    role: "COURSESELLER",
    englishLevel: "C2",
    learningGoals: [],
    isEmailVerified: true,
    userStatus: "ACTIVE",
    xp: 0,
    streak: 0,
    lastActiveDaysAgo: 1,
  },
  {
    key: "seller-minh",
    email: e("minh.ielts"),
    fullName: "Lê Quang Minh",
    phoneNumber: "+84900100002",
    dateOfBirth: "1986-11-03",
    role: "COURSESELLER",
    englishLevel: "C1",
    learningGoals: [],
    isEmailVerified: true,
    userStatus: "ACTIVE",
    xp: 0,
    streak: 0,
    lastActiveDaysAgo: 2,
  },
  {
    key: "seller-trang",
    email: e("trang.business"),
    fullName: "Phạm Thu Trang",
    phoneNumber: "+84900100003",
    dateOfBirth: "1993-02-18",
    role: "COURSESELLER",
    englishLevel: "C1",
    learningGoals: [],
    isEmailVerified: true,
    userStatus: "ACTIVE",
    xp: 0,
    streak: 0,
    lastActiveDaysAgo: 5,
  },
];

// Applicants — users who applied to become sellers but are NOT yet active.
export const APPLICANTS: DemoUser[] = [
  {
    key: "applicant-hung",
    email: e("hung.applicant"),
    fullName: "Đỗ Mạnh Hùng",
    phoneNumber: "+84900100004",
    dateOfBirth: "1990-09-09",
    role: null,
    englishLevel: "C1",
    learningGoals: ["Become a course seller"],
    isEmailVerified: true,
    userStatus: "ACTIVE",
    xp: 0,
    streak: 0,
    lastActiveDaysAgo: 1,
  },
  {
    key: "applicant-mai",
    email: e("mai.applicant"),
    fullName: "Vũ Tuyết Mai",
    phoneNumber: "+84900100005",
    dateOfBirth: "1995-05-30",
    role: null,
    englishLevel: "B2",
    learningGoals: ["Become a course seller"],
    isEmailVerified: true,
    userStatus: "ACTIVE",
    xp: 0,
    streak: 0,
    lastActiveDaysAgo: 12,
  },
];

export const LEARNERS: DemoUser[] = [
  { key: "an",    email: e("an.nguyen"),   fullName: "Nguyễn Văn An",   phoneNumber: "+84901000001", dateOfBirth: "2002-01-15", role: null, englishLevel: "B1", learningGoals: ["IELTS 6.5", "Study abroad"],          isEmailVerified: true,  userStatus: "ACTIVE",    xp: 4820, streak: 23, lastActiveDaysAgo: 0 },
  { key: "binh",  email: e("binh.tran"),   fullName: "Trần Thị Bình",   phoneNumber: "+84901000002", dateOfBirth: "2000-06-08", role: null, englishLevel: "B2", learningGoals: ["TOEIC 800", "Career"],                isEmailVerified: true,  userStatus: "ACTIVE",    xp: 9120, streak: 47, lastActiveDaysAgo: 0 },
  { key: "chi",   email: e("chi.le"),      fullName: "Lê Linh Chi",     phoneNumber: "+84901000003", dateOfBirth: "2003-03-21", role: null, englishLevel: "A2", learningGoals: ["Daily conversation"],                 isEmailVerified: true,  userStatus: "ACTIVE",    xp: 1340, streak: 6,  lastActiveDaysAgo: 1 },
  { key: "dung",  email: e("dung.pham"),   fullName: "Phạm Tiến Dũng",  phoneNumber: "+84901000004", dateOfBirth: "1998-12-02", role: null, englishLevel: "C1", learningGoals: ["IELTS 7.5", "Academic writing"],     isEmailVerified: true,  userStatus: "ACTIVE",    xp: 15670, streak: 88, lastActiveDaysAgo: 0 },
  { key: "giang", email: e("giang.hoang"), fullName: "Hoàng Thu Giang", phoneNumber: "+84901000005", dateOfBirth: "2001-08-19", role: null, englishLevel: "B1", learningGoals: ["IELTS 6.0"],                          isEmailVerified: true,  userStatus: "ACTIVE",    xp: 3210, streak: 11, lastActiveDaysAgo: 2 },
  { key: "ha",    email: e("ha.vo"),       fullName: "Võ Ngọc Hà",      phoneNumber: "+84901000006", dateOfBirth: "1999-04-27", role: null, englishLevel: "B2", learningGoals: ["Business English"],                   isEmailVerified: true,  userStatus: "ACTIVE",    xp: 6450, streak: 31, lastActiveDaysAgo: 1 },
  { key: "khanh", email: e("khanh.dang"),  fullName: "Đặng Gia Khánh",  phoneNumber: "+84901000007", dateOfBirth: "2004-10-11", role: null, englishLevel: "A1", learningGoals: ["Beginner foundation"],                isEmailVerified: true,  userStatus: "ACTIVE",    xp: 540,  streak: 3,  lastActiveDaysAgo: 3 },
  { key: "lan",   email: e("lan.bui"),     fullName: "Bùi Phương Lan",  phoneNumber: "+84901000008", dateOfBirth: "1997-07-07", role: null, englishLevel: "C1", learningGoals: ["IELTS 8.0", "PhD application"],        isEmailVerified: true,  userStatus: "ACTIVE",    xp: 18900, streak: 102, lastActiveDaysAgo: 0 },
  { key: "nam",   email: e("nam.do"),      fullName: "Đỗ Hoài Nam",     phoneNumber: "+84901000009", dateOfBirth: "2002-02-14", role: null, englishLevel: "B1", learningGoals: ["TOEIC 700"],                          isEmailVerified: true,  userStatus: "ACTIVE",    xp: 2780, streak: 0,  lastActiveDaysAgo: 9 },
  { key: "phuc",  email: e("phuc.ngo"),    fullName: "Ngô Minh Phúc",   phoneNumber: "+84901000010", dateOfBirth: "2005-09-25", role: null, englishLevel: "A2", learningGoals: ["School English"],                     isEmailVerified: false, userStatus: "ACTIVE",    xp: 120,  streak: 1,  lastActiveDaysAgo: 4 },
  { key: "quan",  email: e("quan.spam"),   fullName: "Lý Trọng Quân",   phoneNumber: "+84901000011", dateOfBirth: "1996-03-03", role: null, englishLevel: "B1", learningGoals: [],                                     isEmailVerified: true,  userStatus: "SUSPENDED", suspendedUntil: undefined, statusReason: "Đăng bình luận spam nhiều lần trong phần thảo luận.", xp: 880, streak: 0, lastActiveDaysAgo: 20 },
  { key: "tu",    email: e("tu.banned"),   fullName: "Mai Anh Tú",      phoneNumber: "+84901000012", dateOfBirth: "1994-12-19", role: null, englishLevel: "B2", learningGoals: [],                                     isEmailVerified: true,  userStatus: "BANNED",    statusReason: "Gian lận thanh toán và lạm dụng hoàn tiền.", xp: 2010, streak: 0, lastActiveDaysAgo: 45 },
];

export const ALL_USERS: DemoUser[] = [ADMIN, ...SELLERS, ...APPLICANTS, ...LEARNERS];

// Quick membership helpers
export const LEARNER_KEYS = LEARNERS.map((u) => u.key);
export const SELLER_KEYS = SELLERS.map((u) => u.key);

// ─── Seller applications (approval workflow) ─────────────────────────────────

export interface DemoApplication {
  key: string;
  userKey: string;
  certification: string[];
  expertise: string[];
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  approvedByKey?: string;
  approvedDaysAgo?: number;
  createdDaysAgo: number;
}

export const APPLICATIONS: DemoApplication[] = [
  { key: "app-linh",  userKey: "seller-linh",  certification: ["CELTA", "IELTS 8.5"],            expertise: ["IELTS", "Grammar"],         message: "10 năm kinh nghiệm luyện thi IELTS.",      status: "APPROVED", approvedByKey: "admin", approvedDaysAgo: 180, createdDaysAgo: 190 },
  { key: "app-minh",  userKey: "seller-minh",  certification: ["TESOL", "IELTS 8.0"],            expertise: ["IELTS", "Listening"],       message: "Cựu giám khảo IELTS.",                     status: "APPROVED", approvedByKey: "admin", approvedDaysAgo: 150, createdDaysAgo: 160 },
  { key: "app-trang", userKey: "seller-trang", certification: ["MBA", "TOEIC 990"],              expertise: ["Business English", "TOEIC"], message: "Chuyên tiếng Anh thương mại.",            status: "APPROVED", approvedByKey: "admin", approvedDaysAgo: 95,  createdDaysAgo: 100 },
  { key: "app-hung",  userKey: "applicant-hung", certification: ["TESOL"],                       expertise: ["Speaking", "Pronunciation"], message: "Muốn mở khoá luyện phát âm.",            status: "PENDING",  createdDaysAgo: 4 },
  { key: "app-mai",   userKey: "applicant-mai",  certification: [],                              expertise: ["Grammar"],                  message: "Tôi muốn dạy ngữ pháp.",                   status: "REJECTED", rejectionReason: "Chưa cung cấp chứng chỉ giảng dạy hợp lệ.", approvedByKey: "admin", approvedDaysAgo: 10, createdDaysAgo: 12 },
];

// ─── Tests (assessment) — referenced by course lessons & finalTestId ─────────

export interface DemoTest {
  key: string;
  title: string;
  slug: string;
  type: "IELTS" | "TOEIC"; // maps to EnglishTestType
  status: "PUBLISHED" | "DRAFT";
  durationInMinutes: number;
  totalScore: number;
  passingScore: number;
  maxAttempts: number;
  sellerKey: string;
  skills: ("READING" | "LISTENING" | "WRITING" | "SPEAKING")[];
  practiceCount: number;
  detailed: boolean; // whether this test gets full sections/passages/questions seeded
}

export const TESTS: DemoTest[] = [
  { key: "ielts-reading-1",  title: "IELTS Academic Reading — Practice Set 1", slug: "ielts-academic-reading-practice-1", type: "IELTS", status: "PUBLISHED", durationInMinutes: 60, totalScore: 9,   passingScore: 6.5, maxAttempts: 3, sellerKey: "seller-minh",  skills: ["READING"],            practiceCount: 412, detailed: true },
  { key: "ielts-listening-1",title: "IELTS Listening — Practice Set 1",        slug: "ielts-listening-practice-1",        type: "IELTS", status: "PUBLISHED", durationInMinutes: 40, totalScore: 9,   passingScore: 6.0, maxAttempts: 3, sellerKey: "seller-minh",  skills: ["LISTENING"],          practiceCount: 388, detailed: true },
  { key: "toeic-mini",       title: "TOEIC Mini Test — Listening & Reading",   slug: "toeic-mini-listening-reading",      type: "TOEIC", status: "PUBLISHED", durationInMinutes: 45, totalScore: 990, passingScore: 600, maxAttempts: 5, sellerKey: "seller-trang", skills: ["LISTENING", "READING"], practiceCount: 651, detailed: true },
  { key: "toeic-full-1",     title: "TOEIC Full Test 1",                       slug: "toeic-full-test-1",                 type: "TOEIC", status: "PUBLISHED", durationInMinutes: 120, totalScore: 990, passingScore: 650, maxAttempts: 3, sellerKey: "seller-trang", skills: ["LISTENING", "READING"], practiceCount: 230, detailed: false },
  { key: "grammar-quiz-1",   title: "Grammar Checkpoint — Tenses",             slug: "grammar-checkpoint-tenses",         type: "IELTS", status: "PUBLISHED", durationInMinutes: 15, totalScore: 10,  passingScore: 7,   maxAttempts: 10, sellerKey: "seller-linh", skills: ["READING"],            practiceCount: 540, detailed: false },
  { key: "business-final",   title: "Business English — Final Assessment",     slug: "business-english-final",            type: "TOEIC", status: "PUBLISHED", durationInMinutes: 50, totalScore: 100, passingScore: 70,  maxAttempts: 2, sellerKey: "seller-trang", skills: ["READING", "WRITING"], practiceCount: 88,  detailed: false },
];

// ─── Courses (course) — with modules & lessons ───────────────────────────────

export interface DemoLesson {
  key: string;
  title: string;
  durationInSeconds: number;
  testKey?: string; // quiz lesson → assessment Test
}
export interface DemoModule {
  key: string;
  title: string;
  lessons: DemoLesson[];
}
export interface DemoCourse {
  key: string;
  title: string;
  description: string;
  price: number;
  level: Cefr;
  category: string;
  sellerKey: string;
  status: "DRAFT" | "PENDING" | "ACTIVE" | "REFUSE" | "INACTIVE";
  ratingCount: number;
  finalTestKey?: string;
  rejectionReason?: string;
  modules: DemoModule[];
}

export const COURSES: DemoCourse[] = [
  {
    key: "ielts-foundation", title: "IELTS Foundation 5.0 → 6.5", price: 1290000, level: "B1", category: "IELTS", sellerKey: "seller-minh", status: "ACTIVE", ratingCount: 0, finalTestKey: "ielts-reading-1",
    description: "Lộ trình nền tảng đưa band điểm IELTS của bạn từ 5.0 lên 6.5 qua 4 kỹ năng.",
    modules: [
      { key: "if-m1", title: "Reading Strategies", lessons: [
        { key: "if-l1", title: "Skimming & Scanning", durationInSeconds: 845 },
        { key: "if-l2", title: "True/False/Not Given", durationInSeconds: 1020 },
        { key: "if-l3", title: "Reading Practice Quiz", durationInSeconds: 0, testKey: "ielts-reading-1" },
      ]},
      { key: "if-m2", title: "Listening Strategies", lessons: [
        { key: "if-l4", title: "Note Completion", durationInSeconds: 760 },
        { key: "if-l5", title: "Map & Diagram Labelling", durationInSeconds: 910 },
      ]},
    ],
  },
  {
    key: "ielts-advanced", title: "IELTS Advanced Writing 7.0+", price: 1890000, level: "C1", category: "IELTS", sellerKey: "seller-minh", status: "ACTIVE", ratingCount: 0,
    description: "Chuyên sâu Writing Task 1 & 2 cho band 7.0 trở lên, kèm chữa bài chi tiết.",
    modules: [
      { key: "ia-m1", title: "Task 1 — Data", lessons: [
        { key: "ia-l1", title: "Describing Trends", durationInSeconds: 1180 },
        { key: "ia-l2", title: "Process Diagrams", durationInSeconds: 990 },
      ]},
      { key: "ia-m2", title: "Task 2 — Essays", lessons: [
        { key: "ia-l3", title: "Argument Essays", durationInSeconds: 1340 },
        { key: "ia-l4", title: "Coherence & Cohesion", durationInSeconds: 1100 },
      ]},
    ],
  },
  {
    key: "toeic-bootcamp", title: "TOEIC 500 → 800 Bootcamp", price: 990000, level: "B2", category: "TOEIC", sellerKey: "seller-trang", status: "ACTIVE", ratingCount: 0, finalTestKey: "toeic-full-1",
    description: "Tăng tốc TOEIC từ 500 lên 800 trong 8 tuần với chiến thuật làm bài và ngân hàng đề.",
    modules: [
      { key: "tb-m1", title: "Listening Parts 1–4", lessons: [
        { key: "tb-l1", title: "Photographs (Part 1)", durationInSeconds: 680 },
        { key: "tb-l2", title: "Conversations (Part 3)", durationInSeconds: 1240 },
        { key: "tb-l3", title: "Mini Test", durationInSeconds: 0, testKey: "toeic-mini" },
      ]},
      { key: "tb-m2", title: "Reading Parts 5–7", lessons: [
        { key: "tb-l4", title: "Incomplete Sentences (Part 5)", durationInSeconds: 920 },
        { key: "tb-l5", title: "Reading Comprehension (Part 7)", durationInSeconds: 1410 },
      ]},
    ],
  },
  {
    key: "grammar-essentials", title: "English Grammar Essentials", price: 0, level: "A2", category: "Grammar", sellerKey: "seller-linh", status: "ACTIVE", ratingCount: 0,
    description: "Khoá ngữ pháp miễn phí bao quát toàn bộ thì và cấu trúc câu cơ bản.",
    modules: [
      { key: "ge-m1", title: "Verb Tenses", lessons: [
        { key: "ge-l1", title: "Present Tenses", durationInSeconds: 720 },
        { key: "ge-l2", title: "Past Tenses", durationInSeconds: 690 },
        { key: "ge-l3", title: "Tenses Checkpoint", durationInSeconds: 0, testKey: "grammar-quiz-1" },
      ]},
      { key: "ge-m2", title: "Sentence Structure", lessons: [
        { key: "ge-l4", title: "Clauses", durationInSeconds: 810 },
      ]},
    ],
  },
  {
    key: "business-english", title: "Business English for Professionals", price: 1490000, level: "B2", category: "Business English", sellerKey: "seller-trang", status: "ACTIVE", ratingCount: 0, finalTestKey: "business-final",
    description: "Email, họp hành, thuyết trình và đàm phán bằng tiếng Anh cho môi trường công sở.",
    modules: [
      { key: "be-m1", title: "Professional Communication", lessons: [
        { key: "be-l1", title: "Writing Effective Emails", durationInSeconds: 980 },
        { key: "be-l2", title: "Meeting Language", durationInSeconds: 1060 },
      ]},
      { key: "be-m2", title: "Presentations", lessons: [
        { key: "be-l3", title: "Structuring a Pitch", durationInSeconds: 1150 },
      ]},
    ],
  },
  {
    key: "pronunciation-pro", title: "American Pronunciation Pro", price: 790000, level: "B1", category: "Pronunciation", sellerKey: "seller-linh", status: "ACTIVE", ratingCount: 0,
    description: "Luyện âm Mỹ chuẩn: nguyên âm, phụ âm, trọng âm và ngữ điệu.",
    modules: [
      { key: "pp-m1", title: "Sounds", lessons: [
        { key: "pp-l1", title: "Vowel Sounds", durationInSeconds: 640 },
        { key: "pp-l2", title: "Consonant Clusters", durationInSeconds: 705 },
      ]},
    ],
  },
  // PENDING — sitting in the admin review queue
  {
    key: "speaking-confidence", title: "Speaking Confidence in 30 Days", price: 690000, level: "B1", category: "Speaking", sellerKey: "seller-linh", status: "PENDING", ratingCount: 0,
    description: "Vượt qua nỗi sợ nói tiếng Anh với 30 ngày luyện tập có hướng dẫn.",
    modules: [
      { key: "sc-m1", title: "Warm Up", lessons: [ { key: "sc-l1", title: "Daily Routines", durationInSeconds: 540 } ]},
    ],
  },
  {
    key: "toeic-listening-drills", title: "TOEIC Listening Drills", price: 590000, level: "B1", category: "TOEIC", sellerKey: "seller-trang", status: "PENDING", ratingCount: 0,
    description: "Hàng trăm bài luyện nghe TOEIC theo từng Part.",
    modules: [
      { key: "tld-m1", title: "Part 2 Drills", lessons: [ { key: "tld-l1", title: "Question-Response", durationInSeconds: 600 } ]},
    ],
  },
  // REFUSE — rejected by admin
  {
    key: "ielts-hacks", title: "IELTS 9.0 Guaranteed Hacks", price: 2990000, level: "C2", category: "IELTS", sellerKey: "seller-minh", status: "REFUSE", ratingCount: 0,
    rejectionReason: "Tiêu đề cam kết điểm số phi thực tế và nội dung mỏng, vi phạm chính sách nội dung.",
    description: "Mẹo đạt 9.0 đảm bảo.",
    modules: [
      { key: "ih-m1", title: "Hacks", lessons: [ { key: "ih-l1", title: "Secret Tricks", durationInSeconds: 300 } ]},
    ],
  },
  // DRAFT — not yet submitted
  {
    key: "kids-english", title: "Fun English for Kids", price: 490000, level: "A1", category: "Kids", sellerKey: "seller-linh", status: "DRAFT", ratingCount: 0,
    description: "Tiếng Anh vui nhộn cho trẻ 6–10 tuổi qua bài hát và trò chơi.",
    modules: [
      { key: "ke-m1", title: "Animals", lessons: [ { key: "ke-l1", title: "Farm Animals", durationInSeconds: 420 } ]},
    ],
  },
  {
    key: "academic-vocab", title: "Academic Vocabulary Builder", price: 890000, level: "C1", category: "Vocabulary", sellerKey: "seller-minh", status: "DRAFT", ratingCount: 0,
    description: "Xây dựng vốn từ học thuật cho IELTS và môi trường đại học.",
    modules: [
      { key: "av-m1", title: "AWL", lessons: [ { key: "av-l1", title: "Sublist 1", durationInSeconds: 880 } ]},
    ],
  },
  // INACTIVE — was active, taken down
  {
    key: "legacy-toeic", title: "TOEIC Classic (2019 Edition)", price: 390000, level: "B1", category: "TOEIC", sellerKey: "seller-trang", status: "INACTIVE", ratingCount: 0,
    description: "Phiên bản cũ, đã ngừng cập nhật.",
    modules: [
      { key: "lt-m1", title: "Intro", lessons: [ { key: "lt-l1", title: "Overview", durationInSeconds: 500 } ]},
    ],
  },
];

export const ACTIVE_COURSE_KEYS = COURSES.filter((c) => c.status === "ACTIVE").map((c) => c.key);

// ─── Enrollments (drive payment orders ↔ course activities ↔ earnings) ───────

export interface DemoEnrollment {
  key: string;          // also the order key
  learnerKey: string;
  courseKey: string;
  daysAgo: number;
  couponKey?: string;   // if a coupon was applied at checkout
}

// ~30 enrollments across the 6 ACTIVE courses. Free course (grammar-essentials)
// still produces a zero-amount order so the "my courses" flow is consistent.
export const ENROLLMENTS: DemoEnrollment[] = [
  { key: "ord-an-ielts-f",   learnerKey: "an",    courseKey: "ielts-foundation",  daysAgo: 40, couponKey: "welcome10" },
  { key: "ord-an-grammar",   learnerKey: "an",    courseKey: "grammar-essentials",daysAgo: 41 },
  { key: "ord-an-pron",      learnerKey: "an",    courseKey: "pronunciation-pro", daysAgo: 15 },
  { key: "ord-binh-toeic",   learnerKey: "binh",  courseKey: "toeic-bootcamp",    daysAgo: 60, couponKey: "flash50k" },
  { key: "ord-binh-biz",     learnerKey: "binh",  courseKey: "business-english",  daysAgo: 22 },
  { key: "ord-binh-grammar", learnerKey: "binh",  courseKey: "grammar-essentials",daysAgo: 61 },
  { key: "ord-chi-grammar",  learnerKey: "chi",   courseKey: "grammar-essentials",daysAgo: 30 },
  { key: "ord-chi-pron",     learnerKey: "chi",   courseKey: "pronunciation-pro", daysAgo: 12 },
  { key: "ord-dung-ielts-a", learnerKey: "dung",  courseKey: "ielts-advanced",    daysAgo: 35, couponKey: "ielts20" },
  { key: "ord-dung-ielts-f", learnerKey: "dung",  courseKey: "ielts-foundation",  daysAgo: 50 },
  { key: "ord-dung-biz",     learnerKey: "dung",  courseKey: "business-english",  daysAgo: 8 },
  { key: "ord-giang-ielts-f",learnerKey: "giang", courseKey: "ielts-foundation",  daysAgo: 18 },
  { key: "ord-giang-grammar",learnerKey: "giang", courseKey: "grammar-essentials",daysAgo: 19 },
  { key: "ord-ha-biz",       learnerKey: "ha",    courseKey: "business-english",  daysAgo: 25, couponKey: "welcome10" },
  { key: "ord-ha-toeic",     learnerKey: "ha",    courseKey: "toeic-bootcamp",    daysAgo: 26 },
  { key: "ord-khanh-grammar",learnerKey: "khanh", courseKey: "grammar-essentials",daysAgo: 5 },
  { key: "ord-lan-ielts-a",  learnerKey: "lan",   courseKey: "ielts-advanced",    daysAgo: 70 },
  { key: "ord-lan-ielts-f",  learnerKey: "lan",   courseKey: "ielts-foundation",  daysAgo: 75 },
  { key: "ord-lan-pron",     learnerKey: "lan",   courseKey: "pronunciation-pro", daysAgo: 33 },
  { key: "ord-nam-toeic",    learnerKey: "nam",   courseKey: "toeic-bootcamp",    daysAgo: 14, couponKey: "flash50k" },
  { key: "ord-phuc-grammar", learnerKey: "phuc",  courseKey: "grammar-essentials",daysAgo: 4 },
  { key: "ord-ha-pron",      learnerKey: "ha",    courseKey: "pronunciation-pro", daysAgo: 3 },
  { key: "ord-giang-pron",   learnerKey: "giang", courseKey: "pronunciation-pro", daysAgo: 2 },
  { key: "ord-binh-ielts-f", learnerKey: "binh",  courseKey: "ielts-foundation",  daysAgo: 1 },
  { key: "ord-dung-toeic",   learnerKey: "dung",  courseKey: "toeic-bootcamp",    daysAgo: 6 },
];

// ─── Coupons (payment) ───────────────────────────────────────────────────────

export interface DemoCoupon {
  key: string;
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;   // percent (0-100) or VND amount
  maxDiscount?: number;
  minOrderAmount: number;
  maxRedemptions?: number;
  maxPerUser?: number;
  startsDaysAgo: number;
  expiresDaysFromNow: number; // negative = already expired
  isActive: boolean;
}

export const COUPONS: DemoCoupon[] = [
  { key: "welcome10", code: "WELCOME10", description: "Giảm 10% cho học viên mới (tối đa 200k).", discountType: "PERCENT", discountValue: 10, maxDiscount: 200000, minOrderAmount: 0,      maxRedemptions: 1000, maxPerUser: 1, startsDaysAgo: 120, expiresDaysFromNow: 60,  isActive: true },
  { key: "flash50k",  code: "FLASH50K",  description: "Giảm ngay 50.000đ cho đơn từ 500k.",       discountType: "FIXED",   discountValue: 50000,             minOrderAmount: 500000, maxRedemptions: 500,  maxPerUser: 2, startsDaysAgo: 30,  expiresDaysFromNow: 14,  isActive: true },
  { key: "ielts20",   code: "IELTS20",   description: "Ưu đãi 20% các khoá IELTS.",               discountType: "PERCENT", discountValue: 20, maxDiscount: 400000, minOrderAmount: 1000000,maxRedemptions: 200,  maxPerUser: 1, startsDaysAgo: 45,  expiresDaysFromNow: 30,  isActive: true },
  { key: "summer2025",code: "SUMMER2025",description: "Khuyến mãi hè (đã hết hạn).",               discountType: "PERCENT", discountValue: 25, maxDiscount: 500000, minOrderAmount: 0,      maxRedemptions: 1000, maxPerUser: 1, startsDaysAgo: 320, expiresDaysFromNow: -200, isActive: false },
  { key: "vip500k",   code: "VIP500K",   description: "Voucher VIP 500k (tạm dừng).",             discountType: "FIXED",   discountValue: 500000,            minOrderAmount: 2000000,maxRedemptions: 50,   maxPerUser: 1, startsDaysAgo: 20,  expiresDaysFromNow: 90,  isActive: false },
];

export const COUPON_BY_KEY: Record<string, DemoCoupon> = Object.fromEntries(COUPONS.map((c) => [c.key, c]));

// Compute the discount a coupon applies to a given subtotal (VND).
export function computeDiscount(coupon: DemoCoupon, subtotal: number): number {
  if (subtotal < coupon.minOrderAmount) return 0;
  let d = coupon.discountType === "PERCENT" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount != null) d = Math.min(d, coupon.maxDiscount);
  return Math.min(Math.round(d), subtotal);
}

// ─── Subscription plans (payment) ────────────────────────────────────────────

export const PLANS = [
  { key: "free", name: "Free", type: "FREE" as const, price: 0,      description: "Truy cập cơ bản miễn phí.",        features: ["flashcards_basic", "placement_test", "community_discussion"] },
  { key: "pro",  name: "Pro",  type: "PRO" as const,  price: 199000, description: "Mở khoá AI chấm bài & không giới hạn.", features: ["flashcards_basic", "placement_test", "community_discussion", "ai_writing_eval", "ai_speaking_eval", "unlimited_practice", "ai_tutor"] },
];

// Learners currently on PRO (active subscription); one expired.
export const PRO_SUBSCRIBERS: { learnerKey: string; startedDaysAgo: number; durationDays: number }[] = [
  { learnerKey: "dung", startedDaysAgo: 40, durationDays: 365 },
  { learnerKey: "lan",  startedDaysAgo: 20, durationDays: 30 },
  { learnerKey: "binh", startedDaysAgo: 90, durationDays: 30 }, // expired (90 > 30)
  { learnerKey: "an",   startedDaysAgo: 10, durationDays: 30 },
];

// ─── Speaking topics (ai-evaluation) ─────────────────────────────────────────

export const SPEAKING_TOPICS = [
  { key: "topic-hometown", title: "Hometown & Living Place", isPremium: false },
  { key: "topic-work",     title: "Work & Study",            isPremium: false },
  { key: "topic-tech",     title: "Technology & Social Media",isPremium: true },
  { key: "topic-env",      title: "Environment & Climate",   isPremium: true },
];

// ─── Practice sessions (assessment) — referenced by ai-eval evaluations ──────
// Defined here so assessment (owner) and ai-evaluation (consumer via sessionId)
// agree on the same UUIDs.

export interface DemoPracticeSession {
  key: string;
  learnerKey: string;
  testKey: string;
  status: "COMPLETED" | "ONGOING";
  daysAgo: number;
  overallScaledScore?: number; // band (IELTS) or scaled (TOEIC)
}

export const PRACTICE_SESSIONS: DemoPracticeSession[] = [
  { key: "ps-an-reading",    learnerKey: "an",    testKey: "ielts-reading-1",   status: "COMPLETED", daysAgo: 12, overallScaledScore: 6.0 },
  { key: "ps-an-listening",  learnerKey: "an",    testKey: "ielts-listening-1", status: "COMPLETED", daysAgo: 7,  overallScaledScore: 6.5 },
  { key: "ps-dung-reading",  learnerKey: "dung",  testKey: "ielts-reading-1",   status: "COMPLETED", daysAgo: 20, overallScaledScore: 7.5 },
  { key: "ps-dung-listening",learnerKey: "dung",  testKey: "ielts-listening-1", status: "COMPLETED", daysAgo: 5,  overallScaledScore: 8.0 },
  { key: "ps-lan-reading",   learnerKey: "lan",   testKey: "ielts-reading-1",   status: "COMPLETED", daysAgo: 30, overallScaledScore: 8.0 },
  { key: "ps-binh-toeic",    learnerKey: "binh",  testKey: "toeic-mini",        status: "COMPLETED", daysAgo: 10, overallScaledScore: 780 },
  { key: "ps-nam-toeic",     learnerKey: "nam",   testKey: "toeic-mini",        status: "COMPLETED", daysAgo: 8,  overallScaledScore: 640 },
  { key: "ps-ha-toeic",      learnerKey: "ha",    testKey: "toeic-mini",        status: "COMPLETED", daysAgo: 4,  overallScaledScore: 710 },
  { key: "ps-giang-reading", learnerKey: "giang", testKey: "ielts-reading-1",   status: "ONGOING",   daysAgo: 1 },
  { key: "ps-chi-grammar",   learnerKey: "chi",   testKey: "grammar-quiz-1",    status: "COMPLETED", daysAgo: 3,  overallScaledScore: 8 },
  { key: "ps-an-grammar",    learnerKey: "an",    testKey: "grammar-quiz-1",    status: "COMPLETED", daysAgo: 13, overallScaledScore: 9 },
  { key: "ps-binh-reading",  learnerKey: "binh",  testKey: "ielts-reading-1",   status: "ONGOING",   daysAgo: 0 },
];

// Resolve helpers (key → UUID) — re-exported for convenience in seed scripts.
export const idFor = {
  user: userId,
  course: courseId,
  module: moduleId,
  lesson: lessonId,
  test: testId,
  order: orderId,
  coupon: couponId,
  plan: planId,
  speakingTopic: speakingTopicId,
  practiceSession: practiceSessionId,
  question: questionId,
};
