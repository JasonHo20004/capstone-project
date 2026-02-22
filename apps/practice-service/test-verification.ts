

async function runTests() {
  console.log("🚀 Starting verification tests for Practice API...");
  
  const baseUrl = "http://localhost:3008/api/practice";

  // 1. Create a Practice Test
  console.log("1️⃣ Creating Practice Test...");
  const createRes = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Cambridge IELTS 18 - Test 1",
      duration: 120,
      examType: "IELTS",
      sections: [{
        name: "Reading",
        orderIndex: 1,
        parts: [{
          name: "Passage 1",
          content: "This is a test passage about urban farming.",
          orderIndex: 1,
          questionGroups: [{
            instructions: "Complete the summary below. Choose NO MORE THAN TWO WORDS.",
            orderIndex: 1,
            questions: [{
              type: "GAP_FILL",
              orderIndex: 1,
              content: { text: "Urban farming improves {{1}} and {{2}}." },
              answer: { "1": ["food security", "security"], "2": ["air quality"] },
              explanation: "Paragraph 1 mentions both food security and air quality."
            }, {
              type: "MULTIPLE_CHOICE",
              orderIndex: 2,
              content: { question: "What is the main advantage?", options: ["A: Cost", "B: Health", "C: Unknown"] },
              answer: { correctOptions: ["A: Cost"] }
            }]
          }]
        }]
      }]
    })
  });

  const createData = await createRes.json();
  if (!createRes.ok) throw new Error("Failed to create test: " + JSON.stringify(createData));
  const testId = createData.data.id;
  console.log("✅ Created Test ID:", testId);

  // Extract Question IDs to test the grading algorithm
  const gapFillId = createData.data.sections[0].parts[0].questionGroups[0].questions[0].id;
  const multiChoiceId = createData.data.sections[0].parts[0].questionGroups[0].questions[1].id;

  // 2. Submit Test Answers
  console.log("\n2️⃣ Submitting Answers for Grading...");
  const submitRes = await fetch(`${baseUrl}/${testId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submissions: {
        [gapFillId]: { "1": "food security", "2": "wrong answer" }, // 1 correct, 1 wrong = 1 point
        [multiChoiceId]: "A: Cost" // 1 correct = 1 point
      }
    })
  });

  const submitData = await submitRes.json();
  if (!submitRes.ok) throw new Error("Failed to submit test: " + JSON.stringify(submitData));
  
  console.log("✅ Grading Results:");
  console.log(`Total Score: ${submitData.data.totalScore} / ${submitData.data.maxPossibleScore}`);
  console.log(`Detailed Result:`, JSON.stringify(submitData.data.detail, null, 2));
}

runTests().catch(console.error);
