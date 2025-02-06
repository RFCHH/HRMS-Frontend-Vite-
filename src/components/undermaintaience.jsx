import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-10 bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">
          Page Under Maintenance
        </h1>
        <p className="text-gray-300 text-lg">
          We’re working hard to improve this page. Please check back soon!
        </p>
        <div className="mt-8">
          <svg
            className="w-24 h-24 text-yellow-500 mx-auto animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
