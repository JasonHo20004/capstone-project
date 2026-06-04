const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // 1. Find IELTS test type
  let ielts = await prisma.englishTestType.findFirst({
    where: { name: { contains: "IELTS", mode: "insensitive" } },
  });

  if (!ielts) {
    console.log("IELTS test type not found! Creating...");
    ielts = await prisma.englishTestType.create({
      data: { name: "IELTS Academic" },
    });
  }

  const id = ielts.id;
  console.log("IELTS test type ID:", id, ielts.name);

  // Clear existing
  const deleted = await prisma.scoreConversion.deleteMany({ where: { englishTestTypeId: id } });
  console.log("Cleared", deleted.count, "existing conversions");

  // IELTS band score table: rawScore → bandScore
  const conversions = [
    [40, 9.0], [39, 9.0],
    [38, 8.5], [37, 8.5],
    [36, 8.0], [35, 8.0],
    [34, 7.5], [33, 7.5],
    [32, 7.0], [31, 7.0], [30, 7.0],
    [29, 6.5], [28, 6.5], [27, 6.5],
    [26, 6.0], [25, 6.0], [24, 6.0], [23, 6.0],
    [22, 5.5], [21, 5.5], [20, 5.5],
    [19, 5.0], [18, 5.0], [17, 5.0], [16, 5.0],
    [15, 4.5], [14, 4.5], [13, 4.5],
    [12, 4.0], [11, 4.0], [10, 4.0],
    [9, 3.5], [8, 3.5], [7, 3.5],
    [6, 3.0], [5, 3.0],
    [4, 2.5], [3, 2.5],
    [2, 2.0], [1, 2.0],
    [0, 0.0],
  ];

  const data = [];
  for (const skill of ["READING", "LISTENING"]) {
    for (const [raw, band] of conversions) {
      data.push({
        englishTestTypeId: id,
        skill,
        rawScore: raw,
        scaledScore: band,
      });
    }
  }

  const result = await prisma.scoreConversion.createMany({ data });
  console.log("Inserted", result.count, "score conversions (Reading + Listening)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
