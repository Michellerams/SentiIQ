
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
  Mixed = 'Mixed',
  Surprise = 'Surprise',
  Joy = 'Joy',
  Sadness = 'Sadness',
  Anger = 'Anger',
  Fear = 'Fear',
}

export interface AnalysisResult {
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
  explanation: string;
}