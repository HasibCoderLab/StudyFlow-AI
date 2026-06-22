import api from "./axios";

export const logSession = (data) =>
  api.post("/study-logs", data).then((res) => res.data);

export const getWeeklySummary = () =>
  api.get("/study-logs/weekly").then((res) => res.data);

export const getMonthlySummary = () =>
  api.get("/study-logs/monthly").then((res) => res.data);
