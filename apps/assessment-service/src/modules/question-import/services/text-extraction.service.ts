// =============================================================================
// Text Extraction Service
// =============================================================================
// Wraps `pdf-parse` and `mammoth` so callers don't have to care which library
// matches which extension. Returns a uniform shape.

// Note: pdf-parse ships only a CJS build with no proper type definitions; we
// load it dynamically so ESM consumers don't hit `default is undefined`.
async function loadPdfParse(): Promise<(buf: Buffer) => Promise<{ text: string; numpages?: number }>> {
  const mod = await import("pdf-parse");
  // pdf-parse default export is callable
  const fn = (mod as unknown as { default?: unknown }).default ?? mod;
  return fn as (buf: Buffer) => Promise<{ text: string; numpages?: number }>;
}

async function loadMammoth(): Promise<typeof import("mammoth")> {
  return (await import("mammoth")) as unknown as typeof import("mammoth");
}

export interface ExtractedText {
  rawText: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export class TextExtractionService {
  async extractFromPdf(buffer: Buffer): Promise<ExtractedText> {
    const pdfParse = await loadPdfParse();
    const result = await pdfParse(buffer);
    const rawText = result.text || "";
    return {
      rawText,
      wordCount: countWords(rawText),
      characterCount: rawText.length,
      pageCount: result.numpages,
    };
  }

  async extractFromDocx(buffer: Buffer): Promise<ExtractedText> {
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value || "";
    return {
      rawText,
      wordCount: countWords(rawText),
      characterCount: rawText.length,
    };
  }
}

export const textExtractionService = new TextExtractionService();
