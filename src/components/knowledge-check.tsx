"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Brain,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  AdaptiveQuestion,
  AssessmentDomain,
  AssessmentStakes,
  MasteryEvidence,
} from "@/lib/types";
import { getQuestionsByDomain, domainMetadata } from "@/lib/assessment-questions";
import { useSession } from "@/context/SessionContext";

// ============================================
// TYPES
// ============================================

interface KnowledgeCheckProps {
  domain: AssessmentDomain;
  conceptId?: string;
  triggerText?: string;
  onComplete?: (passed: boolean, masteryDelta: number) => void;
  questionCount?: number;
  className?: string;
}

interface QuickCheckProps {
  question: AdaptiveQuestion;
  onAnswer: (isCorrect: boolean, responseTimeMs: number) => void;
  onSkip: () => void;
  showHints?: boolean;
}

// ============================================
// QUICK CHECK COMPONENT (Single Question)
// ============================================

function QuickCheck({ question, onAnswer, onSkip, showHints = true }: QuickCheckProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());

  const handleSubmit = useCallback(() => {
    if (!selectedOption) return;

    const isCorrect = question.options.find(o => o.id === selectedOption)?.isCorrect || false;
    setShowFeedback(true);

    // Delay before moving on
    setTimeout(() => {
      onAnswer(isCorrect, Date.now() - startTime);
    }, 2000);
  }, [selectedOption, question, onAnswer, startTime]);

  const handleShowHint = useCallback(() => {
    if (question.hints && hintsUsed < question.hints.length) {
      setShowHint(true);
      setHintsUsed(h => h + 1);
    }
  }, [question.hints, hintsUsed]);

  const correctOption = question.options.find(o => o.isCorrect);
  const selectedIsCorrect = selectedOption ? question.options.find(o => o.id === selectedOption)?.isCorrect : false;

  return (
    <div className="space-y-4">
      {/* Question */}
      <p className="font-medium text-base">{question.question}</p>

      {/* Hint */}
      <AnimatePresence>
        {showHint && question.hints && hintsUsed > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {question.hints[hintsUsed - 1]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showAsCorrect = showFeedback && option.isCorrect;
          const showAsIncorrect = showFeedback && isSelected && !option.isCorrect;

          return (
            <motion.button
              key={option.id}
              onClick={() => !showFeedback && setSelectedOption(option.id)}
              disabled={showFeedback}
              whileHover={!showFeedback ? { scale: 1.01 } : {}}
              whileTap={!showFeedback ? { scale: 0.99 } : {}}
              className={cn(
                "w-full p-3 text-left rounded-lg border transition-all text-sm",
                !showFeedback && isSelected && "border-primary bg-primary/5",
                !showFeedback && !isSelected && "border-muted hover:border-primary/50",
                showAsCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                showAsIncorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
                showFeedback && !showAsCorrect && !showAsIncorrect && "opacity-50"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                    showAsCorrect && "border-green-500 bg-green-500 text-white",
                    showAsIncorrect && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {showAsCorrect && <CheckCircle2 className="w-3 h-3" />}
                  {showAsIncorrect && <XCircle className="w-3 h-3" />}
                </div>
                <span>{option.text}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-3 rounded-lg text-sm",
              selectedIsCorrect
                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
            )}
          >
            <p className={cn(
              "font-medium mb-1",
              selectedIsCorrect ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"
            )}>
              {selectedIsCorrect ? "Correct!" : "Not quite"}
            </p>
            <p className="text-muted-foreground text-xs">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {!showFeedback && (
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="flex-1"
            size="sm"
          >
            Check Answer
          </Button>
          {showHints && question.hints && hintsUsed < question.hints.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowHint}
              className="gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              Hint
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
          >
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================
// KNOWLEDGE CHECK CARD (Inline Trigger)
// ============================================

export function KnowledgeCheckTrigger({
  domain,
  conceptId,
  triggerText = "Check your understanding",
  onComplete,
  className,
}: KnowledgeCheckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const { recordKnowledgeCheck } = useSession();

  // Get questions for this domain
  const questions = getQuestionsByDomain(domain).slice(0, 3);
  const domainInfo = domainMetadata[domain];

  const handleAnswer = useCallback((isCorrect: boolean, responseTimeMs: number) => {
    const newResults = {
      correct: results.correct + (isCorrect ? 1 : 0),
      total: results.total + 1,
    };
    setResults(newResults);

    // Record evidence
    const question = questions[currentQuestionIndex];
    const evidence: MasteryEvidence = {
      id: `kc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      source: 'knowledge_check',
      questionId: question.id,
      domain,
      isCorrect,
      responseTimeMs,
      stakes: AssessmentStakes.LOW,
      weight: 0.8,
    };
    recordKnowledgeCheck(evidence);

    // Move to next question or complete
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setIsComplete(true);
        const passed = newResults.correct >= Math.ceil(questions.length / 2);
        const masteryDelta = passed ? 10 : 0;
        onComplete?.(passed, masteryDelta);
      }
    }, 500);
  }, [results, currentQuestionIndex, questions, domain, recordKnowledgeCheck, onComplete]);

  const handleSkip = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setResults(r => ({ ...r, total: r.total + 1 }));
    } else {
      setIsComplete(true);
      const passed = results.correct >= Math.ceil(questions.length / 2);
      onComplete?.(passed, 0);
    }
  }, [currentQuestionIndex, questions.length, results.correct, onComplete]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCurrentQuestionIndex(0);
    setResults({ correct: 0, total: 0 });
    setIsComplete(false);
  }, []);

  if (questions.length === 0) return null;

  return (
    <div className={className}>
      {/* Trigger Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{triggerText}</p>
                <p className="text-xs text-muted-foreground">
                  {questions.length} quick questions about {domainInfo.name.toLowerCase()}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.button>
      )}

      {/* Knowledge Check Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      {domainInfo.icon} {domainInfo.name}
                    </Badge>
                    {!isComplete && (
                      <span className="text-xs text-muted-foreground">
                        {currentQuestionIndex + 1} / {questions.length}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!isComplete ? (
                  <QuickCheck
                    question={questions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    onSkip={handleSkip}
                  />
                ) : (
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-block mb-3"
                    >
                      {results.correct >= Math.ceil(questions.length / 2) ? (
                        <Sparkles className="w-12 h-12 text-green-500" />
                      ) : (
                        <Brain className="w-12 h-12 text-amber-500" />
                      )}
                    </motion.div>
                    <p className="font-medium mb-1">
                      {results.correct >= Math.ceil(questions.length / 2)
                        ? "Great job!"
                        : "Keep learning!"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      You got {results.correct} out of {results.total} correct
                    </p>
                    <Button onClick={handleClose} size="sm">
                      Continue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// INLINE KNOWLEDGE CHECK (For Phase Completion)
// ============================================

interface InlineKnowledgeCheckProps {
  domains: AssessmentDomain[];
  onComplete: (passed: boolean, evidence: MasteryEvidence[]) => void;
  title?: string;
  description?: string;
}

export function InlineKnowledgeCheck({
  domains,
  onComplete,
  title = "Quick Knowledge Check",
  description = "Let's see what you've learned so far",
}: InlineKnowledgeCheckProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evidenceCollected, setEvidenceCollected] = useState<MasteryEvidence[]>([]);
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  // Get mixed questions from all domains
  const questions = domains.flatMap(d => getQuestionsByDomain(d).slice(0, 2)).slice(0, 5);

  const handleAnswer = useCallback((isCorrect: boolean, responseTimeMs: number) => {
    const question = questions[currentQuestionIndex];
    const evidence: MasteryEvidence = {
      id: `ikc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      source: 'phase_assessment',
      questionId: question.id,
      domain: question.domain,
      isCorrect,
      responseTimeMs,
      stakes: AssessmentStakes.MEDIUM,
      weight: 1.0,
    };

    const newEvidence = [...evidenceCollected, evidence];
    setEvidenceCollected(newEvidence);

    const newResults = {
      correct: results.correct + (isCorrect ? 1 : 0),
      total: results.total + 1,
    };
    setResults(newResults);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setIsComplete(true);
        const passed = newResults.correct >= Math.ceil(questions.length * 0.6);
        onComplete(passed, newEvidence);
      }
    }, 500);
  }, [currentQuestionIndex, questions, evidenceCollected, results, onComplete]);

  const handleSkip = useCallback(() => {
    const newResults = { ...results, total: results.total + 1 };
    setResults(newResults);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setIsComplete(true);
      const passed = newResults.correct >= Math.ceil(questions.length * 0.6);
      onComplete(passed, evidenceCollected);
    }
  }, [currentQuestionIndex, questions.length, results, evidenceCollected, onComplete]);

  if (questions.length === 0) {
    onComplete(true, []);
    return null;
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isComplete ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">
                {domainMetadata[questions[currentQuestionIndex].domain].icon}{" "}
                {domainMetadata[questions[currentQuestionIndex].domain].name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <QuickCheck
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              showHints={false}
            />
          </>
        ) : (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block mb-3"
            >
              {results.correct >= Math.ceil(questions.length * 0.6) ? (
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              ) : (
                <Brain className="w-12 h-12 text-amber-500" />
              )}
            </motion.div>
            <p className="font-medium mb-1">
              {results.correct >= Math.ceil(questions.length * 0.6)
                ? "You're making great progress!"
                : "Keep exploring the concepts!"}
            </p>
            <p className="text-sm text-muted-foreground">
              Score: {results.correct} / {results.total}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default KnowledgeCheckTrigger;
