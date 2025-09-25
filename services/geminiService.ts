import { GoogleGenAI, Type } from "@google/genai";
import type { QuestionCounts, GeneratedExercises, AIProvider, SiliconFlowModel } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sentenceRewrite: {
            type: Type.ARRAY,
            description: "Sentence rewriting exercises.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Instruction for the user." },
                    originalSentence: { type: Type.STRING, description: "The sentence to be rewritten." },
                    answer: { type: Type.STRING, description: "The rewritten sentence including the target phrase." },
                    explanation: { type: Type.STRING, description: "A brief explanation of the rewrite." },
                },
                 required: ["question", "originalSentence", "answer", "explanation"]
            }
        },
        mcGrammar: {
            type: Type.ARRAY,
            description: "Multiple choice questions focusing on grammar.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question prompt." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "7 options (A-G), some correct, some incorrect." },
                    answer: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of correct option letters (e.g., ['A', 'D'])." },
                    explanation: { type: Type.STRING, description: "Explanation for why the answers are correct and others are not." },
                },
                 required: ["question", "options", "answer", "explanation"]
            }
        },
        mcContext: {
            type: Type.ARRAY,
            description: "Multiple choice questions focusing on context.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question prompt." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Several context options." },
                    answer: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of correct option letters." },
                    explanation: { type: Type.STRING, description: "Explanation for why the answers are suitable contexts." },
                },
                required: ["question", "options", "answer", "explanation"]
            }
        },
        translation: {
            type: Type.ARRAY,
            description: "Translation questions from Chinese to English.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The Chinese sentence to translate." },
                    context: { type: Type.STRING, description: "The context hint (e.g., '因果关系')." },
                    answer: { type: Type.STRING, description: "The correct English translation using the target phrase." },
                    explanation: { type: Type.STRING, description: "A brief explanation of the translation." },
                },
                required: ["question", "context", "answer", "explanation"]
            }
        },
        logicalAnalysis: {
            type: Type.ARRAY,
            description: "Logical analysis questions based on a paragraph.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question asking about the role of the phrase." },
                    paragraph: { type: Type.STRING, description: "The English paragraph containing the target phrase." },
                    answer: { type: Type.STRING, description: "A detailed analysis of the phrase's role and meaning in the paragraph." },
                    explanation: { type: Type.STRING, description: "Further clarification on the logical connection." },
                },
                required: ["question", "paragraph", "answer", "explanation"]
            }
        }
    },
    required: ["sentenceRewrite", "mcGrammar", "mcContext", "translation", "logicalAnalysis"]
};


const buildBaseUserPrompt = (grammarPoint: string, counts: QuestionCounts): string => `
Please generate a set of English exercises based on the following criteria:
- Target grammar point/phrase: "${grammarPoint}"
- Number of questions for each type:
  - Sentence Rewriting: ${counts.sentenceRewrite}
  - Multiple Choice (Grammar): ${counts.mcGrammar}
  - Multiple Choice (Context): ${counts.mcContext}
  - Translation (Chinese to English): ${counts.translation}
  - Logical Analysis: ${counts.logicalAnalysis}

**General Formatting for Multiple Choice Questions:**
- This applies to both 'mcGrammar' and 'mcContext' types.
- Each string in the 'options' array MUST be prefixed with a capital letter and a parenthesis. For example: "A) [Option text]", "B) [Option text]", etc.
- The 'answer' array for these types MUST contain only the capital letters of the correct options. For example: ["A", "C"].

**Strict Requirements for Each Question Type:**

1.  **Sentence Rewriting:**
    - The user's goal is to rewrite a sentence to include "${grammarPoint}".
    - For the 'originalSentence' field, you must generate a complete English sentence that does NOT contain "${grammarPoint}". This sentence is what the user will rewrite.
    - For the 'question' field, provide a simple instruction like "Rewrite the following sentence to include the phrase '${grammarPoint}'.".

2.  **Multiple Choice (Grammar):**
    - Provide exactly 7 long and potentially confusing sentences (labeled A-G) as options.
    - The user must identify which sentences correctly use "${grammarPoint}".
    - Include common mistakes in the incorrect options.

3.  **Multiple Choice (Context):**
    - Provide exactly 7 distinct scenarios or contexts (labeled A-G) as options.
    - The user must identify which contexts are appropriate for using "${grammarPoint}".
    - Focus on establishing a clear "phrase-context" connection (e.g., cause-and-effect, degree, scope of influence).

4.  **Translation (Chinese to English):**
    - For the 'question' field, you MUST generate a complete and unique Chinese sentence for the user to translate. This field must contain ONLY the Chinese sentence.
    - The user's task is to translate this generated Chinese sentence into English using "${grammarPoint}".
    - The sentences should align with the contexts identified in the previous question type (e.g., cause-and-effect, degree, scope). Provide a context hint for each in the 'context' field.

5.  **Logical Analysis:**
    - For the 'paragraph' field, provide an English paragraph that contains "${grammarPoint}".
    - For the 'question' field, ask the user to explain the role and meaning of "${grammarPoint}" within that specific paragraph.

**General Constraints:**
- All exercises must be at a difficulty level appropriate for a postgraduate English exam (e.g.,考研英语一).
- The content must be highly relevant to "${grammarPoint}".
- The answers and explanations must be accurate, clear, and concise.
- Adhere strictly to the requested number of questions for each type. If a count is 0, provide an empty array for that type.
- Do not include any sensitive or illegal content.
`;

