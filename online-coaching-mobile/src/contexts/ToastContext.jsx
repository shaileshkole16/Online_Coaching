import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-notifications';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toastRef = React.useRef(null);

  const showSuccess = (message) => {
    toastRef.current?.show(message, {
      type: 'success',
      placement: 'top',
      duration: 3000,
      animationType: 'slide-in',
    });
  };

  const showError = (message) => {
    toastRef.current?.show(message, {
      type: 'danger',
      placement: 'top',
      duration: 4000,
      animationType: 'slide-in',
    });
  };

  const showInfo = (message) => {
    toastRef.current?.show(message, {
      type: 'info',
      placement: 'top',
      duration: 3000,
      animationType: 'slide-in',
    });
  };

  const showWarning = (message) => {
    toastRef.current?.show(message, {
      type: 'warning',
      placement: 'top',
      duration: 3000,
      animationType: 'slide-in',
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
