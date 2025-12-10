"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckpointConfig,
  AssessmentSession,
  AdaptiveQuestion,
  AssessmentStakes,
  MasteryEvidence,
} from "@/lib/types";
import { AdaptiveAssessmentEngine } from "@/lib/engines/AdaptiveAssessmentEngine";
import { MasteryEngine } from "@/lib/engines/MasteryEngine";
import { useSession } from "@/context/SessionContext";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  RefreshCw,
  ArrowRight,
  Shield,
  Sparkles,
  Lock,
} from "lucide-react";

interface CheckpointAssessmentProps {
  checkpoint: CheckpointConfig;
  onComplete: (passed: boolean, score: number, evidence: MasteryEvidence[]) => void;
  onCancel?: () => void;
}

type AssessmentPhase = "intro" | "assessment" | "results";

export function CheckpointAssessment({
  checkpoint,
  onComplete,
  onCancel,
}: CheckpointAssessmentProps) {
  const { assessmentState, updateMasteryFromAssessment } = useSession();
  const [phase, setPhase] = useState<AssessmentPhase>("intro");
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [evidence, setEvidence] = useState<MasteryEvidence[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const engine = useMemo(() => new AdaptiveAssessmentEngine(), []);

  // Initialize session
  const initializeSession = useCallback(() => {
    const newSession = engine.createSession(
      "checkpoint",
      checkpoint.targetDomains,
      AssessmentStakes.HIGH
    );

    // Override with checkpoint-specific question count
    newSession.adaptiveState.questionsRemaining = checkpoint.questionCount;

    setSession(newSession);
    setTimeRemaining(checkpoint.timeLimit || null);
    setStartTime(Date.now());

    const firstQuestion = engine.selectNextQuestion(newSession);
    setCurrentQuestion(firstQuestion);
    setPhase("assessment");
  }, [engine, checkpoint]);

  // Timer effect
  useEffect(() => {
    if (phase !== "assessment" || timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeRemaining]);

  // Get or create profile for session completion
  const getProfileForCompletion = () => {
    return assessmentState?.masteryProfile || MasteryEngine.initializeProfile('checkpoint-user');
  };

  const handleTimeUp = () => {
    if (session) {
      const completed = engine.completeSession(
        session,
        getProfileForCompletion()
      );
      finishAssessment(completed.session, completed.results!);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    if (
      currentQuestion.questionType === "multiple_select"
    ) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitAnswer = () => {
    if (!session || !currentQuestion || selectedOptions.length === 0) return;

    const responseTime = startTime ? Date.now() - startTime : 5000;

    const result = engine.processResponse(
      session,
      currentQuestion.id,
      selectedOptions,
      responseTime
    );

    setSession(result.session);
    setEvidence((prev) => [...prev, result.evidence]);
    setLastAnswerCorrect(result.evidence.isCorrect);
    setShowFeedback(true);

    // Show feedback briefly for high-stakes
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptions([]);
      setStartTime(Date.now());

      // Check if assessment is complete
      if (
        result.session.adaptiveState.stoppingCriteriaMet ||
        result.session.responses.length >= checkpoint.questionCount
      ) {
        const completed = engine.completeSession(
          result.session,
          getProfileForCompletion()
        );
        finishAssessment(completed.session, completed.results!);
      } else {
        const nextQuestion = engine.selectNextQuestion(result.session);
        setCurrentQuestion(nextQuestion);
      }
    }, 1500);
  };

  const finishAssessment = (
    finalSession: AssessmentSession,
    results: NonNullable<AssessmentSession["results"]>
  ) => {
    setSession(finalSession);
    setPhase("results");

    // Update mastery from all evidence
    updateMasteryFromAssessment(evidence);

    // Determine pass/fail
    const passed = results.overallScore >= checkpoint.passingScore;
    onComplete(passed, results.overallScore, evidence);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = session
    ? (session.responses.length / checkpoint.questionCount) * 100
    : 0;

  // ============================================
  // RENDER: INTRO PHASE
  // ============================================
  if (phase === "intro") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 w-fit">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">{checkpoint.name}</CardTitle>
          <CardDescription className="text-base">
            {checkpoint.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Assessment Info */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{checkpoint.questionCount}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            {checkpoint.timeLimit && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">
                  {Math.floor(checkpoint.timeLimit / 60)}
                </p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              High-Stakes Assessment
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                Pass with {checkpoint.passingScore}% or higher to unlock new content
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-blue-500" />
                {checkpoint.timeLimit
                  ? `Complete within ${Math.floor(checkpoint.timeLimit / 60)} minutes`
                  : "No time limit"}
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 text-purple-500" />
                {checkpoint.onFail.maxRetries} retry attempts available
              </li>
            </ul>
          </div>

          {/* Topics Covered */}
          <div>
            <h4 className="font-medium mb-2">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {checkpoint.targetDomains.map((domain) => (
                <Badge key={domain} variant="secondary" className="capitalize">
                  {domain.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Rewards for Passing
            </h4>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {checkpoint.onPass.xpReward} XP
              </span>
              {checkpoint.onPass.awardBadge && (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Special Badge
                </span>
              )}
              {checkpoint.onPass.unlockContent &&
                checkpoint.onPass.unlockContent.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Lock className="h-4 w-4 text-green-500" />
                    Unlock {checkpoint.onPass.unlockContent.length} topics
                  </span>
                )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Not Ready Yet
            </Button>
          )}
          <Button onClick={initializeSession} className="flex-1">
            Begin Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ============================================
  // RENDER: ASSESSMENT PHASE
  // ============================================
  if (phase === "assessment" && currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              <Shield className="h-3 w-3 mr-1" />
              Checkpoint Assessment
            </Badge>
            {timeRemaining !== null && (
              <Badge
                variant={timeRemaining < 60 ? "destructive" : "secondary"}
                className="font-mono"
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Question {(session?.responses.length || 0) + 1} of{" "}
                {checkpoint.questionCount}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-4">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptions.includes(option.id);
                  const showCorrect =
                    showFeedback && option.isCorrect;
                  const showIncorrect =
                    showFeedback && isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !showFeedback && handleOptionSelect(option.id)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : showIncorrect
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                          : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            showCorrect
                              ? "border-green-500 bg-green-500"
                              : showIncorrect
                              ? "border-red-500 bg-red-500"
                              : isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/50"
                          }`}
                        >
                          {(isSelected || showCorrect) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                          {showIncorrect && (
                            <XCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg ${
                    lastAnswerCorrect
                      ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <p className="text-sm font-medium flex items-center gap-2">
                    {lastAnswerCorrect ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        Not quite right
                      </>
                    )}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOptions.length === 0 || showFeedback}
            className="w-full"
            size="lg"
          >
            {showFeedback ? "Loading next question..." : "Submit Answer"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ============================================
  // RENDER: RESULTS PHASE
  // ============================================
  if (phase === "results" && session?.results) {
    const passed = session.results.overallScore >= checkpoint.passingScore;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`mx-auto mb-4 p-6 rounded-full w-fit ${
              passed
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            }`}
          >
            {passed ? (
              <Trophy className="h-12 w-12 text-green-600" />
            ) : (
              <RefreshCw className="h-12 w-12 text-red-600" />
            )}
          </motion.div>

          <CardTitle className="text-2xl">
            {passed ? "Checkpoint Passed!" : "Keep Practicing"}
          </CardTitle>
          <CardDescription>
            {passed
              ? "Congratulations! You've demonstrated mastery of these concepts."
              : `You scored ${session.results.overallScore}%. You need ${checkpoint.passingScore}% to pass.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {session.results.overallScore}%
            </div>
            <p className="text-muted-foreground">
              {session.results.questionCount} questions completed
            </p>
          </div>

          {/* Domain Scores */}
          <div className="space-y-3">
            <h4 className="font-medium">Performance by Topic</h4>
            {Object.entries(session.results.domainScores).map(
              ([domain, score]) => (
                <div key={domain} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">
                      {domain.replace(/_/g, " ")}
                    </span>
                    <span className={score >= 70 ? "text-green-600" : "text-red-600"}>
                      {score}%
                    </span>
                  </div>
                  <Progress
                    value={score}
                    className={`h-2 ${
                      score >= 70
                        ? "[&>div]:bg-green-500"
                        : "[&>div]:bg-red-500"
                    }`}
                  />
                </div>
              )
            )}
          </div>

          {/* Rewards (if passed) */}
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800"
            >
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Rewards Earned
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  +{checkpoint.onPass.xpReward} XP
                </Badge>
                {checkpoint.onPass.awardBadge && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    <Trophy className="h-3 w-3 mr-1" />
                    {checkpoint.onPass.awardBadge.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Retry info (if failed) */}
          {!passed && (
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-medium mb-2">What&apos;s Next?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Review the concepts below and try again when you&apos;re ready.
                You can retry in {checkpoint.onFail.retryDelay} minutes.
              </p>
              {session.results.growthAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {session.results.growthAreas.map((area) => (
                    <Badge key={area} variant="outline" className="capitalize">
                      {area.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={() => onComplete(passed, session.results!.overallScore, evidence)} className="w-full">
            {passed ? "Continue Learning" : "Review & Try Again Later"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

export default CheckpointAssessment;
