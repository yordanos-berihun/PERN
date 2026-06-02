import React from 'react';

/**
 * Reusable Alert component
 * @param {string} type - 'success' | 'error' | 'warning' | 'info' (default: 'info')
 * @param {string} message - Alert message
 * @param {function} [onClose] - Callback when alert is closed
 * @param {boolean} [dismissible] - Show close button (default: true)
 * @param {number} [autoClose] - Auto close after ms (null = no auto close)
 */
export default function Alert({
  type = 'info',
  message,
  onClose,
  dismissible = true,
  autoClose = null
}) {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, visible]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <p>{message}</p>
      </div>
      {dismissible && (
        <button
          className="alert-close"
          onClick={handleClose}
          aria-label="Close alert"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}
