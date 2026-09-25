import React from 'react';

/**
 * Reusable structural layout container component.
 */
export function Container({ children, className = '', ...props }) {
  return (
    <div className={`dwc-container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Container;
