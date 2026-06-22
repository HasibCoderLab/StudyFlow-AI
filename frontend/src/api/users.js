import api from "./axios";

export const getProfile = () =>
  api.get("/users/profile").then((res) => res.data);

export const updateProfile = (data) =>
  api.put("/users/profile", data).then((res) => res.data);
