"use client";

import { useState } from 'react';
import type { AssessmentQuestion, QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

// Tooltip definitions for quiz interface
const quizTooltips = {
  progress: "Shows how far you are through the quiz. Complete all questions to see your results.",
  question: "Read carefully and select the answer that best fits. There's only one correct answer per question.",
  options: "Click on an option to select it. You can change your answer before moving to the next question.",
  nextButton: "Move to the next question. You must select an answer first.",
  submitButton: "Submit your quiz to see your results. Make sure you've answered all questions.",
  results: "Your quiz results show your score and which questions you got right or wrong.",
  explanation: "This explanation helps you understand why this answer is correct.",
  continueButton: "Continue to the next section. Your quiz results have been saved.",
};

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
      <TooltipProvider delayDuration={300}>
        <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
          <CardHeader>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-2xl font-bold cursor-help flex items-center gap-2">
                  {title} - Results
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{quizTooltips.results}</p>
              </TooltipContent>
            </Tooltip>
            <CardDescription>Here's how you did!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center cursor-help">
                  <p className="text-lg text-muted-foreground">Your Score</p>
                  <p className="text-6xl font-bold text-primary">{Math.round(score)}%</p>
                  <p className="text-muted-foreground">You got {correctAnswers} out of {questions.length} questions right.</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{score >= 80 ? "Excellent work! You've demonstrated strong understanding." : score >= 60 ? "Good progress! Review the explanations below to strengthen your understanding." : "Keep learning! Review the explanations to build your understanding."}</p>
              </TooltipContent>
            </Tooltip>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <Tooltip key={'id' in q ? q.id : i}>
                  <TooltipTrigger asChild>
                    <Alert variant={answers[i] === q.correctAnswer ? "default" : "destructive"} className="bg-card cursor-help">
                       {answers[i] === q.correctAnswer ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <AlertTitle className="font-bold">{q.question}</AlertTitle>
                      <AlertDescription>
                        Your answer: {answers[i] || 'Not answered'} <br />
                        Correct answer: {q.correctAnswer}
                        {'explanation' in q && <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>}
                      </AlertDescription>
                    </Alert>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{answers[i] === q.correctAnswer ? "You got this one right!" : "Review this concept to strengthen your understanding."}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => onComplete(score, correctAnswers, questions.length)} className="w-full">
                  Continue
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{quizTooltips.continueButton}</p>
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description} - Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Progress value={progress} className="mt-2" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{quizTooltips.progress}</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-lg font-semibold cursor-help">{currentQuestion.question}</p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{quizTooltips.question}</p>
            </TooltipContent>
          </Tooltip>
          <RadioGroup
            value={answers[currentQuestionIndex] || ''}
            onValueChange={handleOptionChange}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">{option}</Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Click to select this answer</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          {currentQuestionIndex < questions.length - 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleNext} className="w-full" disabled={!answers[currentQuestionIndex]}>
                  Next
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{!answers[currentQuestionIndex] ? "Select an answer to continue" : quizTooltips.nextButton}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSubmit} className="w-full" disabled={!answers[currentQuestionIndex]}>
                  Submit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{!answers[currentQuestionIndex] ? "Select an answer to submit" : quizTooltips.submitButton}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