const buildGeminiPrompt = (grammarPoint: string, counts: QuestionCounts) => {
    const systemInstruction = `You are an expert AI English Exercise Generator. Your goal is to help users improve their English proficiency to a postgraduate entrance exam level. Your sole function is to generate a JSON object containing English exercises based on the user's request. You must adhere strictly to the provided JSON schema and requirements. Your output must be only the JSON object.`;
    const userPrompt = buildBaseUserPrompt(grammarPoint, counts);
    return { systemInstruction, userPrompt };
};

const buildSiliconFlowPrompt = (grammarPoint: string, counts: QuestionCounts) => {
    const systemPrompt = `You are an expert AI English Exercise Generator. Your goal is to help users improve their English proficiency. Your sole function is to generate a JSON object containing English exercises based on the user's request. You must adhere strictly to the provided JSON schema and requirements. Do not output any text, explanations, or markdown formatting outside of the single, final JSON object.`;
    
    const getReadableSchema = (): string => `
The JSON object must have these top-level keys: "sentenceRewrite", "mcGrammar", "mcContext", "translation", "logicalAnalysis".
The value for each key must be an array of objects.

- For "sentenceRewrite", each object in the array must have the following string properties: "question", "originalSentence", "answer", "explanation".
- For "mcGrammar", each object must have: "question" (string), "options" (array of 7 strings), "answer" (array of strings), "explanation" (string).
- For "mcContext", each object must have: "question" (string), "options" (array of 7 strings), "answer" (array of strings), "explanation" (string).
- For "translation", each object must have: "question" (string), "context" (string), "answer" (string), "explanation" (string).
- For "logicalAnalysis", each object must have: "question" (string), "paragraph" (string), "answer" (string), "explanation" (string).

If a question type has a count of 0, return an empty array for that key.`;

    const userPrompt = `${buildBaseUserPrompt(grammarPoint, counts)}\n\n**Required JSON Output Schema:**\n${getReadableSchema()}`;
    
    return { systemPrompt, userPrompt };
};


const generateWithGemini = async (apiKey: string, model: string, grammarPoint: string, counts: QuestionCounts): Promise<GeneratedExercises> => {
    const ai = new GoogleGenAI({ apiKey });
    const { systemInstruction, userPrompt } = buildGeminiPrompt(grammarPoint, counts);
    
    const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as GeneratedExercises;
};

const generateWithSiliconFlow = async (apiKey: string, model: SiliconFlowModel['id'], grammarPoint: string, counts: QuestionCounts): Promise<GeneratedExercises> => {
    const { systemPrompt, userPrompt } = buildSiliconFlowPrompt(grammarPoint, counts);
    const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";

    const response = await fetch(SILICONFLOW_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.5,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorDetails = "No additional details available.";
        try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson?.error?.message || errorJson?.message || errorText;
        } catch (e) {
            errorDetails = errorText || "Unknown error occurred";
        }
        throw new Error(`SiliconFlow API error: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    const data = await response.json();
    let jsonString = data.choices[0].message.content;

    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    }
    
    return JSON.parse(jsonString.trim()) as GeneratedExercises;
};


export const generateExercises = async (
    provider: AIProvider,
    apiKey: string,
    model: string,
    grammarPoint: string,
    counts: QuestionCounts
): Promise<GeneratedExercises> => {
    try {
        if (provider === 'gemini') {
            return await generateWithGemini(apiKey, model, grammarPoint, counts);
        } else if (provider === 'siliconflow') {
            return await generateWithSiliconFlow(apiKey, model as SiliconFlowModel['id'], grammarPoint, counts);
        } else {
            throw new Error(`Unsupported AI provider: ${provider}`);
        }
    } catch (error) {
        console.error(`Error generating exercises with ${provider}:`, error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate exercises. ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating exercises.");
    }
};

export const fetchSiliconFlowModels = async (apiKey: string): Promise<SiliconFlowModel[]> => {
    const SILICONFLOW_MODELS_URL = "https://api.siliconflow.cn/v1/models";
    const response = await fetch(SILICONFLOW_MODELS_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();
            const message = errorData?.error?.message || 'Invalid API Key or network issue.';
            throw new Error(`Failed to fetch models: ${response.status} - ${message}`);
        } catch {
            throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
        }
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
         throw new Error("Unexpected response format from SiliconFlow API when fetching models.");
    }

    return data.data.map((model: { id: string }) => ({
        id: model.id,
        name: model.id 
    }));
};