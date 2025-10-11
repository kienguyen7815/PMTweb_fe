import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, createComment } from '../features/comments/commentSlice';
import './ChatBox.css';

const ChatBox = ({ taskId, taskTitle }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchComments(taskId));
    }
  }, [dispatch, taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(createComment({
        taskId,
        commentData: {
          content: message,
          userId: user.id
        }
      }));
      setMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!taskId) {
    return (
      <div className="chat-box">
        <div className="chat-header">
          <h3>Chat</h3>
        </div>
        <div className="chat-placeholder">
          <p>Select a task to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat - {taskTitle}</h3>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading-messages">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`message ${comment.userId === user.id ? 'message-own' : 'message-other'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">
                    {comment.user?.name || 'Unknown User'}
                  </span>
                  <span className="message-time">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <div className="message-text">{comment.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary chat-send-btn"
            disabled={!message.trim() || loading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox; 