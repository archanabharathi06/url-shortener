import api from './api';

const getUrls = async (page = 1, limit = 10) => {
  const response = await api.get('/api/urls', {
    params: { page, limit }
  });
  return response.data; // Standardized: { success, data: Array, meta: { total, page, limit, pages } }
};

const createUrl = async (originalUrl, customAlias, expiresAt) => {
  const response = await api.post('/api/urls', {
    originalUrl,
    customAlias,
    expiresAt
  });
  return response.data; // Standardized: { success, data: Object }
};

const updateUrl = async (id, originalUrl, customAlias) => {
  const response = await api.patch(`/api/urls/${id}`, {
    originalUrl,
    customAlias
  });
  return response.data;
};

const deleteUrl = async (id) => {
  const response = await api.delete(`/api/urls/${id}`);
  return response.data;
};

const getQrCode = async (id) => {
  const response = await api.get(`/api/urls/${id}/qr`);
  return response.data; // Standardized: { success, data: { shortUrl } }
};

const urlService = {
  getUrls,
  createUrl,
  updateUrl,
  deleteUrl,
  getQrCode
};

export default urlService;
