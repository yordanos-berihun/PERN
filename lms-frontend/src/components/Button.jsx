import React from 'react';

/**
 * Reusable Button component
 * @param {string} [variant] - 'primary' | 'secondary' | 'danger' (default: 'primary')
 * @param {string} [size] - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} [loading] - Show loading state
 * @param {string} [loadingText] - Text to show while loading
 * @param {boolean} [disabled] - Disable button
 * @param {function} [onClick] - Click handler
 * @param {string} [className] - Additional CSS classes
 * @param {ReactNode} children - Button content
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  onClick,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const buttonClass = `${baseClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? loadingText : children}
    </button>
  );
}
