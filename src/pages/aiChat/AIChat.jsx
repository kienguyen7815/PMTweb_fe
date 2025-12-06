import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../services/aiService';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';
import './AIChat.css';

const AIChat = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [addingTasks, setAddingTasks] = useState(new Set());
  const messagesEndRef = useRef(null);

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        if (res.success) {
          setProjects(res.data);
          if (res.data.length > 0 && !selectedProjectId) {
            setSelectedProjectId(res.data[0].id);
            setSelectedProjectName(res.data[0].name);
          }
        }
      } catch (err) {
        addToast('Không thể tải danh sách dự án', 'danger');
      }
    };
    loadProjects();
  }, []);

  // Update selected project name when project changes
  useEffect(() => {
    const project = projects.find(p => p.id === parseInt(selectedProjectId));
    if (project) {
      setSelectedProjectName(project.name);
    } else {
      setSelectedProjectName('');
    }
  }, [selectedProjectId, projects]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, aiLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize conversation with AI suggestion
  useEffect(() => {
    // Start conversation by asking AI to suggest development models
    const initializeChat = async () => {
      try {
        setAiLoading(true);
        const res = await aiService.chat([], selectedProjectName || null);
        if (res.success && res.data) {
          setAiMessages([{
            role: res.data.role || 'assistant',
            content: res.data.content || res.data.message || res.data
          }]);
        }
      } catch (err) {
        addToast('Không thể khởi tạo cuộc trò chuyện với AI', 'danger');
      } finally {
        setAiLoading(false);
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);

    try {
      const res = await aiService.chat(
        [...aiMessages, { role: 'user', content: userMessage }],
        selectedProjectName || null
      );
      if (res.success && res.data) {
        setAiMessages(prev => [...prev, { 
          role: res.data.role || 'assistant', 
          content: res.data.content || res.data.message || res.data 
        }]);
      } else {
        addToast('Không thể nhận phản hồi từ AI', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi gửi tin nhắn', 'danger');
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
      setAiMessages([]);
      setAiInput('');
      // Re-initialize conversation
      const initializeChat = async () => {
        try {
          setAiLoading(true);
          const res = await aiService.chat([], selectedProjectName || null);
          if (res.success && res.data) {
            setAiMessages([{
              role: res.data.role || 'assistant',
              content: res.data.content || res.data.message || res.data
            }]);
          }
        } catch (err) {
          addToast('Không thể khởi tạo cuộc trò chuyện với AI', 'danger');
        } finally {
          setAiLoading(false);
        }
      };
      initializeChat();
    }
  };

  // Parse AI suggestions from message content
  const parseSuggestions = (content) => {
    if (!content) return [];
    
    const suggestions = [];
    const seen = new Set();
    
    // Split by lines and process
    const lines = content.split('\n');
    
    // Debug: Log content to see what AI returns
    if (process.env.NODE_ENV === 'development') {
      console.log('Parsing AI content for suggestions:', content.substring(0, 500));
    }
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // Skip common non-task lines
      if (line.toLowerCase().includes('ví dụ') || 
          line.toLowerCase().includes('lưu ý') ||
          line.toLowerCase().includes('chú ý') ||
          line.toLowerCase().startsWith('bạn') ||
          line.toLowerCase().startsWith('tôi') ||
          line.toLowerCase().startsWith('chúng ta')) {
        continue;
      }
      
      // Match patterns like "1. Task name: Description", "1. Task name - Description", etc.
      // Try multiple patterns to catch different formats
      let taskName = '';
      let description = '';
      
      // Pattern 1: "1. Task name: Description" (with colon)
      const taskMatchWithDesc1 = line.match(/^[\d\-\•\*]\s+(.+?)\s*[:：]\s*(.+)$/);
      if (taskMatchWithDesc1) {
        taskName = taskMatchWithDesc1[1].trim();
        description = taskMatchWithDesc1[2].trim();
      } else {
        // Pattern 2: "1. Task name - Description" (with dash, but not at start)
        // Make sure dash is not part of the task name (avoid matching "Task - name")
        const taskMatchWithDesc2 = line.match(/^[\d\-\•\*]\s+(.+?)\s+-\s+(.+)$/);
        if (taskMatchWithDesc2 && taskMatchWithDesc2[2].length > 5) {
          taskName = taskMatchWithDesc2[1].trim();
          description = taskMatchWithDesc2[2].trim();
        }
      }
      
      if (taskName && description && description.length > 3) {
        // Clean up task name and description
        taskName = taskName.replace(/^[:\-]\s*/, '').trim();
        description = description.trim();
        // Remove trailing punctuation from description if needed
        description = description.replace(/^[.!?]\s*/, '').trim();
        
        if (taskName.length > 3 && taskName.length < 100 && 
            description.length > 3 && 
            !seen.has(taskName.toLowerCase())) {
          seen.add(taskName.toLowerCase());
          
          // Debug: Log parsed suggestion
          if (process.env.NODE_ENV === 'development') {
            console.log('Parsed suggestion with description:', { name: taskName, description });
          }
          
          suggestions.push({
            name: taskName,
            description: description,
            originalLine: line
          });
        }
        continue;
      }
      
      // Match patterns like "1. Task name" (without description)
      const taskMatch = line.match(/^[\d\-\•\*]\s+(.+?)(?:[:：]|$)/);
      if (taskMatch) {
        let taskName = taskMatch[1].trim();
        // Remove trailing punctuation if it's just one character
        taskName = taskName.replace(/^[:\-]\s*/, '').trim();
        
        // Try to get description from next line if available
        let description = '';
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          // If next line doesn't start with number/bullet and is not empty, use it as description
          if (nextLine && !/^[\d\-\•\*]/.test(nextLine) && nextLine.length > 10 && nextLine.length < 200) {
            description = nextLine;
          }
        }
        
        if (taskName.length > 3 && taskName.length < 100 && !seen.has(taskName.toLowerCase())) {
          seen.add(taskName.toLowerCase());
          suggestions.push({
            name: taskName,
            description: description,
            originalLine: line
          });
        }
        continue;
      }
      
      // Match lines that look like task items (start with capital, reasonable length)
      if (line.length > 10 && line.length < 150 && 
          /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(line)) {
        // Check if it's not a question or explanation
        if (!line.includes('?') && 
            !line.toLowerCase().includes('là gì') &&
            !line.toLowerCase().includes('như thế nào') &&
            !line.toLowerCase().includes('tại sao')) {
          
          // Clean up the task name
          let taskName = line.replace(/[.!?]$/, '').trim();
          
          if (taskName.length > 5 && taskName.length < 100 && 
              !seen.has(taskName.toLowerCase())) {
            seen.add(taskName.toLowerCase());
            suggestions.push({
              name: taskName,
              description: '',
              originalLine: line
            });
          }
        }
      }
    }
    
    return suggestions.slice(0, 10); // Limit to 10 suggestions
  };

  // Add task from AI suggestion
  const handleAddTask = async (suggestion) => {
    if (!selectedProjectId) {
      addToast('Vui lòng chọn dự án trước khi thêm task', 'warning');
      return;
    }

    const taskId = `suggestion-${Date.now()}-${Math.random()}`;
    setAddingTasks(prev => new Set(prev).add(taskId));

    try {
      // Debug: Log suggestion to see if description is present
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding task with suggestion:', suggestion);
      }

      const res = await taskService.create({
        project_id: selectedProjectId,
        name: suggestion.name,
        description: suggestion.description || '',
        status: 'To Do',
        progress: 0
      });

      if (res.success) {
        const descMsg = suggestion.description ? ' (có mô tả)' : ' (không có mô tả)';
        addToast(`Đã thêm task "${suggestion.name}" vào dự án${descMsg}`, 'success');
      } else {
        addToast('Không thể thêm task', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi thêm task', 'danger');
    } finally {
      setAddingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Render message with suggestions
  const renderMessageContent = (content, messageIndex) => {
    if (!content) return null;
    
    const suggestions = parseSuggestions(content);
    
    if (suggestions.length === 0) {
      return <div className="ai-message-text">{content}</div>;
    }

    // Render suggestions as a list at the end of the message
    return (
      <div className="ai-message-text">
        <div className="message-main-content">
          {content.split('\n').map((line, lineIdx) => {
            // Check if this line contains a suggestion
            const suggestion = suggestions.find(s => 
              line.includes(s.originalLine) || line.includes(s.name)
            );
            
            if (suggestion) {
              const isAdding = Array.from(addingTasks).some(id => id.includes(suggestion.name));
              return (
                <div key={`line-${lineIdx}`} className="ai-suggestion-item">
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.name}</span>
                    {suggestion.description && (
                      <span className="suggestion-description">{suggestion.description}</span>
                    )}
                  </div>
                  <button
                    className="add-task-btn"
                    onClick={() => handleAddTask(suggestion)}
                    disabled={isAdding || !selectedProjectId}
                    title={!selectedProjectId ? 'Chọn dự án trước' : suggestion.description ? `Thêm task với mô tả: ${suggestion.description}` : 'Thêm vào tasks'}
                  >
                    <i className={`fas ${isAdding ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                  </button>
                </div>
              );
            }
            return <div key={`line-${lineIdx}`}>{line || '\u00A0'}</div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ai-chat-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="ai-chat-header">
        <div className="ai-chat-header-content">
          <div className="ai-chat-header-info">
            <div className="ai-chat-header-icon">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h1>TRỢ LÝ AI</h1>
              <p className="ai-chat-subtitle">Hỗ trợ quản lý dự án và đề xuất mô hình phát triển</p>
            </div>
          </div>
          <div className="ai-chat-project-selector">
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const project = projects.find(p => p.id === parseInt(e.target.value));
                setSelectedProjectName(project?.name || '');
              }}
              className="project-select-dropdown"
              title="Chọn dự án để AI gợi ý theo dự án đó"
            >
              <option value="">-- Chọn dự án --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button 
            className="clear-chat-button"
            onClick={handleClearChat}
            title="Xóa cuộc trò chuyện"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div className="ai-chat-container">
        <div className="ai-chat-messages">
          {aiMessages.length === 0 && !aiLoading ? (
            <div className="ai-welcome-message">
              <div className="ai-avatar-large">
                <i className="fas fa-robot"></i>
              </div>
              <div className="welcome-content">
                <h4>Xin chào! Tôi là AI Assistant</h4>
                <p>Tôi có thể giúp bạn:</p>
                <ul>
                  <li>Đề xuất các mô hình phát triển phần mềm (Scrum, Waterfall, Agile, Kanban, v.v.)</li>
                  <li>Gợi ý quy trình phát triển theo mô hình bạn chọn</li>
                  <li>Tư vấn về best practices trong quản lý dự án</li>
                  <li>Trả lời các câu hỏi về phát triển phần mềm</li>
                </ul>
                <div className="welcome-examples">
                  <p><strong>Ví dụ câu hỏi:</strong></p>
                  <ul>
                    <li>"Tôi muốn phát triển dự án theo mô hình Scrum"</li>
                    <li>"Gợi ý các task cho dự án website bán hàng"</li>
                    <li>"Mô hình nào phù hợp cho dự án nhỏ?"</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            aiMessages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="ai-message-content">
                  {msg.role === 'assistant' ? renderMessageContent(msg.content, idx) : (
                    <div className="ai-message-text">{msg.content}</div>
                  )}
                  <div className="ai-message-time">
                    {msg.role === 'user' ? 'Bạn' : 'Trợ lý AI'}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))
          )}
          {aiLoading && (
            <div className="ai-message assistant">
              <div className="ai-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="ai-message-content">
                <div className="ai-message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form 
          className="ai-chat-input-form"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Nhập câu hỏi hoặc mô tả dự án của bạn..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            disabled={aiLoading}
          />
          <button
            type="submit"
            className="ai-chat-send-btn"
            disabled={!aiInput.trim() || aiLoading}
          >
            <i className={`fas ${aiLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;

