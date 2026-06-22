/**
 * Strip markdown code fences (```json ... ```) so JSON.parse can succeed.
 */
export function stripMarkdownFences(text) {
  return text
    .replace(/^```(?:json)?\s*/gm, "")
    .replace(/```\s*$/gm, "")
    .trim();
}

/**
 * Validate that parsed Gemini quiz output has the required structure.
 * Handles correct as number or string.
 */
export function isValidQuizQuestions(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.every((q) => {
    if (!q || typeof q.question !== "string" || !Array.isArray(q.options)) {
      return false;
    }
    if (q.options.length !== 4) return false;
    const correctIdx = parseInt(q.correct, 10);
    if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) return false;
    // Normalize correct to number
    q.correct = correctIdx;
    return true;
  });
}
