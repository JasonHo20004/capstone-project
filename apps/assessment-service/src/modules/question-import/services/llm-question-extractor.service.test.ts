// =============================================================================
// LLM Question Extractor — Mapping Unit Tests (no network)
// =============================================================================
// Exercises the pure JSON→ParsedQuestion mapping/validation so we can guarantee
// the LLM contract is enforced without hitting Groq.
import { describe, it, expect } from "vitest";
import { mapLlmJsonToQuestions } from "./llm-question-extractor.service.js";

describe("mapLlmJsonToQuestions", () => {
  it("maps a well-formed payload, labelling options A–D", () => {
    const raw = JSON.stringify({
      questions: [
        {
          questionText: "IELTS Listening gồm bao nhiêu phần?",
          options: ["2 phần", "3 phần", "4 phần", "5 phần"],
          correctOptionIndex: 2,
          explanation: "Có 4 phần.",
        },
      ],
    });

    const result = mapLlmJsonToQuestions(raw);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].options.map((o) => o.key)).toEqual(["A", "B", "C", "D"]);
    expect(result![0].correctAnswerIndex).toBe(2);
    expect(result![0].explanation).toBe("Có 4 phần.");
  });

  it("caps options at 4 and clamps an out-of-range answer index to null", () => {
    const raw = JSON.stringify({
      questions: [
        {
          questionText: "Q?",
          options: ["a", "b", "c", "d", "e"],
          correctOptionIndex: 7,
        },
      ],
    });
    const result = mapLlmJsonToQuestions(raw);
    expect(result![0].options).toHaveLength(4);
    expect(result![0].correctAnswerIndex).toBeNull();
  });

  it("accepts a null answer index and missing explanation", () => {
    const raw = JSON.stringify({
      questions: [
        { questionText: "Q?", options: ["a", "b"], correctOptionIndex: null },
      ],
    });
    const result = mapLlmJsonToQuestions(raw);
    expect(result![0].correctAnswerIndex).toBeNull();
    expect(result![0].explanation).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(mapLlmJsonToQuestions("not json{")).toBeNull();
  });

  it("returns null when the payload violates the schema", () => {
    expect(mapLlmJsonToQuestions(JSON.stringify({ foo: "bar" }))).toBeNull();
    // A question with a single option is unusable.
    expect(
      mapLlmJsonToQuestions(
        JSON.stringify({ questions: [{ questionText: "Q", options: ["only"] }] })
      )
    ).toBeNull();
  });
});
