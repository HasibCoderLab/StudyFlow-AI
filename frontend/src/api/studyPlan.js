import api from "./axios";

export const getCurrentPlan = () =>
  api.get("/study-plan").then((res) => res.data);

export const generatePlan = (data) =>
  api.post("/study-plan/generate", data).then((res) => res.data);

export const toggleTask = (planId, dayIndex, taskId) =>
  api.patch(`/study-plan/${planId}/day/${dayIndex}/task/${taskId}`).then((res) => res.data);
