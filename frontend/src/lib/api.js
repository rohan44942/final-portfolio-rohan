import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const fetchSection = async (section) => {
  const { data } = await api.get(`/content/${section}`);
  return data;
};

export const fetchProjects = async () => {
  const { data } = await api.get("/content/projects");
  return data.projects || [];
};

export const fetchResume = async () => {
  const { data } = await api.get("/content/resume");
  return data;
};

export const loginAdmin = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data.token;
};

export const getAdminMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.admin;
};

export const saveSection = async (section, payload) => {
  const { data } = await api.put(`/admin/content/${section}`, { data: payload });
  return data;
};

export const createProject = async (project) => {
  const { data } = await api.post("/admin/projects", project);
  return data;
};

export const updateProject = async (id, project) => {
  const { data } = await api.put(`/admin/projects/${id}`, project);
  return data;
};

export const removeProject = async (id) => {
  await api.delete(`/admin/projects/${id}`);
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/admin/assets/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export default api;
