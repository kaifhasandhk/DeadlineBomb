import React, { useEffect, useState } from 'react';

const NotificationToast = ({ id, message, type = 'info', onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 7500); 

    const removeTimer = setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 8000); 

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onClose]);

  const handleCloseClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 500); 
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'toast-success';
      case 'warning': return 'toast-warning';
      case 'error': return 'toast-error';
      case 'urgent': return 'toast-urgent';
      default: return 'toast-info';
    }
  };

  return (
    <div className={`notification-toast ${getTypeClass()} ${isFadingOut ? 'fade-out' : ''}`}>
      <p>{message}</p>
      <button onClick={handleCloseClick} className="toast-close-btn">
        &times;
      </button>
    </div>
  );
};

export default NotificationToast;

