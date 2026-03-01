/**
 * Utility functions for processing user-facing messages
 */

/**
 * Extract user-friendly message from rejection reason
 * Removes admin-specific notes and technical details
 * @param {string} rejectionReason - Raw rejection reason from backend
 * @returns {string} Clean, user-friendly message
 */
export const getUserFriendlyMessage = (rejectionReason) => {
  if (!rejectionReason) return null;
  
  // Split by newlines to process each part
  const parts = rejectionReason.split('\n');
  
  // Filter out admin notes and system messages
  const userFriendlyParts = parts.filter(part => {
    const trimmedPart = part.trim();
    const lowerPart = trimmedPart.toLowerCase();
    
    // Skip empty lines
    if (trimmedPart === '') return false;
    
    // Skip lines that start with brackets (system messages)
    if (trimmedPart.startsWith('[')) return false;
    
    // Skip lines containing admin-related keywords
    if (lowerPart.includes('admin id:') || 
        lowerPart.includes('admin id :') ||
        lowerPart.includes('by admin') || 
        lowerPart.includes('admin approved') ||
        lowerPart.includes('admin rejected') ||
        lowerPart.includes('admin update') ||
        lowerPart.includes('marked as completed by') ||
        lowerPart.includes('status updated by')) {
      return false;
    }
    
    return true;
  });
  
  // If we have user-friendly parts, return the first one
  // Otherwise, create a generic friendly message based on common patterns
  if (userFriendlyParts.length > 0) {
    return userFriendlyParts[0];
  }
  
  // Fallback: create generic messages for common system messages
  const lowerReason = rejectionReason.toLowerCase();
  if (lowerReason.includes('payment') && lowerReason.includes('completed')) {
    return "🎉 Booking confirmed! Your demo session has been scheduled successfully. Thank you!";
  }
  if (lowerReason.includes('admin update') && lowerReason.includes('cancelled')) {
    return "Unfortunately, this demo request has been cancelled.";
  }
  if (lowerReason.includes('admin approved') || lowerReason.includes('confirmed')) {
    return "✅ Your demo request has been confirmed! We're excited for your session.";
  }
  
  // If nothing matches, return null to hide the message
  return null;
};

/**
 * Get appropriate styling class based on message content
 * @param {string} message - The message to analyze
 * @param {string} status - Demo status (COMPLETED, REJECTED, etc.)
 * @returns {object} CSS classes for styling
 */
export const getMessageStyle = (message, status) => {
  if (!message) return null;
  
  // Success messages (completed, confirmed)
  if (status === 'COMPLETED' || status === 'ACCEPTED' || message.includes('✅') || message.includes('🎉')) {
    return {
      container: 'bg-green-50 border border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-700'
    };
  }
  
  // Rejection/cancellation messages
  if (status === 'REJECTED' || status === 'CANCELLED' || status === 'DENIED') {
    return {
      container: 'bg-rose-50 border border-rose-200',
      icon: 'text-rose-600',
      title: 'text-rose-900',
      text: 'text-rose-700'
    };
  }
  
  // Default/info messages
  return {
    container: 'bg-blue-50 border border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-700'
  };
};

/**
 * Get icon SVG based on status
 * @param {string} status - Demo status
 * @returns {string} Icon type ('success', 'error', 'info')
 */
export const getMessageIcon = (status) => {
  if (status === 'COMPLETED' || status === 'ACCEPTED') {
    return 'success'; // checkmark circle
  }
  
  if (status === 'REJECTED' || status === 'CANCELLED' || status === 'DENIED') {
    return 'error'; // x circle
  }
  
  return 'info'; // info circle
};
