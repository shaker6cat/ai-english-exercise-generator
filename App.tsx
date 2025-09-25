import React, { useState, useCallback, useEffect } from 'react';
import type { GeneratedExercises, QuestionCounts, AIProvider, SiliconFlowModel } from './types';
import { generateExercises, fetchSiliconFlowModels } from './services/geminiService';
import { INITIAL_QUESTION_COUNTS } from './constants';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ExerciseDisplay from './components/ExerciseDisplay';
import Loader from './components/Loader';
import Welcome from './components/Welcome';

function App() {
  const [grammarPoint, setGrammarPoint] = useState<string>('to the degree that');
  const [questionCounts, setQuestionCounts] = useState<QuestionCounts>(INITIAL_QUESTION_COUNTS);
  const [exercises, setExercises] = useState<GeneratedExercises | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);

  // State for model and API key selection
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [siliconflowApiKey, setSiliconflowApiKey] = useState<string>('');

  // State for dynamic SiliconFlow models
  const [siliconFlowModels, setSiliconFlowModels] = useState<SiliconFlowModel[]>([]);
  const [siliconFlowModel, setSiliconFlowModel] = useState<SiliconFlowModel['id']>('');
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false);
  const [modelFetchError, setModelFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
        if (provider === 'siliconflow' && siliconflowApiKey.trim()) {
            setIsFetchingModels(true);
            setModelFetchError(null);
            setSiliconFlowModels([]); // Clear previous models
            setSiliconFlowModel(''); // Reset selected model
            try {
                const models = await fetchSiliconFlowModels(siliconflowApiKey);
                setSiliconFlowModels(models);
                if (models.length > 0) {
                    setSiliconFlowModel(models[0].id); // Set default selection
                }
            } catch (err) {
                setModelFetchError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsFetchingModels(false);
            }
        } else {
            // Clear models if provider is not siliconflow or key is removed
            setSiliconFlowModels([]);
            setSiliconFlowModel('');
            setModelFetchError(null);
        }
    };
    fetchModels();
  }, [provider, siliconflowApiKey]);


  const handleGenerate = useCallback(async () => {
    const apiKey = provider === 'gemini' ? geminiApiKey : siliconflowApiKey;
    const model = provider === 'gemini' ? 'gemini-2.5-flash' : siliconFlowModel;

    if (!grammarPoint.trim()) {
      setError('Please specify the content you want to practice.');
      return;
    }
    if (!apiKey.trim()) {
        setError(`Please provide an API key for ${provider === 'gemini' ? 'Google Gemini' : 'SiliconFlow'}.`);
        return;
    }
     if (provider === 'siliconflow' && !model) {
        setError('Please select a SiliconFlow model. If the list is empty, check your API key.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setExercises(null);
    setShowAnswers(false);

    try {
      const result = await generateExercises(provider, apiKey, model, grammarPoint, questionCounts);
      setExercises(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [grammarPoint, questionCounts, provider, geminiApiKey, siliconflowApiKey, siliconFlowModel]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputForm
            grammarPoint={grammarPoint}
            setGrammarPoint={setGrammarPoint}
            questionCounts={questionCounts}
            setQuestionCounts={setQuestionCounts}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            provider={provider}
            setProvider={setProvider}
            siliconFlowModel={siliconFlowModel}
            setSiliconFlowModel={setSiliconFlowModel}
            geminiApiKey={geminiApiKey}
            setGeminiApiKey={setGeminiApiKey}
            siliconflowApiKey={siliconflowApiKey}
            setSiliconflowApiKey={setSiliconflowApiKey}
            siliconFlowModels={siliconFlowModels}
            isFetchingModels={isFetchingModels}
            modelFetchError={modelFetchError}
          />
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Loader />}

          {!isLoading && !exercises && !error && <Welcome />}
          
          {exercises && (
            <ExerciseDisplay 
              exercises={exercises} 
              showAnswers={showAnswers} 
              setShowAnswers={setShowAnswers}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;