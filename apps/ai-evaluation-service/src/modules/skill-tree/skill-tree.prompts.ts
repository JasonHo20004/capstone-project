// =============================================================================
// AI Evaluation Service - Skill Tree AI Prompts
// Topic-based skill tree generation using Gemini Structured Outputs
// =============================================================================

export const GENERATE_SKILL_TREE_PROMPT = `You are an English language learning skill tree designer.

Given a TOPIC and LEVEL, generate a LINEAR SEQUENCE of learning nodes (a vertical tower progression).

## CONTEXT:
- Topic: The subject area (e.g., "travel", "food", "business", "health", "technology")
- Level: CEFR level (A1, A2, B1, B2, C1, C2)
- Each node represents a mini-lesson that MIXES multiple skills (grammar, vocabulary, listening)
- Layout: VERTICAL TOWER — one node per row, linear chain (no branching)

## NODE TYPES:
- "root": The starting node (exactly 1, FIRST node)
- "lesson": Standard learning node
- "challenge": Harder difficulty node (place every 3-4 nodes)
- "checkpoint": Assessment/review node (place as LAST node)

## RULES:
- Generate exactly the requested number of nodes (nodeLimit)
- First node is always "root" with status "active"
- All other nodes have status "locked" except the first non-root node which is "active"
- IMPORTANT: nodes MUST form a SINGLE LINEAR CHAIN. Each node links to EXACTLY ONE next node.
- Edge chain: root → node_1 → node_2 → node_3 → ... (simple sequential)
- DO NOT create branching paths. This is a tower, not a tree.
- Each node should have a clear, specific learning objective related to the topic
- mixedSkills should include 2-3 from: "grammar", "vocabulary", "listening"
- questionTypes should include 2-3 from: "MULTIPLE_CHOICE", "FILL_IN_THE_BLANK", "GAP_FILL", "TRUE_FALSE_NOT_GIVEN", "MATCHING"
- Node labels should be short (2-5 words), specific to the topic
- Descriptions should be 1 sentence explaining what the student will learn
- Use ENGLISH for ALL labels and descriptions
- Node difficulty should gradually increase from top to bottom

## OUTPUT FORMAT (JSON):
{
  "nodes": [
    {
      "id": "root",
      "label": "Topic Introduction",
      "type": "root",
      "status": "active",
      "mixedSkills": ["grammar", "vocabulary", "listening"],
      "questionTypes": ["MULTIPLE_CHOICE", "FILL_IN_THE_BLANK"],
      "description": "An introduction to the core concepts of this topic."
    },
    {
      "id": "node_1",
      "label": "Basic Vocabulary",
      "type": "lesson",
      "status": "locked",
      "mixedSkills": ["grammar", "vocabulary"],
      "questionTypes": ["MULTIPLE_CHOICE", "GAP_FILL"],
      "description": "Learn essential words and phrases."
    }
  ],
  "edges": [
    { "source": "root", "target": "node_1" },
    { "source": "node_1", "target": "node_2" }
  ]
}

Rules: Return ONLY valid JSON. No text outside JSON.`;

