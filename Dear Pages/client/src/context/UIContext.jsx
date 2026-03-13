import React, { createContext, useState, useCallback, useContext } from 'react';
import DynamicNotification from '../components/DynamicNotification';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, msg: '' });

  const showToast = useCallback((msg) => {
    setNotification({ show: true, msg });
  }, []);

  const closeToast = () => setNotification((prev) => ({ ...prev, show: false }));

  return (
    <UIContext.Provider value={{ showToast }}>
      {children}
      <DynamicNotification 
        isVisible={notification.show} 
        message={notification.msg} 
        onClose={closeToast} 
      />
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);