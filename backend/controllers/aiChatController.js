import User from "../models/User.js";
import { askGemini } from "../utils/geminiClient.js";

const DAILY_LIMIT = 20;

export const askQuestion = async (req, res) => {
  try {
    const { message, subjectContext, messageHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ── Rate limit: reset counter if new day ──
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastAiMessageDate || new Date(user.lastAiMessageDate) < today) {
      user.dailyAiMessages = 0;
      user.lastAiMessageDate = new Date();
    }

    if (user.dailyAiMessages >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: `You've reached the daily limit of ${DAILY_LIMIT} AI messages. Upgrade to Pro for unlimited access.`,
      });
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
      subjectContext ? `Context: The student is asking about ${subjectContext}.\n` : "",
      `Student: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    // ── Call Gemini (generous limit to avoid truncation, especially for Bangla/mixed language) ──
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI response.",
    });
  }
};
