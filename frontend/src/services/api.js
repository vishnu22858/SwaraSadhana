import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
});

API.interceptors.response.use(
  res => res,
  err => {
    console.error("API error:", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export const register = (data) => API.post("/register", data).then(r=>r.data);
export const login = (data) => API.post("/login", data).then(r=>r.data);
export const getTutorials = (course, level) => {
  const params = {};
  if (course) params.course = course;
  if (level) params.level = level;
  const qs = new URLSearchParams(params).toString();
  const path = "/tutorials" + (qs ? ("?"+qs) : "");
  return API.get(path).then(r=>r.data);
};
export const getProgress = (userId) => API.get(`/progress?userId=${userId}`).then(r=>r.data);
export const markProgress = (payload) => API.post("/progress", payload).then(r=>r.data);
export const unmarkProgress = (tutorialId, userId) => API.delete(`/progress/${tutorialId}?userId=${userId}`).then(r=>r.data);

export default API;
