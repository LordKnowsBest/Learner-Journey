"use client";

import { useState } from 'react';
import type { AssessmentQuestion, QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

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
          <CardTitle className="text-2xl font-bold">{title} - Results</CardTitle>
          <CardDescription>Here's how you did!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Your Score</p>
            <p className="text-6xl font-bold text-primary">{Math.round(score)}%</p>
            <p className="text-muted-foreground">You got {correctAnswers} out of {questions.length} questions right.</p>
          </div>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Alert key={q.id || i} variant={answers[i] === q.correctAnswer ? "default" : "destructive"} className="bg-card">
                 {answers[i] === q.correctAnswer ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle className="font-bold">{q.question}</AlertTitle>
                <AlertDescription>
                  Your answer: {answers[i] || 'Not answered'} <br />
                  Correct answer: {q.correctAnswer}
                  {'explanation' in q && <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onComplete(score, correctAnswers, questions.length)} className="w-full">
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description} - Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">{currentQuestion.question}</p>
        <RadioGroup
          value={answers[currentQuestionIndex] || ''}
          onValueChange={handleOptionChange}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">{option}</Label>
            </div>
))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNext} className="w-full" disabled={!answers[currentQuestionIndex]}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="w-full" disabled={!answers[currentQuestionIndex]}>
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
