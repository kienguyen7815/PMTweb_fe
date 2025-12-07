import api from './api';

const aiService = {
  // Trò chuyện với AI để nhận gợi ý về dự án và tasks
  chat: async (messages, project_name, user_projects) => {
    // AI cần thời gian xử lý lâu hơn request thông thường
    const res = await api.post('/ai/chat', { messages, project_name, user_projects }, {
      timeout: 60000
    });
    return res.data;
  },

  // Tạo danh sách tasks theo SDLC từ tên dự án (phiên bản cũ)
  generateTaskSuggestions: async (project_name) => {
    // Gemini API cần thời gian để generate danh sách tasks
    const res = await api.post('/ai/tasks/suggestions', { project_name }, {
      timeout: 60000
    });
    return res.data;
  }
};

export default aiService;

