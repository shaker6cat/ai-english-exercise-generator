
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold">Generating your custom exercises...</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
    </div>
  );
};

export default Loader;
