import React from 'react';

const Spinner = ({ message = 'Loading...', size = 'default', className = 'py-10' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full animate-in fade-in duration-500 ${className}`}>
      <div className="relative">
        {/* Outer Ring */}
        <div className={`rounded-full border-gray-200 ${sizeClasses[size]}`}></div>
        {/* Inner Spinning Ring */}
        <div className={`absolute top-0 left-0 rounded-full border-yellow-500 border-t-transparent animate-spin ${sizeClasses[size]}`}></div>
      </div>
      {message && (
        <p className="mt-4 text-gray-500 font-medium tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
