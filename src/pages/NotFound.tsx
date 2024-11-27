import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-950 dark:text-gray-200 w-screen">
      <div className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle 
            size={80} 
            className="text-red-500 dark:opacity-80" 
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors 
                     dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;