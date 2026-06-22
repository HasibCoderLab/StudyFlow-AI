import api from "./axios";

export const askAiChat = (data) =>
  api.post("/ai-chat/ask", data).then((res) => res.data);
