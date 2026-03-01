import { useState } from 'react';

const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const showToast = (type, message, duration = 3000) => {
    setToast({
      isVisible: true,
      type,
      message,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const showSuccess = (message, duration) => showToast('success', message, duration);
  const showError = (message, duration) => showToast('error', message, duration);
  const showWarning = (message, duration) => showToast('warning', message, duration);
  const showInfo = (message, duration) => showToast('info', message, duration);

  return {
    toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };
};

export default useToast;
