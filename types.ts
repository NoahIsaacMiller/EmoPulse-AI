export interface EmotionMetric {
  emotion: string;
  score: number; // 0 to 100
}

export interface AnalysisResult {
  primaryEmotion: string;
  intensity: number; // 0 to 100
  sentimentScore: number; // -100 (Negative) to 100 (Positive)
  breakdown: EmotionMetric[];
  keywords: string[];
  suggestion: string;
  colorHex: string; // Suggested color based on emotion
  emoji: string; // Emoji representing the emotion
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  result: AnalysisResult;
}

export enum EmotionType {
  JOY = '喜悦',
  SADNESS = '悲伤',
  ANGER = '愤怒',
  FEAR = '恐惧',
  SURPRISE = '惊讶',
  DISGUST = '厌恶',
  NEUTRAL = '平静'
}