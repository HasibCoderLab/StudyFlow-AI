import QuizAttempt from "../../models/QuizAttempt.js";
import { askGemini } from "../../utils/geminiClient.js";
import { stripMarkdownFences, isValidQuizQuestions } from "../../utils/helpers.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

/* ─── Dummy question banks for fallback ─── */
const questionBank = {
  Physics: [
    { question: "What is the SI unit of force?", options: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"], correct: 0 },
    { question: "Newton's Second Law states that Force equals:", options: ["F = m/a", "F = ma", "F = m + a", "F = m - a"], correct: 1 },
    { question: "What is the acceleration due to gravity on Earth (approx)?", options: ["5.6 m/s²", "8.9 m/s²", "9.8 m/s²", "12.5 m/s²"], correct: 2 },
    { question: "Which of these is a vector quantity?", options: ["Speed", "Temperature", "Mass", "Velocity"], correct: 3 },
    { question: "An object at rest will remain at rest unless acted upon by:", options: ["Gravity only", "An unbalanced force", "Air resistance", "Friction"], correct: 1 },
    { question: "What is the formula for kinetic energy?", options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = ½mv"], correct: 1 },
    { question: "What is the SI unit of power?", options: ["Joule (J)", "Newton (N)", "Watt (W)", "Volt (V)"], correct: 2 },
    { question: "Momentum is defined as:", options: ["Mass × velocity", "Mass × acceleration", "Force × time", "Velocity × time"], correct: 0 },
  ],
  Chemistry: [
    { question: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correct: 1 },
    { question: "Which bond involves sharing of electrons?", options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], correct: 1 },
    { question: "What is the pH of pure water?", options: ["5", "7", "9", "11"], correct: 1 },
    { question: "The chemical formula of table salt is:", options: ["NaCl", "KCl", "CaCl₂", "MgCl₂"], correct: 0 },
    { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], correct: 2 },
    { question: "Which element is a liquid at room temperature?", options: ["Iron", "Mercury", "Aluminum", "Gold"], correct: 1 },
    { question: "Oxidation involves:", options: ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of protons"], correct: 1 },
    { question: "Which of these is a strong acid?", options: ["Acetic acid", "Citric acid", "Sulfuric acid", "Carbonic acid"], correct: 2 },
  ],
  Biology: [
    { question: "What is the basic unit of life?", options: ["Atom", "Cell", "Tissue", "Organ"], correct: 1 },
    { question: "Which organelle is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2 },
    { question: "Photosynthesis takes place in:", options: ["Nucleus", "Chloroplast", "Mitochondria", "Ribosome"], correct: 1 },
    { question: "How many bones are in the adult human body?", options: ["106", "206", "306", "406"], correct: 1 },
    { question: "Blood cell formation occurs in:", options: ["Liver", "Bone marrow", "Spleen", "Kidneys"], correct: 1 },
    { question: "Which vitamin is produced by sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
    { question: "The human heart has how many chambers?", options: ["2", "3", "4", "5"], correct: 2 },
    { question: "DNA stands for:", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Dynamic Nucleic Acid", "Dual Nucleotide Acid"], correct: 0 },
  ],
  Math: [
    { question: "What is the value of π (approx)?", options: ["3.14", "3.41", "2.14", "4.13"], correct: 0 },
    { question: "What is the square root of 144?", options: ["10", "11", "12", "13"], correct: 2 },
    { question: "The derivative of x² is:", options: ["x", "2x", "2", "x²"], correct: 1 },
    { question: "The area of a circle with radius r is:", options: ["πr", "2πr", "πr²", "2πr²"], correct: 2 },
    { question: "What is 15% of 200?", options: ["15", "20", "25", "30"], correct: 3 },
    { question: "A triangle has angles 90°, 45°, ____?", options: ["30°", "45°", "50°", "60°"], correct: 1 },
    { question: "The LCM of 6 and 8 is:", options: ["12", "16", "24", "48"], correct: 2 },
    { question: "What is the slope of y = 3x + 2?", options: ["2", "3", "-2", "-3"], correct: 1 },
  ],
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getSampleQuestions = catchAsync(async (req, res) => {
  const { subject } = req.query;
  const count = parseInt(req.query.count) || 5;
  const topic = req.query.topic || "";

  let questionsForClient = null;

  try {
    const userPrompt = JSON.stringify({
      subject: subject || "General Science",
      topic: topic || "general",
      count,
      difficulty: req.query.difficulty || "medium",
    });

    const systemPrompt =
      `Generate exactly ${count} multiple-choice questions for a quiz. ` +
      `Output ONLY valid JSON array, no markdown, no explanation: ` +
      `[{question, options: [4 strings], correct: <0-3 index>}] ` +
      `The correct answer index must be 0, 1, 2, or 3. Make questions grade-appropriate and clear.`;

    const geminiText = await askGemini(systemPrompt, userPrompt, 4096);
    const cleaned = stripMarkdownFences(geminiText);
    const parsed = JSON.parse(cleaned);

    if (isValidQuizQuestions(parsed)) {
      const selected = parsed.slice(0, count);
      // Cache correct answers server-side
      global.__quizCache = global.__quizCache || new Map();
      const sessionId = Date.now();
      selected.forEach((q) => {
        global.__quizCache.set(q.question, { correct: q.correct, sessionId });
      });
      // Periodically clean stale cache entries (older than 1 hour)
      if (global.__quizCache.size > 500) {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        for (const [key, val] of global.__quizCache) {
          if (val.sessionId < oneHourAgo) global.__quizCache.delete(key);
        }
      }
      // Strip correct before sending to client
      questionsForClient = selected.map(({ correct, ...q }) => q);
    }
  } catch (geminiErr) {
    console.warn("Gemini question generation failed, falling back to bank:", geminiErr.message);
  }

  // Fallback to hardcoded bank
  if (!questionsForClient) {
    const pool = questionBank[subject] || questionBank.Physics;
    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, count);
    questionsForClient = selected.map(({ correct, ...q }) => q);
  }

  res.json({ success: true, data: questionsForClient });
});

export const submitQuizAttempt = catchAsync(async (req, res) => {
  const { subject, topic, difficulty, questions, answers } = req.body;

  if (!subject || !questions || !answers) {
    throw new ApiError(400, "Subject, questions, and answers are required.");
  }

  const pool = questionBank[subject] || questionBank.Physics;
  const cache = global.__quizCache || new Map();

  let score = 0;

  const questionResults = questions
    .map((q, i) => {
      let correctIndex = null;

      // Try global cache first (for Gemini-generated questions)
      if (cache.has(q.question)) {
        correctIndex = cache.get(q.question).correct;
      } else {
        // Fallback to hardcoded bank
        const bankQuestion = pool.find((pq) => pq.question === q.question);
        if (bankQuestion) correctIndex = bankQuestion.correct;
      }

      if (correctIndex === null) return null;

      const selectedIndex = answers[i] !== undefined ? answers[i] : null;
      const isCorrect = selectedIndex === correctIndex;
      if (isCorrect) score++;

      return {
        question: q.question,
        options: q.options,
        correct: correctIndex,
        selected: selectedIndex,
        isCorrect,
      };
    })
    .filter(Boolean);

  const attempt = await QuizAttempt.create({
    userId: req.user._id,
    subject,
    topic: topic || "",
    difficulty: difficulty || "medium",
    questions: questionResults,
    score,
    totalQuestions: questionResults.length,
  });

  res.status(201).json({
    success: true,
    data: {
      attemptId: attempt._id,
      score,
      totalQuestions: questionResults.length,
      questions: questionResults,
    },
  });
});

export const getQuizHistory = catchAsync(async (req, res) => {
  const { limit } = req.query;

  const attempts = await QuizAttempt.find({ userId: req.user._id })
    .sort("-attemptedAt")
    .limit(parseInt(limit) || 20)
    .select("subject topic difficulty score totalQuestions attemptedAt");

  res.json({ success: true, data: attempts });
});
