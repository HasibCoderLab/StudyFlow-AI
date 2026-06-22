import api from "./axios";

export const getQuestions = (subject, count = 5) =>
  api.get(`/quiz/questions?subject=${subject}&count=${count}`).then((res) => res.data);

export const submitQuiz = (data) =>
  api.post("/quiz/submit", data).then((res) => res.data);

export const getQuizHistory = (limit = 20) =>
  api.get(`/quiz/history?limit=${limit}`).then((res) => res.data);
