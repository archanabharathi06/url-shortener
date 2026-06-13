import api from './api';

const getUrlAnalytics = async (urlId) => {
  const response = await api.get(`/api/analytics/${urlId}`);
  return response.data; // Standardized: { success, data: { urlInfo, recentVisits, deviceBreakdown, browserBreakdown } }
};

const getUrlVisits = async (urlId, page = 1, limit = 10) => {
  const response = await api.get(`/api/analytics/${urlId}/visits`, {
    params: { page, limit }
  });
  return response.data; // Standardized: { success, data: Array, meta: pagination }
};

const getUrlChart = async (urlId) => {
  const response = await api.get(`/api/analytics/${urlId}/chart`);
  return response.data; // Standardized: { success, data: Array }
};

const getPublicStats = async (shortCode) => {
  const response = await api.get(`/api/public/${shortCode}/stats`);
  return response.data; // Standardized: { success, data: { urlInfo, chartData, deviceBreakdown, browserBreakdown, recentVisits } }
};

const analyticsService = {
  getUrlAnalytics,
  getUrlVisits,
  getUrlChart,
  getPublicStats
};

export default analyticsService;
