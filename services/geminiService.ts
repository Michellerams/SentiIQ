
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baseSchema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: 'The original text or user prompt that was analyzed.',
    },
    sentiment: {
      type: Type.STRING,
      enum: ['Positive', 'Negative', 'Neutral', 'Mixed', 'Surprise', 'Joy', 'Sadness', 'Anger', 'Fear'],
      description: 'The most fitting sentiment or emotion for the text or image. Can be Positive, Negative, Neutral, Mixed, Surprise, Joy, Sadness, Anger, or Fear.',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'The confidence score for the sentiment classification, from 0.0 to 1.0.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 3-5 keywords or descriptive phrases that most strongly indicate the sentiment.',
    },
    explanation: {
      type: Type.STRING,
      description: 'A brief, one-sentence explanation for the sentiment classification.',
    },
  },
  required: ['text', 'sentiment', 'confidence', 'keywords', 'explanation'],
};

const batchResponseSchema = {
  type: Type.ARRAY,
  items: baseSchema,
};


export const analyzeSentimentBatch = async (texts: string[]): Promise<AnalysisResult[]> => {
  if (!texts || texts.length === 0) {
    return [];
  }

  const prompt = `
    Analyze the sentiment and emotion of the following texts. For each text, provide:
    1. The original text.
    2. The most fitting sentiment or emotion from the following options:
       - "Positive": The text expresses a clearly positive emotion.
       - "Negative": The text expresses a clearly negative emotion.
       - "Neutral": The text is objective or does not express strong emotion.
       - "Mixed": The text contains both strong positive and negative elements.
       - "Surprise": The text expresses surprise or astonishment.
       - "Joy": A strong, specific positive emotion of happiness or delight.
       - "Sadness": A specific negative emotion of sorrow or unhappiness.
       - "Anger": A specific negative emotion of anger, frustration, or annoyance.
       - "Fear": A specific emotion of fear, anxiety, or nervousness.
    3. A confidence score for the classification (from 0.0 to 1.0).
    4. A list of 3-5 keywords that most strongly indicate the sentiment.
    5. A brief, one-sentence explanation for the classification.

    Return the entire output as a single JSON array, where each object in the array corresponds to one of the input texts and strictly follows the provided JSON schema.

    Texts to analyze:
    ---
    ${texts.map((text, index) => `Text ${index + 1}: "${text}"`).join('\n---\n')}
    ---
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: batchResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    const results: AnalysisResult[] = JSON.parse(jsonText);
    return results;
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    throw new Error('Failed to get a valid response from the AI. The content may be blocked or the API may be unavailable.');
  }
};

export const analyzeImageSentiment = async (image: { data: string, mimeType: string }, prompt: string): Promise<AnalysisResult> => {
  const imagePart = {
    inlineData: {
      data: image.data,
      mimeType: image.mimeType,
    },
  };

  const systemPrompt = `
    You are an expert sentiment and emotion analyst. Your task is to analyze the sentiment of an image, considering the user's optional prompt for context.

    Analyze the visual elements, mood, colors, and context of the image. Provide:
    1. The user's original prompt as the 'text' field. If the prompt is empty, use a short description of the image like "Image analysis".
    2. The most fitting sentiment or emotion from the following options:
       - "Positive": The image evokes a clearly positive emotion.
       - "Negative": The image evokes a clearly negative emotion.
       - "Neutral": The image is objective or does not evoke strong emotion.
       - "Mixed": The image contains elements that evoke both strong positive and negative emotions.
       - "Surprise": The image depicts a surprising or astonishing scene.
       - "Joy": A strong, specific positive emotion of happiness or delight is visible.
       - "Sadness": A specific negative emotion of sorrow or unhappiness is visible.
       - "Anger": A specific negative emotion of anger or frustration is visible.
       - "Fear": A specific emotion of fear or anxiety is visible.
    3. A confidence score for the classification (from 0.0 to 1.0).
    4. A list of 3-5 keywords or descriptive phrases from the image that most strongly indicate the sentiment (e.g., "smiling faces", "dark and gloomy atmosphere", "celebratory mood").
    5. A brief, one-sentence explanation for the classification based on the visual evidence.

    Return the entire output as a single JSON object that strictly follows the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: `User prompt: "${prompt || 'No prompt provided.'}"` }
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: baseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    
    // Ensure the original prompt is reflected in the result's text field
    result.text = prompt || "Image Analysis";

    return result;
  } catch (error) {
    console.error('Error analyzing image sentiment with Gemini:', error);
    throw new Error('Failed to get a valid response from the AI for the image. The content may be blocked or the API may be unavailable.');
  }
};

export const analyzeDocumentSentiment = async (document: { data: string; mimeType: string; name: string; }): Promise<AnalysisResult[]> => {
  const filePart = {
    inlineData: {
      data: document.data,
      mimeType: document.mimeType,
    },
  };
  
  const prompt = `Analyze the sentiment of the text within the provided document ('${document.name}'). Break down the document into logical paragraphs or sections. For each section, perform a detailed sentiment analysis including:
1. The original text of the section.
2. The most fitting sentiment or emotion (choose from 'Positive', 'Negative', 'Neutral', 'Mixed', 'Surprise', 'Joy', 'Sadness', 'Anger', 'Fear').
3. A confidence score for the classification (from 0.0 to 1.0).
4. A list of 3-5 keywords that most strongly indicate the sentiment.
5. A brief, one-sentence explanation for the classification.

Return the entire output as a single JSON array of objects, where each object represents a section's analysis and strictly follows the provided JSON schema. If the document is empty or contains no analyzable text, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: batchResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (jsonText === "") return []; // Handle empty response for empty files
    const results: AnalysisResult[] = JSON.parse(jsonText);
    return results;
  } catch (error) {
    console.error('Error analyzing document sentiment with Gemini:', error);
    throw new Error('Failed to analyze the document. It may be an unsupported format, corrupted, or the content may be blocked.');
  }
};
