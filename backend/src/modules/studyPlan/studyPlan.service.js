/* ─── Dummy topic banks for fallback ─── */
const topicsBySubject = {
  physics: [
    "Scalars & Vectors",
    "Newton's Laws of Motion",
    "Work, Energy & Power",
    "Gravitation",
    "Thermal Physics",
    "Wave Motion & Sound",
    "Optics — Reflection & Refraction",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current",
    "Modern Physics — Radioactivity",
  ],
  chemistry: [
    "Atomic Structure",
    "Chemical Bonding",
    "Periodic Table Trends",
    "Stoichiometry & Mole Concept",
    "Chemical Reactions & Equations",
    "Acids, Bases & Salts",
    "Thermochemistry",
    "Electrochemistry",
    "Organic Chemistry — Hydrocarbons",
    "Organic Chemistry — Functional Groups",
  ],
  biology: [
    "Cell Structure & Function",
    "Cell Division — Mitosis & Meiosis",
    "Plant Physiology — Photosynthesis",
    "Plant Physiology — Respiration",
    "Human Digestive System",
    "Human Circulatory System",
    "Human Respiratory System",
    "Human Nervous System",
    "Genetics & Heredity",
    "Biotechnology & Genetic Engineering",
    "Ecology & Environment",
  ],
  math: [
    "Algebra — Quadratic Equations",
    "Algebra — Sequences & Series",
    "Trigonometry — Ratios & Identities",
    "Trigonometry — Equations",
    "Coordinate Geometry — Straight Lines",
    "Coordinate Geometry — Circles",
    "Calculus — Limits & Continuity",
    "Calculus — Derivatives",
    "Calculus — Integration Basics",
    "Statistics & Probability",
    "Vectors & 3D Geometry",
  ],
};

/**
 * Generate a dummy/fallback study plan when Gemini AI is unavailable
 */
export function generateDummyPlan({ examDate, subjects, dailyHours }) {
  const startDate = new Date();
  const endDate = new Date(examDate);
  const totalDays = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const days = [];
  let topicIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const tasksPerDay = Math.max(1, Math.min(3, Math.round(dailyHours / 1.5)));
    const dayTasks = [];

    for (let j = 0; j < tasksPerDay; j++) {
      const subjectIdx = (j + i) % subjects.length;
      const subject = subjects[subjectIdx].toLowerCase();
      const topics = topicsBySubject[subject] || ["General Topic"];
      const topic = topics[topicIndex % topics.length];
      topicIndex++;

      dayTasks.push({
        subject: subjects[subjectIdx],
        topic,
        duration: `${Math.round(30 + Math.random() * 30)} min`,
        completed: currentDate < new Date(new Date().toDateString()),
      });
    }

    days.push({ date: currentDate, tasks: dayTasks });
  }

  return { days, totalDays, examDate, dailyHours };
}
