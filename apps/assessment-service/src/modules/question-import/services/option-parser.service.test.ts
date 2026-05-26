// =============================================================================
// OptionParserService — Unit Tests
// =============================================================================
// Run:  pnpm test  (from capstone-project/)
//       pnpm test:watch  (interactive)
// =============================================================================

import { describe, it, expect } from "vitest";
import { OptionParserService } from "./option-parser.service.js";

const parser = new OptionParserService();

// ---------------------------------------------------------------------------
// Happy-path: normal 4-option blocks
// ---------------------------------------------------------------------------

describe("OptionParserService — happy path", () => {
  it("parses 4 options on separate lines", () => {
    const block = [
      "What is the capital of France?",
      "A. Berlin",
      "B. Paris",
      "C. Rome",
      "D. Madrid",
    ].join("\n");

    const { options, questionBody } = parser.parse(block);

    expect(options).toHaveLength(4);
    expect(options[0]).toEqual({ key: "A", text: "Berlin" });
    expect(options[1]).toEqual({ key: "B", text: "Paris" });
    expect(options[2]).toEqual({ key: "C", text: "Rome" });
    expect(options[3]).toEqual({ key: "D", text: "Madrid" });
    expect(questionBody).toBe("What is the capital of France?");
  });

  it("parses inline options (all on one line)", () => {
    const block = "Choose: A. for B. to C. of D. with";
    const { options } = parser.parse(block);

    expect(options).toHaveLength(4);
    expect(options[0].text).toBe("for");
    expect(options[1].text).toBe("to");
    expect(options[2].text).toBe("of");
    expect(options[3].text).toBe("with");
  });

  it("collapses whitespace in multi-line option text", () => {
    const block = [
      "Question?",
      "A. First option",
      "   continued here",
      "B. Second",
      "C. Third",
      "D. Fourth",
    ].join("\n");

    const { options } = parser.parse(block);
    expect(options[0].text).toBe("First option continued here");
  });
});

// ---------------------------------------------------------------------------
// Partial options (fewer than 4)
// ---------------------------------------------------------------------------

describe("OptionParserService — partial options", () => {
  it("returns only found options when block has A and B only", () => {
    const block = "True or False?\nA. True\nB. False";
    const { options } = parser.parse(block);
    expect(options).toHaveLength(2);
    expect(options[0].key).toBe("A");
    expect(options[1].key).toBe("B");
  });

  it("returns empty options when no markers are found", () => {
    const block = "Just some text with no options at all.";
    const { options, questionBody } = parser.parse(block);
    expect(options).toHaveLength(0);
    expect(questionBody).toBe("Just some text with no options at all.");
  });

  it("returns empty options for an empty string", () => {
    const { options, questionBody } = parser.parse("");
    expect(options).toHaveLength(0);
    expect(questionBody).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Edge case: A. inside prose must NOT be treated as an option marker
// ---------------------------------------------------------------------------

describe("OptionParserService — false-positive guard", () => {
  it("ignores A. that appears mid-sentence inside an option's text", () => {
    // The phrase "section A." appears inside option B's text — must not split.
    const block = [
      "Which section covers grammar?",
      "A. Introduction",
      "B. See section A. for details",
      "C. Appendix",
      "D. Index",
    ].join("\n");

    const { options } = parser.parse(block);
    expect(options).toHaveLength(4);
    expect(options[1].text).toContain("See section A.");
  });
});

// ---------------------------------------------------------------------------
// Out-of-order markers: only the canonical A→B→C→D sequence is kept
// ---------------------------------------------------------------------------

describe("OptionParserService — sequence enforcement", () => {
  it("skips a stray B. that appears before A. in the block", () => {
    const block = "Question?\nB. Wrong\nA. Correct first\nB. Second\nC. Third\nD. Fourth";
    const { options } = parser.parse(block);
    // Valid sequence starts at the real A.
    expect(options[0].key).toBe("A");
    expect(options[0].text).toBe("Correct first");
  });
});
