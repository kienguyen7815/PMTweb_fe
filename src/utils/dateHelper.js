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

