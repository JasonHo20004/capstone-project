// =============================================================================
// Seed Dictation Exercises
// Usage: npx tsx prisma/seed-dictation.ts
// =============================================================================

import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// ─── Sample Exercise Data ────────────────────────────────────────────────────
// This is a DEMO exercise with fake timestamps.
// In production, use the Whisper Colab notebook to generate real timestamps.

const SAMPLE_EXERCISES = [
  {
    title: "Cam20 - Test 1 - Part 1",
    description: "Restaurant Recommendations for Celebrations",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // placeholder
    level: "B2",
    category: "Cambridge 20",
    sentences: [
      { index: 0, text: "Good morning, can I help you with anything?", startTime: 0.0, endTime: 3.2 },
      { index: 1, text: "Yes, I'm looking for some restaurant recommendations.", startTime: 3.2, endTime: 6.5 },
      { index: 2, text: "Of course. What kind of food are you interested in?", startTime: 6.5, endTime: 9.8 },
      { index: 3, text: "Well, we're celebrating my wife's birthday next week.", startTime: 9.8, endTime: 13.1 },
      { index: 4, text: "That sounds lovely. How many guests are you expecting?", startTime: 13.1, endTime: 16.4 },
      { index: 5, text: "There will be about twelve of us altogether.", startTime: 16.4, endTime: 19.0 },
      { index: 6, text: "I'd recommend The Golden Palace for large groups.", startTime: 19.0, endTime: 22.3 },
      { index: 7, text: "They have a private dining room that's very popular.", startTime: 22.3, endTime: 25.6 },
      { index: 8, text: "That sounds perfect. What type of cuisine do they serve?", startTime: 25.6, endTime: 29.0 },
      { index: 9, text: "They specialize in modern European food with Asian influences.", startTime: 29.0, endTime: 33.5 },
    ],
  },
  {
    title: "Cam20 - Test 1 - Part 2",
    description: "New Employee Orientation",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // placeholder
    level: "B2",
    category: "Cambridge 20",
    sentences: [
      { index: 0, text: "Welcome to the company orientation session.", startTime: 0.0, endTime: 3.0 },
      { index: 1, text: "My name is Sarah and I'll be your guide today.", startTime: 3.0, endTime: 6.2 },
      { index: 2, text: "First, let me tell you about the building layout.", startTime: 6.2, endTime: 9.5 },
      { index: 3, text: "The cafeteria is located on the ground floor.", startTime: 9.5, endTime: 12.5 },
      { index: 4, text: "It's open from seven thirty in the morning until six pm.", startTime: 12.5, endTime: 16.0 },
      { index: 5, text: "The gym facilities are available to all staff members.", startTime: 16.0, endTime: 19.5 },
      { index: 6, text: "You'll need your employee card to access the building.", startTime: 19.5, endTime: 23.0 },
      { index: 7, text: "Please make sure to wear your ID badge at all times.", startTime: 23.0, endTime: 26.5 },
    ],
  },
  {
    title: "Cam19 - Test 1 - Part 1",
    description: "Library Membership Inquiry",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // placeholder
    level: "B1",
    category: "Cambridge 19",
    sentences: [
      { index: 0, text: "Hello, I'd like to join the library please.", startTime: 0.0, endTime: 2.8 },
      { index: 1, text: "Certainly. I'll just need some details from you.", startTime: 2.8, endTime: 5.5 },
      { index: 2, text: "Could you tell me your full name?", startTime: 5.5, endTime: 7.8 },
      { index: 3, text: "It's Robert Johnson. That's J-O-H-N-S-O-N.", startTime: 7.8, endTime: 11.5 },
      { index: 4, text: "And what's your current address?", startTime: 11.5, endTime: 13.8 },
      { index: 5, text: "I live at forty-two Oak Street in the city centre.", startTime: 13.8, endTime: 17.5 },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding dictation exercises...\n");

  for (const exercise of SAMPLE_EXERCISES) {
    const existing = await prisma.dictationExercise.findFirst({
      where: { title: exercise.title },
    });

    if (existing) {
      console.log(`  ⏭️  Skipping "${exercise.title}" (already exists)`);
      continue;
    }

    const created = await prisma.dictationExercise.create({
      data: {
        title: exercise.title,
        description: exercise.description,
        audioUrl: exercise.audioUrl,
        level: exercise.level,
        category: exercise.category,
        totalSentences: exercise.sentences.length,
        isPublished: true,
        sentences: {
          create: exercise.sentences,
        },
      },
    });

    console.log(`  ✅ Created "${created.title}" with ${exercise.sentences.length} sentences`);
  }

  console.log("\n✨ Dictation seed complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
