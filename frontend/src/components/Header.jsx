import React from 'react';

const Header = ({ onTestBackend }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            🧠 Akıllı Notlar
          </h1>
          <button
            onClick={onTestBackend}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Backend Test
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
