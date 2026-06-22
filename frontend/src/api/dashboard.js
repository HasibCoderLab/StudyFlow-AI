import api from "./axios";

export const getDashboardStats = () =>
  api.get("/dashboard").then((res) => res.data);
