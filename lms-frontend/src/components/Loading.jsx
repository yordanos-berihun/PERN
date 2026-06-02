import React from 'react';

/**
 * Reusable Loading component
 * @param {string} [text] - Loading message (default: 'Loading...')
 * @param {string} [size] - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} [variant] - 'spinner' | 'skeleton' | 'dots' (default: 'spinner')
 * @param {boolean} [fullscreen] - Full screen overlay (default: false)
 */
export default function Loading({
  text = 'Loading...',
  size = 'md',
  variant = 'spinner',
  fullscreen = false
}) {
  const containerClass = fullscreen ? 'loading-fullscreen' : 'loading-inline';
  const spinnerClass = `loading-spinner loading-${size}`;

  if (variant === 'dots') {
    return (
      <div className={containerClass}>
        <div className={`loading-dots loading-${size}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {text && <p>{text}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={containerClass}>
        <div className={`loading-skeleton loading-${size}`}></div>
        {text && <p>{text}</p>}
      </div>
    );
  }

  // Default: spinner
  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {text && <p>{text}</p>}
    </div>
  );
}
