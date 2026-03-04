


async function runTests() {
  console.log("🚀 Starting verification tests for Practice API (TOEIC)...");
  
  const baseUrl = "http://localhost:3008/api/practice";

  // 1. Create a TOEIC Practice Test
  console.log("1️⃣ Creating TOEIC Practice Test...");
  const createRes = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "ETS TOEIC Practice Test 1",
      duration: 120,
      examType: "TOEIC",
      sections: [{
        name: "Reading",
        orderIndex: 1,
        parts: [{
          name: "Part 5: Incomplete Sentences",
          orderIndex: 1,
          questionGroups: [{
            instructions: "Select the best answer to complete the sentence.",
            orderIndex: 1,
            questions: [{
              type: "TOEIC_SINGLE_CHOICE",
              orderIndex: 101,
              content: { question: "Customers are asked to examine their receipts carefully before ------- the store.", options: ["A) leave", "B) left", "C) leaving", "D) to leave"] },
              answer: { correctOption: "C" },
              explanation: "Before must be followed by a gerund (-ing form)."
            }]
          }]
        },
        {
          name: "Part 6: Text Completion",
          orderIndex: 2,
          questionGroups: [{
            instructions: "Read the email and complete the sentences.",
            orderIndex: 1,
            questions: [{
              type: "TOEIC_TEXT_COMPLETION",
              orderIndex: 131,
              content: { text: "We are pleased to announce that our new CEO, Ms. Cho, will officially {{131}} her duties on May 1." },
              answer: { "131": ["assume", "begin", "start"] },
              explanation: "Any of these verbs correctly collocate with 'duties'."
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

  // Extract Question IDs
  const singleChoiceId = createData.data.sections[0].parts[0].questionGroups[0].questions[0].id;
  const textCompletionId = createData.data.sections[0].parts[1].questionGroups[0].questions[0].id;

  // 2. Submit Test Answers
  console.log("\n2️⃣ Submitting Answers for Grading...");
  const submitRes = await fetch(`${baseUrl}/${testId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submissions: {
        [singleChoiceId]: "C", // Should be correct (1 pt)
        [textCompletionId]: { "131": "assume" }  // Should be correct (1 pt)
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
