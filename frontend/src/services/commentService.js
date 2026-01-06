import api from './api';

export const commentService = {
  create: async (articleId, content) => {
    const response = await api.post(`/articles/${articleId}/comments`, {
      commentairecontenu: content
    });
    return response.data;
  },

  getByArticle: async (articleId) => {
    const response = await api.get(`/articles/${articleId}/comments`);
    return response.data;
  },

  // Pour la modération (Admin)
  getApproved: async (articleId) => {
    const response = await api.get(`/articles/${articleId}/comments/approuves`);
    return response.data;
  },

  approve: async (commentId) => {
    const response = await api.patch(`/comments/${commentId}/approve`);
    return response.data;
  },

  delete: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};