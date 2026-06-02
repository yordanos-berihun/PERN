import React from 'react';

/**
 * Reusable Modal component
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback to close modal
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} [footer] - Modal footer (usually buttons)
 * @param {boolean} [closeButton] - Show close button (default: true)
 * @param {string} [size] - 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeButton = true,
  size = 'md'
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className={`modal modal-${size}`}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {closeButton && (
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
