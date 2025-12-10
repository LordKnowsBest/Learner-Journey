"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  SkipForward,
  Lightbulb,
  TrendingUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  AdaptiveQuestion,
  AssessmentSession,
  AssessmentDomain,
  AssessmentStakes,
  MasteryEvidence,
} from "@/lib/types";
import { AdaptiveAssessmentEngine } from "@/lib/engines/AdaptiveAssessmentEngine";
import { MasteryEngine } from "@/lib/engines/MasteryEngine";
import { domainMetadata, getQuestionById } from "@/lib/assessment-questions";
import { useSession } from "@/context/SessionContext";

// ============================================
// WELCOME SCREEN COMPONENT
// ============================================

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

function WelcomeScreen({ onStart, onSkip }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block mb-4"
        >
          <Brain className="w-16 h-16 text-primary mx-auto" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Let's Personalize Your Journey
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          A few quick questions will help us understand where you're starting from.
        </p>
        <p className="text-sm text-muted-foreground">
          This is not a test — there's no passing or failing. It just helps us recommend the best path for you.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Personalized Path</p>
            <p className="text-xs text-muted-foreground">
              Skip what you know, focus on what matters
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 border-secondary">
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 text-secondary-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">5-10 Minutes</p>
            <p className="text-xs text-muted-foreground">
              Quick adaptive questions
            </p>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/30">
          <CardContent className="pt-6 text-center">
            <Shield className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Low Stakes</p>
            <p className="text-xs text-muted-foreground">
              No grades, just guidance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={onStart} className="gap-2">
          <Sparkles className="w-5 h-5" />
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="lg" onClick={onSkip} className="gap-2 text-muted-foreground">
          <SkipForward className="w-5 h-5" />
          Skip for Now
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        You can always take or retake this assessment later from your profile.
      </p>
    </motion.div>
  );
}

// ============================================
// QUESTION DISPLAY COMPONENT
// ============================================

interface QuestionDisplayProps {
  question: AdaptiveQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptions: string[];
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  showFeedback: boolean;
  isCorrect?: boolean;
}

function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedOptions,
  onSelectOption,
  onSubmit,
  showFeedback,
  isCorrect,
}: QuestionDisplayProps) {
  const domainInfo = domainMetadata[question.domain];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="gap-1">
            {domainInfo.icon} {domainInfo.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of ~{totalQuestions}
          </span>
        </div>
        <Progress value={(questionNumber / totalQuestions) * 100} className="h-2" />
      </div>

      {/* Scenario Context */}
      {question.scenarioContext && (
        <Card className="mb-4 bg-muted/30 border-muted">
          <CardContent className="pt-4">
            <p className="text-sm italic text-muted-foreground">
              {question.scenarioContext}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const showAsCorrect = showFeedback && option.isCorrect;
            const showAsIncorrect = showFeedback && isSelected && !option.isCorrect;

            return (
              <motion.button
                key={option.id}
                onClick={() => !showFeedback && onSelectOption(option.id)}
                disabled={showFeedback}
                whileHover={!showFeedback ? { scale: 1.01 } : {}}
                whileTap={!showFeedback ? { scale: 0.99 } : {}}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  !showFeedback && isSelected && "border-primary bg-primary/5",
                  !showFeedback && !isSelected && "border-muted hover:border-primary/50",
                  showAsCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                  showAsIncorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
                  showFeedback && !showAsCorrect && !showAsIncorrect && "opacity-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                      showAsCorrect && "border-green-500 bg-green-500 text-white",
                      showAsIncorrect && "border-red-500 bg-red-500 text-white"
                    )}
                  >
                    {showAsCorrect && <CheckCircle2 className="w-4 h-4" />}
                    {showAsIncorrect && <XCircle className="w-4 h-4" />}
                    {!showFeedback && isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    "text-sm",
                    showAsCorrect && "font-medium text-green-700 dark:text-green-300",
                    showAsIncorrect && "text-red-700 dark:text-red-300"
                  )}>
                    {option.text}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </CardContent>
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className={cn(
              "mb-6",
              isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
            )}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className={cn(
                    "w-5 h-5 flex-shrink-0 mt-0.5",
                    isCorrect ? "text-green-600" : "text-amber-600"
                  )} />
                  <div>
                    <p className={cn(
                      "font-medium mb-1",
                      isCorrect ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"
                    )}>
                      {isCorrect ? "That's right!" : "Not quite — here's the key insight:"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit / Next Button */}
      {!showFeedback ? (
        <Button
          onClick={onSubmit}
          disabled={selectedOptions.length === 0}
          className="w-full gap-2"
          size="lg"
        >
          Submit Answer
          <ArrowRight className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          className="w-full gap-2"
          size="lg"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      )}
    </motion.div>
  );
}

// ============================================
// RESULTS SCREEN COMPONENT
// ============================================

interface ResultsScreenProps {
  session: AssessmentSession;
  onContinue: () => void;
}

