export type AIProvider = 'gemini' | 'siliconflow';

export interface SiliconFlowModel {
  id: string;
  name: string;
}

export interface QuestionCounts {
  sentenceRewrite: number;
  mcGrammar: number;
  mcContext: number;
  translation: number;
  logicalAnalysis: number;
}

export interface SentenceRewriteQuestion {
  question: string;
  originalSentence: string;
  answer: string;
  explanation: string;
}

export interface MCGrammarQuestion {
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
}

export interface MCContextQuestion {
  question: string;
  options: string[];
  answer: string[];
  explanation: string;
}

export interface TranslationQuestion {
  question: string;
  context: string;
  answer: string;
  explanation: string;
}

export interface LogicalAnalysisQuestion {
  question: string;
  paragraph: string;
  answer: string;
  explanation: string;
}

export interface GeneratedExercises {
  sentenceRewrite: SentenceRewriteQuestion[];
  mcGrammar: MCGrammarQuestion[];
  mcContext: MCContextQuestion[];
  translation: TranslationQuestion[];
  logicalAnalysis: LogicalAnalysisQuestion[];
}