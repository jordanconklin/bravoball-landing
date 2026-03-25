import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import quizData from '../../data/mentalTrainingQuiz.json';
import { submitQuizSession } from './api';
import { QuizAnswerRecord, QuizFeedbackPayload, QuizQuestion } from './types';

type QuizStage = 'landing' | 'question' | 'score' | 'feedback' | 'submitted';

const QUESTIONS = quizData as QuizQuestion[];

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
  transition: { duration: 0.25 },
};

const ratingLabels: Record<number, string> = {
  1: 'Not useful',
  2: 'A little useful',
  3: 'Interesting',
  4: 'Would use often',
  5: 'Need this now',
};

function getPerformanceLabel(score: number, totalQuestions: number) {
  const ratio = totalQuestions === 0 ? 0 : score / totalQuestions;
  if (ratio >= 0.85) return 'Elite field scanner';
  if (ratio >= 0.65) return 'Strong tactical reader';
  if (ratio >= 0.4) return 'Good instincts, more reps needed';
  return 'Raw pattern recognition';
}

function getOptionState(
  optionId: string,
  selectedAnswer: string | null,
  correctAnswer: string,
  hasAnswered: boolean
) {
  if (!hasAnswered) {
    return selectedAnswer === optionId ? 'selected' : 'idle';
  }

  if (optionId === correctAnswer) {
    return 'correct';
  }

  if (selectedAnswer === optionId) {
    return 'wrong';
  }

  return 'idle';
}

function getClipStartTime(question: QuizQuestion, hasAnswered: boolean) {
  if (hasAnswered) {
    return question.startAt ?? 0;
  }

  return 0;
}

async function safePlay(video: HTMLVideoElement, onFailure: (message: string) => void, blockedMessage: string) {
  try {
    await video.play();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return;
    }

    onFailure(blockedMessage);
  }
}

