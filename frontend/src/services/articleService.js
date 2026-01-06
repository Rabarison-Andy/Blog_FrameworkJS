import api from './api';

export const articleService = {
  getAll: async (params) => {
    // params peut être : { page: 1, limit: 5, sort: '-createdAt' }
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/articles', formData);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  publish: async (id) => {
    const response = await api.patch(`/articles/${id}/publish`);
    return response.data;
  }
};