import User from "../../models/User.js";
import { askGemini } from "../../utils/geminiClient.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

const DAILY_LIMIT = 20;

export const askQuestion = catchAsync(async (req, res) => {
  const { message, subjectContext, messageHistory } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError(400, "Message is required.");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found.");

  // ── Rate limit: reset counter if new day ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastAiMessageDate || new Date(user.lastAiMessageDate) < today) {
    user.dailyAiMessages = 0;
    user.lastAiMessageDate = new Date();
  }

  if (user.dailyAiMessages >= DAILY_LIMIT) {
    throw new ApiError(
      429,
      `You've reached the daily limit of ${DAILY_LIMIT} AI messages. Upgrade to Pro for unlimited access.`
    );
  }

  // ── Build context from last 5 messages ──
  const contextMessages = (messageHistory || []).slice(-5);
  const conversationContext = contextMessages
    .map((m) => `${m.role}: ${m.text}`)
    .join("\n");

  const classLevel = user.classLevel || "student";

  const systemPrompt =
    `You are a friendly, encouraging tutor for ${classLevel} students. ` +
    "Explain concepts simply and clearly. Include one concrete example. " +
    "Keep your response under 150 words. " +
    "End your response with a single practice question to test understanding.";

  const userPrompt = [
    conversationContext ? `Previous conversation:\n${conversationContext}\n` : "",
    subjectContext
      ? `Context: The student is asking about ${subjectContext}.\n`
      : "",
    `Student: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const aiText = await askGemini(systemPrompt, userPrompt, 1024);

  // ── Increment counter ──
  user.dailyAiMessages += 1;
  await user.save();

  res.json({
    success: true,
    data: {
      text: aiText,
      messagesUsed: user.dailyAiMessages,
      messagesLimit: DAILY_LIMIT,
    },
  });
});
