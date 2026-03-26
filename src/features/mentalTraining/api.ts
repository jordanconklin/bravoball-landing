import { supabase } from '../../lib/supabase';
import { QuizAnswerRecord, QuizFeedbackPayload } from './types';

interface SubmitQuizSessionParams extends QuizFeedbackPayload {
  score: number;
  totalQuestions: number;
  answers: QuizAnswerRecord[];
}

export async function submitQuizSession({
  name,
  email,
  rating,
  wouldUseFeature,
  requestedMore,
  review,
  score,
  totalQuestions,
  answers,
}: SubmitQuizSessionParams) {
  const sessionId = crypto.randomUUID();
  const normalizedEmail = email.trim();

  const { error: sessionError } = await supabase
    .from('mental_quiz_sessions')
    .insert([
      {
        id: sessionId,
        name,
        email: normalizedEmail || null,
        score,
        total_questions: totalQuestions,
        rating,
        would_use_feature: wouldUseFeature === 'yes',
        requested_more: requestedMore,
        review,
        completed_at: new Date().toISOString(),
        session_source: window.location.href,
      },
    ]);

  if (sessionError) {
    throw sessionError;
  }

  const answerRows = answers.map((answer) => ({
    session_id: sessionId,
    question_id: answer.questionId,
    selected_answer: answer.selectedAnswer,
    correct_answer: answer.correctAnswer,
    is_correct: answer.isCorrect,
    position: answer.position,
    difficulty: answer.difficulty,
    answered_at: answer.answeredAt,
  }));

  if (answerRows.length > 0) {
    const { error: answersError } = await supabase.from('mental_quiz_answers').insert(answerRows);

    if (answersError) {
      throw answersError;
    }
  }

  return sessionId;
}
