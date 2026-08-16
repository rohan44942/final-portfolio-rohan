import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const apiOrigin = apiBaseURL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 12000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

/** Wake Render free dyno early so content requests are less likely to cold-start. */
export const warmApi = () =>
  axios
    .get(`${apiOrigin}/health`, { timeout: 45000 })
    .then((response) => response.data)
    .catch(() => null);

export const fetchBootstrap = async () => {
  const { data } = await api.get("/content/bootstrap");
  return data;
};

export const fetchSection = async (section) => {
  const { data } = await api.get(`/content/${section}`);
  return data;
};

export const fetchProjects = async () => {
  const { data } = await api.get("/content/projects");
  return data.projects || [];
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

export default api;
