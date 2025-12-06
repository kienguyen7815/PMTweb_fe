import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { formatDistanceToNow } from '../../utils/dateHelper';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 50,
        user_id: '',
        action: '',
        target_table: '',
        start_date: '',
        end_date: ''
    });
    const { showToast } = useToast();

    useEffect(() => {
        loadLogs();
    }, [filters]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const response = await adminService.getActivityLogs(filters);
            if (response.success) {
                setLogs(response.data.logs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải activity logs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: 50,
            user_id: '',
            action: '',
            target_table: '',
            start_date: '',
            end_date: ''
        });
    };

    const getActionIcon = (action) => {
        if (action.includes('create')) return 'fa-plus-circle';
        if (action.includes('update')) return 'fa-edit';
        if (action.includes('delete')) return 'fa-trash';
        if (action.includes('login')) return 'fa-sign-in-alt';
        if (action.includes('logout')) return 'fa-sign-out-alt';
        return 'fa-circle';
    };

    const getActionColor = (action) => {
        if (action.includes('create')) return '#10b981';
        if (action.includes('update')) return '#3b82f6';
        if (action.includes('delete')) return '#ef4444';
        if (action.includes('login')) return '#8b5cf6';
        return '#64748b';
    };

    if (loading && logs.length === 0) {
        return (
            <div className="admin-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-header-title">Activity Logs</h1>
                    <p className="admin-header-subtitle">
                        Theo dõi tất cả hoạt động trong hệ thống
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={handleClearFilters}
                    >
                        <i className="fa-solid fa-filter-circle-xmark"></i>
                        Xóa bộ lọc
                    </button>
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={loadLogs}
                    >
                        <i className="fa-solid fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {/* Filters */}
                <div className="admin-filters">
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="🔍 Tìm action..."
                        value={filters.action}
                        onChange={(e) => handleFilterChange('action', e.target.value)}
                        style={{ flex: '1' }}
                    />
                    <select
                        className="admin-select"
                        value={filters.target_table}
                        onChange={(e) => handleFilterChange('target_table', e.target.value)}
                    >
                        <option value="">Tất cả bảng</option>
                        <option value="users">Users</option>
                        <option value="workspaces">Workspaces</option>
                        <option value="prj">Projects</option>
                        <option value="tasks">Tasks</option>
                        <option value="prj_mb">Project Members</option>
                        <option value="tsk_asg">Task Assignments</option>
                    </select>
                    <input
                        type="date"
                        className="admin-select"
                        value={filters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        placeholder="Từ ngày"
                    />
                    <input
                        type="date"
                        className="admin-select"
                        value={filters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        placeholder="Đến ngày"
                    />
                </div>

                {/* Logs Timeline */}
                <div style={{ marginTop: '20px' }}>
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '16px',
                                background: 'white',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    background: `${getActionColor(log.action)}20`,
                                    color: getActionColor(log.action)
                                }}
                            >
                                <i className={`fa-solid ${getActionIcon(log.action)}`}></i>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                                    <div>
                                        <strong style={{ color: '#1e293b' }}>{log.action}</strong>
                                        {log.target_table && (
                                            <span style={{ marginLeft: '8px', fontSize: '13px', color: '#64748b' }}>
                                                in <span className="admin-badge member">{log.target_table}</span>
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {formatDistanceToNow(log.created_at)}
                                    </span>
                                </div>

                                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                                    {log.description || 'No description'}
                                </div>

                                <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '16px' }}>
                                    {log.username && (
                                        <span>
                                            <i className="fa-solid fa-user"></i> {log.username}
                                        </span>
                                    )}
                                    {log.target_id && (
                                        <span>
                                            <i className="fa-solid fa-hashtag"></i> ID: {log.target_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {logs.length === 0 && !loading && (
                    <div className="admin-empty">
                        <i className="fa-solid fa-list-ul"></i>
                        <h3>Không có log nào</h3>
                        <p>Thử thay đổi bộ lọc hoặc làm mới trang</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="admin-pagination" style={{ marginTop: '24px' }}>
                        <button
                            className="admin-pagination-btn"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <span style={{ padding: '0 12px', color: '#64748b' }}>
                            Trang {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            className="admin-pagination-btn"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;