export default function MentalTrainingQuizPage() {
  const isDebugMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1';
  }, []);
  const [stage, setStage] = useState<QuizStage>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPlayOutActive, setIsPlayOutActive] = useState(false);
  const [pausedAtDecision, setPausedAtDecision] = useState(false);
  const [autoplayError, setAutoplayError] = useState('');
  const [playbackStarted, setPlaybackStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, QuizAnswerRecord>>({});
  const [feedback, setFeedback] = useState<QuizFeedbackPayload>({
    name: '',
    email: '',
    rating: 0,
    wouldUseFeature: 'yes',
    requestedMore: true,
    review: '',
  });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const decisionPauseFiredRef = useRef(false);

  const currentQuestion = QUESTIONS[questionIndex];
  const orderedAnswers = useMemo(
    () => QUESTIONS.map((question) => answers[question.id]).filter(Boolean) as QuizAnswerRecord[],
    [answers]
  );
  const score = orderedAnswers.filter((answer) => answer.isCorrect).length;
  const progressPercent = ((questionIndex + (stage === 'score' || stage === 'feedback' || stage === 'submitted' ? 1 : 0)) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (stage !== 'question') {
      return;
    }

    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsPlayOutActive(false);
    setPausedAtDecision(false);
    setPlaybackStarted(false);
    setAutoplayError('');
    decisionPauseFiredRef.current = false;
  }, [questionIndex, stage]);

  useEffect(() => {
    if (!videoRef.current || stage !== 'question') {
      return;
    }

    const video = videoRef.current;

    const handlePlaying = () => setPlaybackStarted(true);
    const handlePause = () => {
      if (!video.ended) {
        setPlaybackStarted(false);
      }
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentQuestion, stage]);

  useEffect(() => {
    if (stage !== 'question' || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    video.pause();
    video.currentTime = getClipStartTime(currentQuestion, hasAnswered);
    void safePlay(video, setAutoplayError, 'Autoplay was blocked. Tap play to start the clip.');
  }, [currentQuestion, hasAnswered, stage]);

  const handleStart = () => {
    setStage('question');
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !currentQuestion || decisionPauseFiredRef.current || hasAnswered) {
      return;
    }

    if (videoRef.current.currentTime >= currentQuestion.pauseAt) {
      decisionPauseFiredRef.current = true;
      videoRef.current.pause();
      videoRef.current.currentTime = currentQuestion.pauseAt;
      setPausedAtDecision(true);
      setPlaybackStarted(false);
      setAutoplayError('');
    }
  };

  const handleReplay = async () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
    decisionPauseFiredRef.current = false;
    setPausedAtDecision(false);
    setPlaybackStarted(true);
    setAutoplayError('');
    videoRef.current.currentTime = getClipStartTime(currentQuestion, hasAnswered);

    await safePlay(videoRef.current, setAutoplayError, 'Replay needs a tap to continue on this browser.');
  };

  const handleAnswerSelect = (optionId: string) => {
    if (!pausedAtDecision || hasAnswered) {
      return;
    }

    setSelectedAnswer(optionId);
    setHasAnswered(true);

    const record: QuizAnswerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer: optionId,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: optionId === currentQuestion.correctAnswer,
      position: currentQuestion.position,
      difficulty: currentQuestion.difficulty,
      answeredAt: new Date().toISOString(),
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: record,
    }));
  };

  const handlePlayOut = async () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
    videoRef.current.currentTime = getClipStartTime(currentQuestion, true);
    setIsPlayOutActive(true);
    setPlaybackStarted(true);
    setAutoplayError('');
    setPausedAtDecision(false);

    await safePlay(videoRef.current, (message) => {
      setAutoplayError(message);
      setIsPlayOutActive(false);
    }, 'Playback needs a tap to continue on this browser.');
  };

  const handleNext = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setStage('score');
      return;
    }

    setQuestionIndex((prev) => prev + 1);
  };

  const handleFeedbackChange = <K extends keyof QuizFeedbackPayload>(key: K, value: QuizFeedbackPayload[K]) => {
    setFeedback((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!feedback.name.trim() || !feedback.email.trim() || feedback.rating < 1) {
      setSubmitState('error');
      setSubmitError('Name, email, and a rating are required.');
      return;
    }

    setSubmitState('submitting');
    setSubmitError('');

    try {
      await submitQuizSession({
        ...feedback,
        score,
        totalQuestions: QUESTIONS.length,
        answers: orderedAnswers,
      });
      setSubmitState('success');
      setStage('submitted');
    } catch (error) {
      console.error(error);
      setSubmitState('error');
      setSubmitError('Could not save the session to Supabase. Check table names and env vars.');
    }
  };

  return (
    <PageShell>
      <TopBar>
        <BrandMark href="/">BravoBall</BrandMark>
        <RouteHint>Hidden beta test</RouteHint>
      </TopBar>

      <Content>
        <AnimatePresence mode="wait">
          {stage === 'landing' && (
            <MotionCard key="landing" {...cardMotion}>
              <Eyebrow>Mental Training Beta</Eyebrow>
              <HeroTitle>Train Your Soccer IQ</HeroTitle>
              <HeroCopy>
                Watch real match clips, pause at the decision point, and choose what you would do next.
                Then compare your read with the coaching explanation.
              </HeroCopy>
              <HeroMeta>
                <MetaPill>20-question concept</MetaPill>
                <MetaPill>Video-first quiz</MetaPill>
                <MetaPill>No login required</MetaPill>
              </HeroMeta>
              <PrimaryButton onClick={handleStart}>Start Mental Training</PrimaryButton>
            </MotionCard>
          )}

          {stage === 'question' && (
            <MotionCard key={`question-${currentQuestion.id}`} {...cardMotion}>
              <ProgressHeader>
                <ProgressTitle>
                  Question {questionIndex + 1} / {QUESTIONS.length}
                </ProgressTitle>
                <ProgressMeta>
                  {currentQuestion.position} • Difficulty {currentQuestion.difficulty}
                </ProgressMeta>
              </ProgressHeader>
              {isDebugMode && (
                <DebugBar>
                  <DebugLabel>Debug mode</DebugLabel>
                  <DebugActions>
                    <SecondaryButton
                      type="button"
                      onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))}
                      disabled={questionIndex === 0}
                    >
                      Previous Question
                    </SecondaryButton>
                    <PrimaryButton type="button" onClick={handleNext}>
                      Skip Forward
                    </PrimaryButton>
                  </DebugActions>
                </DebugBar>
              )}
              <ProgressTrack>
                <ProgressFill style={{ width: `${progressPercent}%` }} />
              </ProgressTrack>

              <VideoCard>
                <StyledVideo
                  ref={videoRef}
                  src={currentQuestion.clipUrl}
                  controls={hasAnswered}
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={() => {
                    if (!videoRef.current || stage !== 'question') {
                      return;
                    }

                    const startAt = getClipStartTime(currentQuestion, hasAnswered);
                    if (videoRef.current.currentTime < startAt || Number.isNaN(videoRef.current.currentTime)) {
                      videoRef.current.currentTime = startAt;
                    }
                  }}
                  onSeeking={() => {
                    if (!videoRef.current || hasAnswered) {
                      return;
                    }

                    const startAt = getClipStartTime(currentQuestion, hasAnswered);
                    const boundedTime = Math.min(
                      Math.max(videoRef.current.currentTime, startAt),
                      currentQuestion.pauseAt
                    );

                    if (Math.abs(videoRef.current.currentTime - boundedTime) > 0.05) {
                      videoRef.current.currentTime = boundedTime;
                    }
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlayOutActive(false)}
                />
                {autoplayError && <InlineNotice>{autoplayError}</InlineNotice>}
                <VideoControls>
                  <SecondaryButton type="button" onClick={handleReplay}>
                    {hasAnswered ? 'Replay Full Clip' : 'Replay Setup'}
                  </SecondaryButton>
                  {!hasAnswered && !pausedAtDecision && (
                    <PrimaryButton type="button" onClick={handleReplay}>
                      {playbackStarted ? 'Restart Clip' : 'Watch Clip'}
                    </PrimaryButton>
                  )}
                  {hasAnswered && (
                    <PrimaryButton type="button" onClick={handlePlayOut}>
                      Watch Full Play
                    </PrimaryButton>
                  )}
                </VideoControls>
              </VideoCard>

              <QuestionBlock>
                {pausedAtDecision || hasAnswered ? (
                  <>
                    <QuestionPrompt>{currentQuestion.question}</QuestionPrompt>
                    <QuestionHelper>
                      {hasAnswered
                        ? 'Review the explanation or watch the rest of the play.'
                        : 'Choose the best action before you continue the clip.'}
                    </QuestionHelper>

                    <OptionsGrid>
                      {currentQuestion.options.map((option) => (
                        <OptionButton
                          key={option.id}
                          type="button"
                          disabled={!pausedAtDecision || hasAnswered}
                          data-state={getOptionState(
                            option.id,
                            selectedAnswer,
                            currentQuestion.correctAnswer,
                            hasAnswered
                          )}
                          onClick={() => handleAnswerSelect(option.id)}
                        >
                          <OptionId>{option.id}</OptionId>
                          <span>{option.text}</span>
                        </OptionButton>
                      ))}
                    </OptionsGrid>
                  </>
                ) : (
                  <>
                    <QuestionPrompt>Watch clip {questionIndex + 1}.</QuestionPrompt>
                    <QuestionHelper>
                      The clip will pause just before the decision moment, then the question will appear.
                    </QuestionHelper>
                  </>
                )}

                {hasAnswered && (
                  <AnswerPanel>
                    <AnswerHeadline>
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct read.' : 'Better option available.'}
                    </AnswerHeadline>
                    <AnswerCopy>{currentQuestion.explanation}</AnswerCopy>
                  </AnswerPanel>
                )}

                {hasAnswered && (
                  <NextRow>
                    <SecondaryButton type="button" onClick={handleReplay}>
                      Rewatch Full Clip
                    </SecondaryButton>
                    <PrimaryButton type="button" onClick={handleNext} disabled={isPlayOutActive}>
                      {questionIndex === QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                    </PrimaryButton>
                  </NextRow>
                )}
              </QuestionBlock>
            </MotionCard>
          )}

          {stage === 'score' && (
            <MotionCard key="score" {...cardMotion}>
              <Eyebrow>Session Complete</Eyebrow>
              <HeroTitle>
                {score} / {QUESTIONS.length}
              </HeroTitle>
              <HeroCopy>{getPerformanceLabel(score, QUESTIONS.length)}</HeroCopy>
              <ScoreGrid>
                <ScoreStat>
                  <strong>{score}</strong>
                  <span>Correct</span>
                </ScoreStat>
                <ScoreStat>
                  <strong>{QUESTIONS.length - score}</strong>
                  <span>Missed</span>
                </ScoreStat>
                <ScoreStat>
                  <strong>{Math.round((score / QUESTIONS.length) * 100)}%</strong>
                  <span>Accuracy</span>
                </ScoreStat>
              </ScoreGrid>
              <PrimaryButton onClick={() => setStage('feedback')}>Leave Feedback</PrimaryButton>
            </MotionCard>
          )}

          {stage === 'feedback' && (
            <MotionCard key="feedback" {...cardMotion}>
              <Eyebrow>Tell Us If This Is Worth Building</Eyebrow>
              <HeroTitle>Feedback</HeroTitle>
              <FeedbackForm onSubmit={handleSubmitFeedback}>
                <FieldGrid>
                  <Field>
                    <Label>Name</Label>
                    <Input
                      value={feedback.name}
                      onChange={(event) => handleFeedbackChange('name', event.target.value)}
                      placeholder="Jordan"
                    />
                  </Field>
                  <Field>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={feedback.email}
                      onChange={(event) => handleFeedbackChange('email', event.target.value)}
                      placeholder="jordan@example.com"
                    />
                  </Field>
                </FieldGrid>

                <Field>
                  <Label>How useful is this feature?</Label>
                  <StarRow>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarButton
                        key={value}
                        type="button"
                        data-active={feedback.rating >= value}
                        onClick={() => handleFeedbackChange('rating', value)}
                      >
                        ★
                      </StarButton>
                    ))}
                  </StarRow>
                  <Hint>{feedback.rating > 0 ? ratingLabels[feedback.rating] : 'Select a rating'}</Hint>
                </Field>

                <Field>
                  <Label>Would you use this feature?</Label>
                  <ToggleRow>
                    <ChoicePill
                      type="button"
                      data-active={feedback.wouldUseFeature === 'yes'}
                      onClick={() => handleFeedbackChange('wouldUseFeature', 'yes')}
                    >
                      Yes
                    </ChoicePill>
                    <ChoicePill
                      type="button"
                      data-active={feedback.wouldUseFeature === 'no'}
                      onClick={() => handleFeedbackChange('wouldUseFeature', 'no')}
                    >
                      No
                    </ChoicePill>
                  </ToggleRow>
                </Field>

                <Field>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={feedback.requestedMore}
                      onChange={(event) => handleFeedbackChange('requestedMore', event.target.checked)}
                    />
                    Send me more BravoBall quiz tests like this
                  </CheckboxLabel>
                </Field>

                <Field>
                  <Label>Anything you would change?</Label>
                  <TextArea
                    rows={5}
                    value={feedback.review}
                    onChange={(event) => handleFeedbackChange('review', event.target.value)}
                    placeholder="What worked, what felt confusing, what would make this valuable?"
                  />
                </Field>

                {submitState === 'error' && <ErrorText>{submitError}</ErrorText>}

                <NextRow>
                  <SecondaryButton type="button" onClick={() => setStage('score')}>
                    Back
                  </SecondaryButton>
                  <PrimaryButton type="submit" disabled={submitState === 'submitting'}>
                    {submitState === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                  </PrimaryButton>
                </NextRow>
              </FeedbackForm>
            </MotionCard>
          )}

          {stage === 'submitted' && (
            <MotionCard key="submitted" {...cardMotion}>
              <Eyebrow>Saved</Eyebrow>
              <HeroTitle>Thanks for testing it.</HeroTitle>
              <HeroCopy>
                Your quiz session and feedback were submitted. This gives us a real signal on whether to turn
                mental training into a core BravoBall feature.
              </HeroCopy>
              <NextRow>
                <SecondaryButton type="button" onClick={() => window.location.assign('/')}>
                  Back to Home
                </SecondaryButton>
                <PrimaryButton
                  type="button"
                  onClick={() => {
                    setQuestionIndex(0);
                    setAnswers({});
                    setFeedback({
                      name: '',
                      email: '',
                      rating: 0,
                      wouldUseFeature: 'yes',
                      requestedMore: true,
                      review: '',
                    });
                    setSubmitState('idle');
                    setSubmitError('');
                    setStage('landing');
                  }}
                >
                  Run Again
                </PrimaryButton>
              </NextRow>
            </MotionCard>
          )}
        </AnimatePresence>
      </Content>
    </PageShell>
  );
}

