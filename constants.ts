import type { QuestionCounts } from './types';

export const INITIAL_QUESTION_COUNTS: QuestionCounts = {
  sentenceRewrite: 1,
  mcGrammar: 1,
  mcContext: 1,
  translation: 1,
  logicalAnalysis: 1,
};

export const QUESTION_TYPE_LABELS: Record<keyof QuestionCounts, string> = {
  sentenceRewrite: '句子改写 (Sentence Rewriting)',
  mcGrammar: '多项选择-语法判断 (MC - Grammar)',
  mcContext: '多项选择-语境理解 (MC - Context)',
  translation: '翻译 (Translation)',
  logicalAnalysis: '逻辑分析 (Logical Analysis)',
};