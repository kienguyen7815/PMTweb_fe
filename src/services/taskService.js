import api from './api';

const taskService = {
  listByProject: async (projectId) => {
    const res = await api.get(`/tasks/project/${projectId}`);
    return res.data;
  },
  get: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  updateProgress: async (id, progress) => {
    const res = await api.put(`/tasks/${id}/progress`, { progress });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  }
};

export default taskService;


