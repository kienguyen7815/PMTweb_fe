import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import './Workspaces.css';

const Workspaces = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces, currentWorkspace, loading, selectWorkspace, createWorkspace } = useWorkspace();
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Phân tách workspace do mình tạo và workspace được mời/tham gia
  const ownedWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter(ws => user && ws.owner_id === user.id)
    : [];

  const memberWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter(ws => !user || ws.owner_id !== user.id)
    : [];

  const handleSelect = (ws) => {
    selectWorkspace(ws);
    navigate('/projects');
  };

  const handleOpenModal = () => {
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Tên không gian làm việc là bắt buộc');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const ws = await createWorkspace({
        name: form.name.trim(),
        description: form.description.trim()
      });
      setForm({ name: '', description: '' });
      setShowModal(false);
      // Sau khi tạo tự động vào workspace mới
      // navigate('/projects');
    } catch (err) {
      setError(err.message || 'Không thể tạo không gian làm việc');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workspaces-page">
      <div className="workspaces-hero" >
        <div>
          <p className="hero-eyebrow">Không gian làm việc</p>
          <h1>Chọn nơi bạn muốn bắt đầu</h1>
          <p className="hero-subtitle">
            Quản lý tất cả dự án, task, thành viên và báo cáo trong một nơi thống nhất.
          </p>
        </div>
        <div className='logo-wp-container'>
          <img src={require('../../assets/img/BrandTaskHub.png')} alt="TaskHub Logo" className='logo-wp' style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <span className='logo-wp-text'>
            TASK HUB
          </span>
        </div>
      </div>

      {/* Các workspace do chính user tạo */}
      <section className="workspace-section">
        <div className="workspace-section-header">
          <div>
            <h2>Không gian của bạn</h2>
            <p>Chạm để truy cập nhanh vào không gian đã tham gia</p>
          </div>
          <button className="workspace-section-action" onClick={handleOpenModal}>
            Tạo không gian
          </button>
        </div>

        {loading && (
          <div className="workspaces-loading">Đang tải danh sách không gian...</div>
        )}

        {!loading && ownedWorkspaces.length === 0 && (
          <div className="workspaces-empty">
            <p>Bạn chưa có không gian làm việc nào. Hãy tạo mới để bắt đầu.</p>
          </div>
        )}

        <div className="workspaces-grid">
          <button className="workspace-card workspace-card-create" onClick={handleOpenModal}>
            <div className="create-icon">+</div>
            <div>
              <h3>Tạo không gian mới</h3>
              <p>Bắt đầu dự án và mời thành viên</p>
            </div>
          </button>

          {ownedWorkspaces.map((ws) => (
            <button
              key={ws.id}
              className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`}
              onClick={() => handleSelect(ws)}
            >
              <div className="workspace-card-header">
                <div>
                  <h3>{ws.name}</h3>
                  {ws.description && (
                    <p className="workspace-desc">{ws.description}</p>
                  )}
                </div>
              </div>
              <div className="workspace-footer">
                <span className="workspace-status">
                  {currentWorkspace?.id === ws.id ? 'Đang hoạt động' : 'Nhấn để truy cập'}
                </span>
                <span className="workspace-arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Các workspace mà user được PM khác thêm vào / tham gia */}
      {memberWorkspaces.length > 0 && (
        <section className="workspace-section">
          <div className="workspace-section-header">
            <div>
              <h2>Không gian bạn tham gia</h2>
              <p>Các không gian do người khác tạo và mời bạn vào làm thành viên</p>
            </div>
          </div>

          <div className="workspaces-grid">
            {memberWorkspaces.map((ws) => (
              <button
                key={ws.id}
                className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`}
                onClick={() => handleSelect(ws)}
              >
                <div className="workspace-card-header">
                  <div>
                    <h3>{ws.name}</h3>
                    {ws.description && (
                      <p className="workspace-desc">{ws.description}</p>
                    )}
                  </div>
                </div>
                <div className="workspace-footer">
                  <span className="workspace-status">
                    {currentWorkspace?.id === ws.id ? 'Đang hoạt động' : 'Nhấn để truy cập'}
                  </span>
                  <span className="workspace-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {showModal && (
        <div className="workspace-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="workspace-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="workspace-modal-header">
              <div>
                <p className="modal-eyebrow">Tạo không gian</p>
                <h3>Thiết lập không gian mới</h3>
              </div>
              <button className="modal-close" onClick={handleCloseModal} disabled={submitting}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-row">
                <label htmlFor="ws-name">Tên không gian</label>
                <input
                  id="ws-name"
                  type="text"
                  placeholder="Ví dụ: Main project workspace"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="ws-desc">Mô tả</label>
                <textarea
                  id="ws-desc"
                  rows={4}
                  placeholder="Thêm mô tả ngắn gọn về mục đích, đội nhóm hoặc khách hàng..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              {error && <div className="workspace-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="modal-secondary" onClick={handleCloseModal} disabled={submitting}>
                  Hủy
                </button>
                <button type="submit" className="workspace-submit" disabled={submitting}>
                  {submitting ? 'Đang tạo...' : 'Tạo không gian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;

