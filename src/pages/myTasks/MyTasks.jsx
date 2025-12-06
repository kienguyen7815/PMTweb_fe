import React, { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/pageHeader/PageHeader';
import EmptyState from '../../components/emptyState/EmptyState';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import ModalAdd from '../../components/modal/ModalAdd';
import StatusBadge from '../../components/statusBadge/StatusBadge';
import taskAssignmentService from '../../services/taskAssignmentService';
import taskService from '../../services/taskService';
import { formatDateForDisplay } from '../../utils/dateHelper';
import './MyTasks.css';

const MyTasks = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [progressDraft, setProgressDraft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' }
  ];

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    setLoading(true);
    try {
      const res = await taskAssignmentService.getMyTasks();
      if (res.success) {
        setTasks(res.data);
      } else {
        addToast('Không thể tải danh sách công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải danh sách công việc', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const openTaskDetail = async (task) => {
    try {
      // Load full task details including comments
      const res = await taskService.get(task.task_id);
      if (res.success) {
        setSelectedTask({
          ...task,
          ...res.data,
          assignment_id: task.id
        });
        setProgressDraft(res.data.progress || 0);
        setIsDetailOpen(true);
      } else {
        addToast('Không thể tải chi tiết công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải chi tiết công việc', 'danger');
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedTask(null);
    setProgressDraft(0);
  };

  const updateProgress = async () => {
    if (!selectedTask || progressDraft < 0 || progressDraft > 100) {
      addToast('Tiến độ phải từ 0 đến 100', 'warning');
      return;
    }

    setUpdating(true);
    try {
      const res = await taskService.updateProgress(
        selectedTask.task_id,
        parseInt(progressDraft)
      );
      if (res.success) {
        setSelectedTask(prev => ({ ...prev, progress: parseInt(progressDraft) }));
        await loadMyTasks();
        addToast('Đã cập nhật tiến độ');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật tiến độ', 'danger');
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selectedTask) return;

    setUpdating(true);
    try {
      const res = await taskService.updateStatus(selectedTask.task_id, newStatus);
      if (res.success) {
        setSelectedTask(prev => ({ ...prev, status: newStatus }));
        await loadMyTasks();
        addToast('Đã cập nhật trạng thái');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái', 'danger');
    } finally {
      setUpdating(false);
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.task_name?.toLowerCase().includes(query) ||
      task.task_description?.toLowerCase().includes(query) ||
      task.task_status?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mytasks-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader
        icon="fa-user-check"
        title="CÔNG VIỆC CỦA TÔI"
        subtitle="Xem và cập nhật tiến độ các công việc được giao cho bạn."
        badge={tasks.length > 0 ? `${tasks.length} công việc` : ''}
        badgeIcon="fa-tasks"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm công việc..."
      />

      {loading ? (
        <LoadingState message="Đang tải danh sách công việc..." />
      ) : (
        <div className="mytasks-content">
          <div className="mytasks-list modern">
            {filteredTasks.length === 0 && tasks.length > 0 ? (
              <EmptyState
                icon="fa-search"
                title="Không tìm thấy công việc"
                description={`Không có công việc nào khớp với từ khóa "${searchQuery}"`}
              />
            ) : (
              filteredTasks.map((task) => (
              <div
                key={task.id}
                className="mytasks-card"
                onClick={() => openTaskDetail(task)}
              >
 
                <div className="mytasks-card-header">
                  <StatusBadge status={task.task_status} statuses={statuses} />
                  <span className="progress-badge">
                    <i className="fas fa-chart-line"></i>
                    {task.task_progress || 0}%
                  </span>
                </div>
                <h3 className="mytasks-card-title">{task.task_name}</h3>
                {task.task_description && (
                  <p className="mytasks-card-desc">{task.task_description}</p>
                )}
                <div className="mytasks-card-meta">
                  <span className="meta-item">
                    <i className="fas fa-folder"></i>
                    {task.project_name}
                  </span>
                  {task.task_due_date && (
                    <span className="meta-item">
                      <i className="fas fa-calendar-check"></i>
                      Hạn: {formatDateForDisplay(task.task_due_date)}
                    </span>
                  )}
                </div>
                <div className="mytasks-progress">
                  <div className="mytasks-progress-bar">
                    <div
                      className="mytasks-progress-fill"
                      style={{ width: `${task.task_progress || 0}%` }}
                    />
                  </div>
                  <span className="mytasks-progress-text">{task.task_progress || 0}%</span>
                </div>
              </div>
              ))
            )}
            {tasks.length === 0 && (
              <EmptyState
                icon="fa-tasks"
                title="Chưa có công việc nào"
                description="Bạn chưa được giao công việc nào. Các công việc được giao sẽ hiển thị ở đây."
              />
            )}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <ModalAdd
          isOpen={isDetailOpen}
          onClose={closeDetail}
          title={selectedTask.task_name}
          subtitle={selectedTask.project_name}
          icon="fa-tasks"
          size="large"
          actions={[
            {
              label: 'Đóng',
              icon: 'fa-times',
              className: 'secondary',
              onClick: closeDetail
            }
          ]}
        >
          <div className="task-detail-content">
            <div className="task-detail-section">
              <h4>
                <i className="fas fa-info-circle"></i>
                Thông tin công việc
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">
                    {selectedTask.task_description || 'Không có mô tả'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái:</span>
                  <div className="detail-value">
                    <StatusBadge status={selectedTask.task_status} statuses={statuses} />
                    <div className="status-actions">
                      {statuses.map(status => (
                        <button
                          key={status.value}
                          className={`status-btn ${selectedTask.task_status === status.value ? 'active' : ''}`}
                          onClick={() => updateStatus(status.value)}
                          disabled={updating || selectedTask.task_status === status.value}
                          type="button"
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedTask.task_due_date && (
                  <div className="detail-item">
                    <span className="detail-label">Hạn hoàn thành:</span>
                    <span className="detail-value">
                      {formatDateForDisplay(selectedTask.task_due_date)}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Ngày được giao:</span>
                  <span className="detail-value">
                    {formatDateForDisplay(selectedTask.assigned_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="task-detail-section">
              <h4>
                <i className="fas fa-chart-line"></i>
                Cập nhật tiến độ
              </h4>
              <div className="progress-editor">
                <div className="progress-input-group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressDraft}
                    onChange={(e) => setProgressDraft(e.target.value)}
                    className="progress-slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressDraft}
                    onChange={(e) => setProgressDraft(e.target.value)}
                    className="progress-input"
                  />
                  <span className="progress-percent">%</span>
                </div>
                <button
                  className="primary"
                  onClick={updateProgress}
                  disabled={updating || progressDraft === selectedTask.progress}
                  type="button"
                >
                  <i className="fas fa-save"></i>
                  {updating ? 'Đang lưu...' : 'Lưu tiến độ'}
                </button>
              </div>
              <div className="progress-bar-large">
                <div
                  className="progress-fill-large"
                  style={{ width: `${selectedTask.progress || 0}%` }}
                />
                <span className="progress-text-large">{selectedTask.progress || 0}%</span>
              </div>
            </div>
          </div>
        </ModalAdd>
      )}
    </div>
  );
};

export default MyTasks;
