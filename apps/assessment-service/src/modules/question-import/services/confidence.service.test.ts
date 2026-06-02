// =============================================================================
// ConfidenceService — Unit Tests
// =============================================================================
import { describe, it, expect } from "vitest";
import { ConfidenceService } from "./confidence.service.js";

const svc = new ConfidenceService();

describe("ConfidenceService", () => {
  it("scores 0 and forces LLM when nothing parsed", () => {
    const r = svc.evaluate({
      questionCount: 0,
      questionsWithoutAnswer: 0,
      questionsWithFewOptions: 0,
      unparsedLength: 500,
      normalisedLength: 500,
    });
    expect(r.score).toBe(0);
    expect(r.shouldUseLlm).toBe(true);
  });

  it("gives a clean 4-option, fully-answered parse high confidence", () => {
    const r = svc.evaluate({
      questionCount: 15,
      questionsWithoutAnswer: 0,
      questionsWithFewOptions: 0,
      unparsedLength: 0,
      normalisedLength: 4000,
    });
    expect(r.score).toBe(1);
    expect(r.shouldUseLlm).toBe(false);
  });

  it("routes to LLM when most questions lack answers", () => {
    const r = svc.evaluate({
      questionCount: 10,
      questionsWithoutAnswer: 10,
      questionsWithFewOptions: 0,
      unparsedLength: 0,
      normalisedLength: 4000,
    });
    expect(r.shouldUseLlm).toBe(true);
    expect(r.reasons.join(" ")).toMatch(/no detected answer/i);
  });

  it("tolerates a small amount of trailing leftover text", () => {
    const r = svc.evaluate({
      questionCount: 10,
      questionsWithoutAnswer: 0,
      questionsWithFewOptions: 0,
      unparsedLength: 100, // 2.5% leftover — under tolerance
      normalisedLength: 4000,
    });
    expect(r.score).toBe(1);
    expect(r.shouldUseLlm).toBe(false);
  });
});
