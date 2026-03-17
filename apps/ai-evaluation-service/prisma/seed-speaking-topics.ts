// Seed speaking topics for the question bank
// Run: npx ts-node prisma/seed-speaking-topics.ts

import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const TOPICS = [
  {
    title: "Hometown and Living",
    part1Questions: [
      "Where is your hometown?",
      "What do you like about living there?",
      "Has your hometown changed much in recent years?",
      "Would you like to continue living in your hometown in the future?",
    ],
    part2Topic: "Describe a place in your hometown that you enjoy visiting",
    part2Bullets: [
      "Where this place is",
      "How often you go there",
      "What you do there",
    ],
    part2FinalPrompt: "Explain why you enjoy visiting this place",
    part3Questions: [
      "What changes have taken place in your city in recent years?",
      "Do you think it's better to grow up in the city or the countryside?",
      "How do you think cities will change in the future?",
      "What are the advantages of living in a big city?",
    ],
  },
  {
    title: "Work and Studies",
    part1Questions: [
      "Do you work or are you a student?",
      "What do you like about your job or studies?",
      "Is there anything you would like to change about your current situation?",
      "What are your plans for the future regarding work or studies?",
    ],
    part2Topic: "Describe a skill you learned that you find useful",
    part2Bullets: [
      "What the skill is",
      "When you learned it",
      "How you learned it",
    ],
    part2FinalPrompt: "Explain why you find this skill useful",
    part3Questions: [
      "What skills are important for young people to learn today?",
      "Do you think the education system prepares students well for work?",
      "How has technology changed the way people work?",
      "What do you think about working from home?",
    ],
  },
  {
    title: "Travel and Holidays",
    part1Questions: [
      "Do you enjoy traveling?",
      "What kind of places do you like to visit?",
      "Do you prefer traveling alone or with others?",
      "Have you ever been abroad?",
    ],
    part2Topic: "Describe a memorable trip you have taken",
    part2Bullets: [
      "Where you went",
      "Who you went with",
      "What you did there",
    ],
    part2FinalPrompt: "Explain why this trip was memorable",
    part3Questions: [
      "Why do you think people enjoy traveling?",
      "How has tourism affected local communities?",
      "Do you think international travel will increase or decrease in the future?",
      "What are the environmental impacts of tourism?",
    ],
  },
  {
    title: "Technology",
    part1Questions: [
      "How often do you use technology in your daily life?",
      "What is your favorite piece of technology?",
      "Do you think people are too dependent on technology?",
      "Has technology changed the way you learn or work?",
    ],
    part2Topic: "Describe a piece of technology that you find very useful",
    part2Bullets: [
      "What it is",
      "How long you have used it",
      "What you use it for",
    ],
    part2FinalPrompt: "Explain why you find it particularly useful",
    part3Questions: [
      "How has technology changed communication between people?",
      "Do you think technology has more advantages or disadvantages?",
      "What new technologies do you think will be developed in the future?",
      "Should children be limited in their use of technology?",
    ],
  },
  {
    title: "Food and Cooking",
    part1Questions: [
      "What kind of food do you like to eat?",
      "Do you prefer eating at home or in a restaurant?",
      "Can you cook? If so, what do you like to cook?",
      "Is food an important part of your culture?",
    ],
    part2Topic: "Describe a special meal you had",
    part2Bullets: [
      "When and where you had this meal",
      "Who you had it with",
      "What you ate",
    ],
    part2FinalPrompt: "Explain why this meal was special to you",
    part3Questions: [
      "How has the way people eat changed over the years?",
      "Do you think fast food is a problem in your country?",
      "What are the benefits of cooking at home compared to eating out?",
      "How important is it for people to eat a balanced diet?",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding speaking topics...");

  for (const topic of TOPICS) {
    const existing = await prisma.speakingTopic.findFirst({
      where: { title: topic.title },
    });

    if (existing) {
      console.log(`  ⏭️ "${topic.title}" already exists, skipping...`);
      continue;
    }

    await prisma.speakingTopic.create({ data: topic });
    console.log(`  ✅ Created: "${topic.title}"`);
  }

  console.log("\n🎉 Done! Seeded speaking topics.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