const PageShell = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(246, 195, 86, 0.18), transparent 28%),
    linear-gradient(180deg, #fffdf8 0%, #ffffff 35%, #fff9ef 100%);
  color: #4b4b4b;
  padding: 2rem 1rem 4rem;
`;

const TopBar = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const BrandMark = styled.a`
  text-decoration: none;
  font-family: 'Potta One', cursive;
  font-size: 1.5rem;
  color: #f6c356;
`;

const RouteHint = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8a815e;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Content = styled.main`
  width: min(1120px, 100%);
  margin: 0 auto;
`;

const MotionCard = styled(motion.section)`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(229, 229, 229, 0.9);
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(67, 56, 24, 0.08);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 22px;
  }
`;

const Eyebrow = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c5921f;
  margin-bottom: 0.75rem;
`;

const HeroTitle = styled.h1`
  font-family: 'Potta One', cursive;
  color: #3f3826;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.05;
  margin: 0 0 1rem;
`;

const HeroCopy = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #6a6557;
  max-width: 720px;
  margin: 0 0 1.5rem;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const MetaPill = styled.span`
  border-radius: 999px;
  padding: 0.65rem 0.95rem;
  background: #fff6de;
  color: #8a6a12;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
`;

const buttonStyles = `
  border: none;
  border-radius: 12px;
  padding: 0.95rem 1.35rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;

const PrimaryButton = styled.button`
  ${buttonStyles}
  background: #f6c356;
  color: white;
  box-shadow: 0 8px 0 #d7a22d;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #fdcf6f;
  }
