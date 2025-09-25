
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">Welcome to the AI English Exercise Generator!</h2>
      <p className="text-center text-gray-600 dark:text-gray-300">
        请指定要练习的内容{' '}
        <code className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {'X'}
        </code>
        ,
        请指定每种题型的数量{' '}
        <code className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {'Y'}
        </code>
        ,
        然后我向你出题。
      </p>
      <p className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm">
        (Please specify the content <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">X</code> you want to practice, specify the number of questions for each type <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">Y</code>, and then I will generate the questions for you.)
      </p>
      <div className="mt-6 text-center">
        <span className="text-4xl" role="img" aria-label="teacher emoji">👨‍🏫</span>
      </div>
    </div>
  );
};

export default Welcome;
