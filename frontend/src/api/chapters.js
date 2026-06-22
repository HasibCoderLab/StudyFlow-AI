import api from "./axios";

export const getChaptersBySubject = (subjectId) =>
  api.get(`/chapters/${subjectId}`).then((res) => res.data);

export const createChapter = (data) =>
  api.post("/chapters", data).then((res) => res.data);

export const updateChapterStatus = (id, status) =>
  api.patch(`/chapters/${id}/status`, { status }).then((res) => res.data);

export const deleteChapter = (id) =>
  api.delete(`/chapters/${id}`).then((res) => res.data);
