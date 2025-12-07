import api from './api';

const aiService = {
  // Chat with AI for task suggestions
  chat: async (messages, project_name, user_projects) => {
    // AI requests need longer timeout (60 seconds)
    const res = await api.post('/ai/chat', { messages, project_name, user_projects }, {
      timeout: 60000 // 60 seconds for AI requests
    });
    return res.data;
  },

  // Generate task suggestions based on project name (legacy)
  generateTaskSuggestions: async (project_name) => {
    // AI requests need longer timeout (60 seconds)
    const res = await api.post('/ai/tasks/suggestions', { project_name }, {
      timeout: 60000 // 60 seconds for AI requests
    });
    return res.data;
  }
};

export default aiService;