`;

const SecondaryButton = styled.button`
  ${buttonStyles}
  background: #f5f1e4;
  color: #4b4b4b;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProgressTitle = styled.h2`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  color: #3f3826;
`;

const ProgressMeta = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #857b67;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #f4ecda;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const DebugBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: #fff4d7;
  border: 1px solid #f1d38a;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DebugLabel = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #7b5d11;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.8rem;
`;

const DebugActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f6c356, #ffd978);
`;

const VideoCard = styled.div`
  background: #fcfbf7;
  border: 1px solid #efe6d3;
  border-radius: 24px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const StyledVideo = styled.video`
  width: 100%;
  border-radius: 18px;
  background: #111;
  display: block;
  max-height: 560px;
`;

const InlineNotice = styled.p`
  margin: 0.85rem 0 0;
  font-family: 'Poppins', sans-serif;
  color: #936e10;
  font-size: 0.95rem;
`;

const VideoControls = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const QuestionBlock = styled.div`
  display: grid;
  gap: 1rem;
`;

const QuestionPrompt = styled.h3`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  color: #302b20;
`;

const QuestionHelper = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #7c725d;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  width: 100%;
  text-align: left;
  border-radius: 18px;
  border: 1px solid #ece2cb;
  background: white;
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 0.98rem;
  color: #4b4b4b;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[data-state='selected'] {
    border-color: #f6c356;
    background: #fff8e6;
  }

  &[data-state='correct'] {
    border-color: #1f9d62;
    background: #e9fff3;
    color: #15603c;
  }

  &[data-state='wrong'] {
    border-color: #d95c54;
    background: #fff1ef;
    color: #8d2d26;
  }
