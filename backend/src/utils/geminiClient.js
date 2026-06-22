import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Punctuation characters that indicate the end of a sentence.
 * Includes: period, question mark, exclamation mark, and Bengali dāri (।)
 */
const SENTENCE_END_REGEX = /[.?!\u0964]$/;

/**
 * Trim a response back to the last complete sentence if it ends
 * mid-sentence (i.e. no ending punctuation). This prevents showing
 * users cut-off fragments when the token limit truncates output.
 */
function trimToLastCompleteSentence(text) {
  const trimmed = text.trimEnd();
  if (SENTENCE_END_REGEX.test(trimmed)) {
    // Already ends with sentence-ending punctuation — return as-is
    return trimmed;
  }

  // Find the last occurrence of sentence-ending punctuation
  const lastEnd = Math.max(
    trimmed.lastIndexOf("."),
    trimmed.lastIndexOf("?"),
    trimmed.lastIndexOf("!"),
    trimmed.lastIndexOf("\u0964"), // Bengali dāri (।)
  );

  if (lastEnd >= 0) {
    // Return up to and including the last complete sentence
    return trimmed.slice(0, lastEnd + 1).trimEnd();
  }

  // No complete sentence found — return the raw text so the user gets
  // something rather than nothing
  return trimmed;
}

/**
 * Call Gemini with a system prompt and user prompt.
 * Wraps the call in a timeout (default 10s).
 * Returns the generated text or throws on failure/timeout.
 */
export async function askGemini(systemPrompt, userPrompt, maxTokens = 1024) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: systemPrompt,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20_000);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    });

    clearTimeout(timeoutId);

    const response = result.response;
    const text = response.text();

    // ── Log finishReason for debugging truncation issues ──
    const finishReason = response.candidates?.[0]?.finishReason ?? "unknown";
    if (finishReason === "MAX_TOKENS") {
      console.warn(
        `[Gemini] finishReason=MAX_TOKENS — response was truncated at ${maxTokens} tokens. ` +
        `Raw length: ${text.length} chars. Consider increasing maxTokens.`
      );
    } else {
      console.log(`[Gemini] finishReason=${finishReason}, length=${text.length} chars`);
    }

    // ── Guard against mid-sentence truncation ──
    return trimToLastCompleteSentence(text);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Gemini request timed out after 20s");
    }
    throw err;
  }
}
