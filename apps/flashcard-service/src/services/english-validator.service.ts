// =============================================================================
// English Word Validator
// Validates that frontContent is a valid English word or phrase
// Uses Free Dictionary API for single words and basic rules for phrases
// =============================================================================

const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

/**
 * Check if a single word is a valid English word using Free Dictionary API.
 */
async function isValidEnglishWord(word: string): Promise<boolean> {
  try {
    const response = await fetch(`${DICTIONARY_API}/${encodeURIComponent(word.trim())}`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok; // 200 = valid word, 404 = not found
  } catch {
    // If API is down, let it pass (don't block user)
    return true;
  }
}

/**
 * Basic check: does the text look like English?
 * - Only ASCII letters, spaces, hyphens, apostrophes
 * - No numbers or special characters (except common punctuation)
 */
function looksLikeEnglish(text: string): boolean {
  return /^[a-zA-Z\s\-']+$/.test(text.trim());
}

/**
 * Validate that the given text is a valid English word or phrase.
 * 
 * Strategy:
 * - Single word (no spaces): Check against Dictionary API
 * - Phrase (2-5 words): Check each word against Dictionary API
 * - More than 5 words: Just check if it looks like English characters
 * 
 * Returns: { valid: boolean, reason?: string }
 */
export async function validateEnglishText(
  text: string
): Promise<{ valid: boolean; reason?: string }> {
  const trimmed = text.trim();

  if (!trimmed) {
    return { valid: false, reason: "Text is empty" };
  }

  // Basic character check
  if (!looksLikeEnglish(trimmed)) {
    return {
      valid: false,
      reason: `"${trimmed}" contains non-English characters. Please enter English words only.`,
    };
  }

  const words = trimmed.split(/\s+/);

  // For long phrases (> 5 words), skip dictionary lookup, just check characters
  if (words.length > 5) {
    return { valid: true };
  }

  // For single word or short phrase: validate each word via dictionary
  for (const word of words) {
    // Skip very short words (a, an, the, is, etc.) - they're always valid
    if (word.length <= 2) continue;

    const isValid = await isValidEnglishWord(word);
    if (!isValid) {
      return {
        valid: false,
        reason: `"${word}" is not a recognized English word. Please check your spelling.`,
      };
    }
  }

  return { valid: true };
}
