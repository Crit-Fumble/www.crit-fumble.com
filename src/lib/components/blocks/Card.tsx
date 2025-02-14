import React from 'react';

// Card component
export const Card: React.FC<{ children?: any, className?: string, id?: string }> = ({ children, className, id }) => {
  return (
    <div id={id} className={`bg-white dark:bg-gray-800 shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// CardHeader component
export const CardHeader: React.FC<{ children?: any, className?: string }> = ({ children, className }) => {
  return (
    <div className={`bg-[#552e66] text-white p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardContent component
export const CardContent: React.FC<{ children?: any, className?: string }> = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 text-gray-900 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </div>
  );
};