function ResultsScreen({ session, onContinue }: ResultsScreenProps) {
  const results = session.results;
  if (!results) return null;

  const correctCount = session.responses.filter(r => r.isCorrect).length;
  const totalCount = session.responses.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      {/* Celebration Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
        <p className="text-muted-foreground">
          We now have a better understanding of your knowledge.
        </p>
      </motion.div>

      {/* Score Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center gap-8">
            <div>
              <p className="text-5xl font-bold text-primary">{correctCount}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-4xl text-muted-foreground">/</div>
            <div>
              <p className="text-5xl font-bold">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Growth Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {results.strengths.length > 0 && (
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-5 h-5" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.strengths.map(domain => (
                  <Badge key={domain} variant="secondary" className="bg-green-100 dark:bg-green-900/50">
                    {domainMetadata[domain].icon} {domainMetadata[domain].name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {results.growthAreas.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <TrendingUp className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.growthAreas.slice(0, 4).map(domain => (
                  <Badge key={domain} variant="secondary" className="bg-amber-100 dark:bg-amber-900/50">
                    {domainMetadata[domain].icon} {domainMetadata[domain].name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendation */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            Your Recommended Starting Point
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your responses, we suggest starting at the{" "}
            <span className="font-medium text-foreground">
              {results.recommendedPath.startingDifficulty}
            </span>{" "}
            level.
          </p>
          {results.recommendedPath.suggestedProblems.length > 0 && (
            <p className="text-sm">
              Try starting with: <span className="font-medium">{results.recommendedPath.suggestedProblems[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button size="lg" onClick={onContinue} className="gap-2">
        Start Learning
        <ArrowRight className="w-5 h-5" />
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        Your progress will be tracked, and we'll continue to adapt to your learning.
      </p>
    </motion.div>
  );
}

// ============================================
// MAIN ASSESSMENT PAGE
// ============================================

export default function AssessmentPage() {
  const router = useRouter();
  const { updateMasteryFromAssessment } = useSession();

  // Assessment state
  const [phase, setPhase] = useState<'welcome' | 'assessment' | 'results'>('welcome');
  const [engine] = useState(() => new AdaptiveAssessmentEngine());
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>();
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [evidenceCollected, setEvidenceCollected] = useState<MasteryEvidence[]>([]);

  // Initialize session
  const startAssessment = useCallback(() => {
    const newSession = engine.createSession(
      'diagnostic',
      Object.values(AssessmentDomain),
      AssessmentStakes.LOW
    );
    const startedSession = engine.startSession(newSession);
    setSession(startedSession);

    const firstQuestion = engine.selectNextQuestion(startedSession);
    setCurrentQuestion(firstQuestion);
    setQuestionStartTime(Date.now());
    setPhase('assessment');
  }, [engine]);

  // Handle skip
  const handleSkip = useCallback(() => {
    router.push('/problems');
  }, [router]);

  // Handle option selection
  const handleSelectOption = useCallback((optionId: string) => {
    if (currentQuestion?.questionType === 'multiple_select') {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  }, [currentQuestion]);

  // Handle submit answer
  const handleSubmitAnswer = useCallback(() => {
    if (!session || !currentQuestion) return;

    if (!showFeedback) {
      // First click: Submit and show feedback
      const responseTimeMs = Date.now() - questionStartTime;

      const { session: updatedSession, evidence } = engine.processResponse(
        session,
        currentQuestion.id,
        selectedOptions,
        responseTimeMs
      );

      setSession(updatedSession);
      setEvidenceCollected(prev => [...prev, evidence]);
      setIsCorrect(evidence.isCorrect);
      setShowFeedback(true);
    } else {
      // Second click: Move to next question or finish
      setShowFeedback(false);
      setSelectedOptions([]);
      setIsCorrect(undefined);

      if (session.adaptiveState.stoppingCriteriaMet || session.adaptiveState.questionsRemaining <= 0) {
        // Complete the assessment
        const profile = MasteryEngine.initializeProfile('current-user');
        const { session: completedSession } = engine.completeSession(session, profile);
        setSession(completedSession);
        setPhase('results');
      } else {
        // Next question
        const nextQuestion = engine.selectNextQuestion(session);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
          setQuestionStartTime(Date.now());
        } else {
          // No more questions available
          const profile = MasteryEngine.initializeProfile('current-user');
          const { session: completedSession } = engine.completeSession(session, profile);
          setSession(completedSession);
          setPhase('results');
        }
      }
    }
  }, [session, currentQuestion, selectedOptions, showFeedback, questionStartTime, engine]);

  // Handle continue after results
  const handleContinue = useCallback(() => {
    // Save mastery evidence to session context
    if (evidenceCollected.length > 0) {
      updateMasteryFromAssessment(evidenceCollected);
    }
    router.push('/problems');
  }, [evidenceCollected, updateMasteryFromAssessment, router]);

  // Calculate question number
  const questionNumber = session ? session.responses.length + (showFeedback ? 0 : 1) : 1;
  const totalQuestions = session ? Math.min(15, session.adaptiveState.questionsRemaining + session.responses.length + 1) : 15;

  return (
    <div className="container mx-auto p-4 py-8 min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={startAssessment} onSkip={handleSkip} />
        )}

        {phase === 'assessment' && currentQuestion && (
          <QuestionDisplay
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
            onSubmit={handleSubmitAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        )}

        {phase === 'results' && session && (
          <ResultsScreen key="results" session={session} onContinue={handleContinue} />
        )}
      </AnimatePresence>
    </div>
  );
}