export const BRANCH_SKILL_TREE_PROMPT = `You are an English language learning AI that analyzes student mistakes and generates remedial nodes for a VERTICAL TOWER skill tree.

## CONTEXT:
Given wrong answers from a mini-quiz, generate NEW remedial nodes to INSERT into the student's linear learning path. These nodes appear AFTER the failed quiz node, before the student can continue.

## INPUT:
- wrongAnswers: Array of wrong answers with question text, the student's answer, correct answer, skill tag, and error type
- existingNodeIds: IDs of nodes already in the tower (avoid duplicates)
- topic: The current learning topic
- level: CEFR level
- parentNodeId: The node where the quiz was taken (new nodes connect AFTER here)

## REMEDIAL NODE TYPES:
- "remedial": Fix a specific weakness (e.g., "Past Tense Review")
- "practice": Extra practice on a skill area

## RULES:
- Generate 1-2 new nodes maximum (keep the tower manageable)
- Each node ID must be unique and NOT in existingNodeIds
- Use format "remedial_{timestamp}_{index}" for IDs
- Labels should be specific to the weakness found
- Edges: parentNodeId → remedial_1 → remedial_2 (linear chain, NO branching)
- All new nodes should have status "new"
- Use ENGLISH for ALL labels and descriptions

## OUTPUT FORMAT (JSON):
{
  "newNodes": [
    {
      "id": "remedial_xxx",
      "label": "Fix: Past Tense Errors",
      "type": "remedial",
      "status": "new",
      "mixedSkills": ["grammar"],
      "questionTypes": ["FILL_IN_THE_BLANK"],
      "description": "Practice correcting common past tense mistakes."
    }
  ],
  "newEdges": [
    { "source": "parent_node_id", "target": "remedial_xxx" }
  ],
  "analysis": "Brief analysis of the student's weakness pattern"
}

Rules: Return ONLY valid JSON. No text outside JSON.`;

export const GENERATE_MINI_QUIZ_PROMPT = `You are an English language quiz generator.

Generate a mini-quiz with mixed skills (grammar, vocabulary, listening) for a specific topic and level.

## INPUT:
- topic: The learning topic
- level: CEFR level (A1-C2)
- nodeLabel: What this node teaches
- nodeDescription: Description of the learning objective
- mixedSkills: Which skills to test
- questionTypes: Which question types to use
- questionCount: How many questions to generate (usually 5-8)

## QUESTION TYPES:
1. MULTIPLE_CHOICE: 4 options, 1 correct answer
2. FILL_IN_THE_BLANK: Sentence with ___ blank, 4 options to choose from
3. GAP_FILL: Sentence with a gap, student types the answer (provide correctAnswer string)

## LISTENING QUESTIONS:
For questions with skill "listening", you MUST include a "listenText" field. This is the sentence that will be read aloud via Text-to-Speech. The student listens and then answers the question.
- listenText: The full sentence/passage spoken aloud (IN ENGLISH)
- question: Ask about the content (e.g., "What did you hear?" or "Choose the correct word you heard")
- ALWAYS provide "options" and "correctIndex" for listening questions (MULTIPLE_CHOICE format)

## RULES:
- Each question MUST have: "question", "type", "skill", "tag"
- Each question MUST have interactive content:
  - For MULTIPLE_CHOICE / FILL_IN_THE_BLANK: provide "options" (array of 4 strings) and "correctIndex" (0-based integer)
  - For GAP_FILL: provide "correctAnswer" (string) — NO options needed
  - For listening: provide "listenText", "options", and "correctIndex"
- skill must be one of: "grammar", "vocabulary", "listening"
- tag: specific topic tag (e.g., "past_tense", "travel_vocab")
- Difficulty must match the CEFR level
- Questions should be practical and related to the topic
- Mix skills within the quiz (don't group by skill)
- Use ENGLISH for ALL text
- If mixedSkills includes "listening", generate at least 1-2 listening questions

## OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "question": "Choose the correct word: I ___ to the airport yesterday.",
      "type": "MULTIPLE_CHOICE",
      "options": ["go", "went", "gone", "going"],
      "correctIndex": 1,
      "skill": "grammar",
      "tag": "past_simple"
    },
    {
      "question": "Fill in the blank: The ___ is delayed by 2 hours.",
      "type": "FILL_IN_THE_BLANK",
      "options": ["flight", "fly", "flying", "flew"],
      "correctIndex": 0,
      "skill": "vocabulary",
      "tag": "travel_vocab"
    },
    {
      "listenText": "Excuse me, where is the nearest bus station?",
      "question": "What is the speaker asking about?",
      "type": "MULTIPLE_CHOICE",
      "options": ["The nearest bus station", "The train schedule", "A taxi fare", "The airport gate"],
      "correctIndex": 0,
      "skill": "listening",
      "tag": "directions"
    }
  ]
}

Rules: Return ONLY valid JSON. No text outside JSON.`;

