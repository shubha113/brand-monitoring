import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

axios.defaults.withCredentials = true;

export const mentionsAPI = {
  fetchMentions: (brandName) => axios.post(`${API_URL}/mentions/fetch`, { brandName }),
  getMentions: (params) => axios.get(`${API_URL}/mentions`, { params }),
  getMentionById: (id) => axios.get(`${API_URL}/mentions/${id}`),
  deleteMention: (id) => axios.delete(`${API_URL}/mentions/${id}`)
};

export const dashboardAPI = {
  getStats: (timeRange) => axios.get(`${API_URL}/dashboard/stats`, { params: { timeRange } }),
  getSentimentTrend: (timeRange) => axios.get(`${API_URL}/dashboard/sentiment-trend`, { params: { timeRange } }),
  getSpikeAlerts: () => axios.get(`${API_URL}/dashboard/spike-alerts`),
  getKeywords: (timeRange, limit) => axios.get(`${API_URL}/dashboard/keywords`, { params: { timeRange, limit } }),
  getRecentActivity: (limit) => axios.get(`${API_URL}/dashboard/recent`, { params: { limit } })
};

export default API_URL;