export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  clipUrl: string;
  startAt?: number;
  pauseAt: number;
  position: string;
  difficulty: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizAnswerRecord {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  position: string;
  difficulty: number;
  answeredAt: string;
}

export interface QuizFeedbackPayload {
  name: string;
  email: string;
  rating: number;
  wouldUseFeature: 'yes' | 'no';
  requestedMore: boolean;
  review: string;
}
