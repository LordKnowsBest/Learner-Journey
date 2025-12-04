"use client";

import { useSession } from '@/context/SessionContext';
import { assessmentQuestions } from '@/lib/data';
import { Quiz } from '@/components/quiz';
import { useEffect, useState } from 'react';
import type { AssessmentQuestion } from '@/lib/types';
import { Loader2 } from 'lucide-react';

// Function to get 5 random diagnostic questions
const getDiagnosticQuestions = () => {
  const diagnostic = assessmentQuestions.filter(q => q.type === 'diagnostic');
  // simple shuffle and take 5
  return diagnostic.sort(() => 0.5 - Math.random()).slice(0, 5);
};

export default function DiagnosticTestPage() {
  const { submitDiagnostic } = useSession();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  useEffect(() => {
    setQuestions(getDiagnosticQuestions());
  }, []);

  const handleQuizComplete = (score: number) => {
    submitDiagnostic(score);
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Quiz
        questions={questions}
        onComplete={handleQuizComplete}
        title="Diagnostic Test"
        description="Let's see what you already know"
      />
    </div>
  );
}