`;

const OptionId = styled.span`
  min-width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f6f0df;
  color: #8d6f23;
  font-weight: 700;
`;

const AnswerPanel = styled.div`
  border-radius: 20px;
  background: #fff8e8;
  border: 1px solid #efd995;
  padding: 1rem 1.1rem;
`;

const AnswerHeadline = styled.h4`
  margin: 0 0 0.5rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #6f540f;
`;

const AnswerCopy = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.65;
  color: #5d533e;
`;

const NextRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.75rem 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScoreStat = styled.div`
  background: #fcf8ec;
  border: 1px solid #efe3bf;
  border-radius: 18px;
  padding: 1.25rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;

  strong {
    display: block;
    font-size: 2rem;
    color: #3f3826;
  }

  span {
    color: #7b715f;
  }
`;

const FeedbackForm = styled.form`
  display: grid;
  gap: 1.25rem;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const Label = styled.label`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #4b4b4b;
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #eee2c6;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #f6c356;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 2px solid #eee2c6;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #f6c356;
  }
`;

const StarRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const StarButton = styled.button`
  border: none;
  background: transparent;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #d9cfb1;

  &[data-active='true'] {
    color: #f6c356;
  }
`;

const Hint = styled.span`
  font-family: 'Poppins', sans-serif;
  color: #7c725d;
  font-size: 0.95rem;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ChoicePill = styled.button`
  border: 1px solid #e9dec4;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;

  &[data-active='true'] {
    background: #fff4d7;
    border-color: #f6c356;
    color: #8d6f23;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Poppins', sans-serif;
  color: #4b4b4b;
`;

const ErrorText = styled.p`
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #cf4038;
  font-weight: 600;
`;
