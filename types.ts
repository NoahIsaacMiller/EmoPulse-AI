
export type ModelType = 'local' | 'cloud';
export type TabType = 'overview' | 'details' | 'advice';

export interface EmotionDetail {
  name: string;
  value: number;
}

export interface BackendResponse {
  primary_emotion: string;
  score: number; // 0 - 100
  sentiment_polarity: number; // -100 - 100
  details: EmotionDetail[];
  emoji: string;
  theme_color: string;
  comment: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  data: BackendResponse;
  model: ModelType;
}

export interface AdviceItem {
  title: string;
  content: string;
  icon: string;
  color: string;
}
