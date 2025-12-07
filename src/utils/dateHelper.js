/**
 * Format date for HTML input type="date" (requires YYYY-MM-DD format)
 * @param {string|Date|null|undefined} dateString - Date string, Date object, or null/undefined
 * @returns {string} Formatted date string in YYYY-MM-DD format, or empty string if invalid
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // If already in YYYY-MM-DD format, return as is
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // If Date object or other format, convert to YYYY-MM-DD
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display (e.g., DD/MM/YYYY)
 * @param {string|Date|null|undefined} dateString - Date string, Date object, or null/undefined
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string} Formatted date string for display
 */
export const formatDateForDisplay = (dateString, locale = 'vi-VN') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString(locale);
};

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date|null|undefined} dateString - Date string, Date object, or null/undefined
 * @returns {string} Relative time string
 */
export const formatDistanceToNow = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Less than 1 minute
  if (diffInSeconds < 60) {
    return 'vừa xong';
  }
  
  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  // Less than 1 day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  // Less than 1 week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }
  
  // Less than 1 month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }
  
  // Less than 1 year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  
  // More than 1 year
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
};
