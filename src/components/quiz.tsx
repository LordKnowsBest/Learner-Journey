"use client";

import { useState } from 'react';
import type { AssessmentQuestion, QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { EducationalTooltip } from '@/components/ui/educational-tooltip';
import { ethicalTooltipDefinitions } from '@/lib/ethical-design-tooltips';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

type Question = AssessmentQuestion | QuizQuestion;

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, correctAnswers: number, totalQuestions: number) => void;
  title: string;
  description: string;
}

export function Quiz({ questions, onComplete, title, description }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateResults = () => {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const score = (correctAnswers / questions.length) * 100;
    return { score, correctAnswers };
  };

  if (showResults) {
    const { score, correctAnswers } = calculateResults();
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
        <CardHeader>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.quiz_results_display}
            side="right"
          >
            <CardTitle className="text-2xl font-bold cursor-help flex items-center gap-2">
              {title} - Results
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
          </EducationalTooltip>
          <CardDescription>Here's how you did!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EducationalTooltip
            definition={{
              id: "quiz_score_display",
              component: "Quiz",
              content: score >= 80
                ? "Excellent work! You've demonstrated strong understanding."
                : score >= 60
                ? "Good progress! Review the explanations below to strengthen your understanding."
                : "Keep learning! Review the explanations to build your understanding.",
              ethicalDesign: {
                principle: "Growth-Oriented Feedback",
                rationale: "Scores are milestones, not judgments. Every learner can improve with practice.",
                category: "fairness",
                references: ["Dweck Growth Mindset"],
              },
              pedagogy: "Feedback focuses on next steps, not fixed ability labels.",
            }}
            side="top"
          >
            <div className="text-center cursor-help">
              <p className="text-lg text-muted-foreground">Your Score</p>
              <p className="text-6xl font-bold text-primary">{Math.round(score)}%</p>
              <p className="text-muted-foreground">You got {correctAnswers} out of {questions.length} questions right.</p>
            </div>
          </EducationalTooltip>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <EducationalTooltip
                key={'id' in q ? q.id : i}
                definition={{
                  id: `quiz_result_${i}`,
                  component: "Quiz",
                  content: answers[i] === q.correctAnswer
                    ? "You got this one right!"
                    : "Review this concept to strengthen your understanding.",
                  ethicalDesign: {
                    principle: "Learning from Assessment",
                    rationale: "Every question is a learning opportunity, whether correct or not.",
                    category: "fairness",
                    references: ["Black & Wiliam 1998 - Formative Assessment"],
                  },
                  pedagogy: "Explanations turn mistakes into learning moments.",
                }}
                side="left"
              >
                <Alert variant={answers[i] === q.correctAnswer ? "default" : "destructive"} className="bg-card cursor-help">
                  {answers[i] === q.correctAnswer ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle className="font-bold">{q.question}</AlertTitle>
                  <AlertDescription>
                    Your answer: {answers[i] || 'Not answered'} <br />
                    Correct answer: {q.correctAnswer}
                    {'explanation' in q && <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>}
                  </AlertDescription>
                </Alert>
              </EducationalTooltip>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.quiz_retry_option}
            side="top"
          >
            <Button onClick={() => onComplete(score, correctAnswers, questions.length)} className="w-full">
              Continue
            </Button>
          </EducationalTooltip>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description} - Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.quiz_progress_bar}
          side="top"
        >
          <div className="cursor-help">
            <Progress value={progress} className="mt-2" />
          </div>
        </EducationalTooltip>
      </CardHeader>
      <CardContent className="space-y-6">
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.quiz_question_display}
          side="top"
        >
          <p className="text-lg font-semibold cursor-help flex items-center gap-2">
            {currentQuestion.question}
            <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </p>
        </EducationalTooltip>
        <RadioGroup
          value={answers[currentQuestionIndex] || ''}
          onValueChange={handleOptionChange}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <EducationalTooltip
              key={index}
              definition={ethicalTooltipDefinitions.quiz_answer_options}
              side="right"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">{option}</Label>
              </div>
            </EducationalTooltip>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        {currentQuestionIndex < questions.length - 1 ? (
          <EducationalTooltip
            definition={{
              id: "quiz_next_button",
              component: "Quiz",
              content: !answers[currentQuestionIndex]
                ? "Select an answer to continue"
                : "Move to the next question.",
              ethicalDesign: {
                principle: "Paced Progression",
                rationale: "Requiring answers before progression ensures engagement without rushing.",
                category: "autonomy",
              },
              pedagogy: "Step-by-step progression supports focus and reflection.",
            }}
            side="top"
          >
            <Button onClick={handleNext} className="w-full" disabled={!answers[currentQuestionIndex]}>
              Next
            </Button>
          </EducationalTooltip>
        ) : (
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.quiz_submit_button}
            side="top"
          >
            <Button onClick={handleSubmit} className="w-full" disabled={!answers[currentQuestionIndex]}>
              Submit
            </Button>
          </EducationalTooltip>
        )}
      </CardFooter>
    </Card>
  );
}
