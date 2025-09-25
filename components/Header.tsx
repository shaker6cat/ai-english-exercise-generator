
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          <span role="img" aria-label="brain emoji" className="mr-2">🧠</span>
          AI English Exercise Generator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">AI 英语练习题生成器</p>
      </div>
    </header>
  );
};

export default Header;
