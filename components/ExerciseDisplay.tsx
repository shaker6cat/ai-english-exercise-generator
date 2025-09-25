
import React from 'react';
import type { GeneratedExercises } from '../types';
import { QUESTION_TYPE_LABELS } from '../constants';

interface ExerciseDisplayProps {
  exercises: GeneratedExercises;
  showAnswers: boolean;
  setShowAnswers: (show: boolean) => void;
}

const AnswerBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-3 p-3 bg-green-50 dark:bg-gray-700 border-l-4 border-green-500 dark:border-green-400 rounded-r-md">
        {children}
    </div>
);


const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({ exercises, showAnswers, setShowAnswers }) => {
  const hasExercises = Object.values(exercises).some(e => Array.isArray(e) && e.length > 0);

  if (!hasExercises) {
    return (
      <div className="mt-6 p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300">No exercises were generated for the given input. Try adjusting the counts or topic.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="text-center">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all"
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
      </div>

      {exercises.sentenceRewrite?.length > 0 && (
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{QUESTION_TYPE_LABELS.sentenceRewrite}</h2>
          {exercises.sentenceRewrite.map((item, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <p className="font-semibold">{index + 1}. {item.question}</p>
              <p className="italic text-gray-600 dark:text-gray-400 ml-4">"{item.originalSentence}"</p>
              {showAnswers && <AnswerBlock>
                  <p><strong className="text-green-700 dark:text-green-300">Answer:</strong> {item.answer}</p>
                  <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Explanation:</strong> {item.explanation}</p>
              </AnswerBlock>}
            </div>
          ))}
        </section>
      )}

      {exercises.mcGrammar?.length > 0 && (
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{QUESTION_TYPE_LABELS.mcGrammar}</h2>
          {exercises.mcGrammar.map((item, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <p className="font-semibold">{index + 1}. {item.question}</p>
              <ul className="list-none space-y-2 mt-2 ml-4">
                {item.options.map((opt, i) => <li key={i} className="text-gray-700 dark:text-gray-300">{opt}</li>)}
              </ul>
              {showAnswers && <AnswerBlock>
                  <p><strong className="text-green-700 dark:text-green-300">Answer:</strong> {item.answer.join(', ')}</p>
                  <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Explanation:</strong> {item.explanation}</p>
              </AnswerBlock>}
            </div>
          ))}
        </section>
      )}

      {exercises.mcContext?.length > 0 && (
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{QUESTION_TYPE_LABELS.mcContext}</h2>
           {exercises.mcContext.map((item, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <p className="font-semibold">{index + 1}. {item.question}</p>
              <ul className="list-none space-y-2 mt-2 ml-4">
                {item.options.map((opt, i) => <li key={i} className="text-gray-700 dark:text-gray-300">{opt}</li>)}
              </ul>
              {showAnswers && <AnswerBlock>
                  <p><strong className="text-green-700 dark:text-green-300">Answer:</strong> {item.answer.join(', ')}</p>
                  <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Explanation:</strong> {item.explanation}</p>
              </AnswerBlock>}
            </div>
          ))}
        </section>
      )}

      {exercises.translation?.length > 0 && (
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{QUESTION_TYPE_LABELS.translation}</h2>
          {exercises.translation.map((item, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <p className="font-semibold">{index + 1}. 将以下中文翻译成英文 ({item.context}):</p>
              <p className="italic text-gray-600 dark:text-gray-400 ml-4">"{item.question}"</p>
              {showAnswers && <AnswerBlock>
                  <p><strong className="text-green-700 dark:text-green-300">Answer:</strong> {item.answer}</p>
                  <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Explanation:</strong> {item.explanation}</p>
              </AnswerBlock>}
            </div>
          ))}
        </section>
      )}
      
      {exercises.logicalAnalysis?.length > 0 && (
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">{QUESTION_TYPE_LABELS.logicalAnalysis}</h2>
          {exercises.logicalAnalysis.map((item, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <p className="font-semibold">{index + 1}. {item.question}</p>
                <p className="my-3 p-4 bg-gray-100 dark:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 leading-relaxed">{item.paragraph}</p>
                {showAnswers && <AnswerBlock>
                    <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Analysis:</strong> {item.answer}</p>
                    <p className="text-sm mt-1"><strong className="text-green-700 dark:text-green-300">Explanation:</strong> {item.explanation}</p>
                </AnswerBlock>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ExerciseDisplay;
