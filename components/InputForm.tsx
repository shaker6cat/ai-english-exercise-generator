import React from 'react';
import type { QuestionCounts, AIProvider, SiliconFlowModel } from '../types';
import { QUESTION_TYPE_LABELS } from '../constants';

interface InputFormProps {
  grammarPoint: string;
  setGrammarPoint: (value: string) => void;
  questionCounts: QuestionCounts;
  setQuestionCounts: (counts: QuestionCounts) => void;
  onGenerate: () => void;
  isLoading: boolean;
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  siliconFlowModel: SiliconFlowModel['id'];
  setSiliconFlowModel: (modelId: SiliconFlowModel['id']) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  siliconflowApiKey: string;
  setSiliconflowApiKey: (key: string) => void;
  siliconFlowModels: SiliconFlowModel[];
  isFetchingModels: boolean;
  modelFetchError: string | null;
}

const InputForm: React.FC<InputFormProps> = ({
  grammarPoint,
  setGrammarPoint,
  questionCounts,
  setQuestionCounts,
  onGenerate,
  isLoading,
  provider,
  setProvider,
  siliconFlowModel,
  setSiliconFlowModel,
  geminiApiKey,
  setGeminiApiKey,
  siliconflowApiKey,
  setSiliconflowApiKey,
  siliconFlowModels,
  isFetchingModels,
  modelFetchError,
}) => {

  const handleCountChange = (type: keyof QuestionCounts, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setQuestionCounts({ ...questionCounts, [type]: numValue });
    }
  };

  const isApiKeyMissing = (provider === 'gemini' && !geminiApiKey.trim()) || (provider === 'siliconflow' && !siliconflowApiKey.trim());
  const isGenerateDisabled = isLoading || Object.values(questionCounts).every(count => count === 0) || !grammarPoint.trim() || isApiKeyMissing || (provider === 'siliconflow' && !siliconFlowModel);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
      {/* Section 1: Practice Content */}
      <div className="mb-6">
        <label htmlFor="grammar-point" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          1. 指定练习内容 (Practice Content)
        </label>
        <input
          id="grammar-point"
          type="text"
          value={grammarPoint}
          onChange={(e) => setGrammarPoint(e.target.value)}
          placeholder="e.g., to the degree that, on account of"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Section 2: AI Model Configuration */}
      <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
          2. 模型选择 (AI Model Selection)
        </label>
        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label htmlFor="provider-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
            <select
              id="provider-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
            >
              <option value="gemini">Google Gemini</option>
              <option value="siliconflow">SiliconFlow (硅基流动)</option>
            </select>
          </div>
          
          {/* API Key Inputs */}
          {provider === 'gemini' && (
            <div>
              <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
              <input
                id="gemini-key"
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Google Gemini API Key"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
              />
            </div>
          )}
          {provider === 'siliconflow' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="siliconflow-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SiliconFlow API Key</label>
                <input
                  id="siliconflow-key"
                  type="password"
                  value={siliconflowApiKey}
                  onChange={(e) => setSiliconflowApiKey(e.target.value)}
                  placeholder="Enter your SiliconFlow API Key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label htmlFor="siliconflow-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <select
                  id="siliconflow-model"
                  value={siliconFlowModel}
                  onChange={(e) => setSiliconFlowModel(e.target.value as SiliconFlowModel['id'])}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-600"
                  disabled={isFetchingModels || siliconFlowModels.length === 0}
                >
                  {isFetchingModels && <option>Fetching models...</option>}
                  {!isFetchingModels && siliconFlowModels.length === 0 && !modelFetchError && <option>Enter API key to load models</option>}
                  {!isFetchingModels && modelFetchError && <option>Error loading models</option>}
                  {siliconFlowModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                {modelFetchError && <p className="text-xs text-red-500 mt-1">{modelFetchError}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Question Counts */}
      <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label className="block text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
          3. 指定每种题型的数量 (Number of Questions)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.keys(questionCounts) as Array<keyof QuestionCounts>).map((type) => (
            <div key={type} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
              <label htmlFor={type} className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {QUESTION_TYPE_LABELS[type]}
              </label>
              <input
                id={type}
                type="number"
                min="0"
                max="5"
                value={questionCounts[type]}
                onChange={(e) => handleCountChange(type, e.target.value)}
                className="w-20 text-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Generate English exercises"
      >
        {isLoading ? 'Generating...' : 'Generate Exercises'}
      </button>
    </div>
  );
};

export default InputForm;