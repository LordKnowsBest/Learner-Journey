"use client";

import { useSession } from '@/context/SessionContext';
import { assessmentQuestions } from '@/lib/data';
import { Quiz } from '@/components/quiz';
import { useEffect, useState } from 'react';
import type { AssessmentQuestion } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Function to get 3 random post-test questions
const getPostTestQuestions = () => {
  const postTest = assessmentQuestions.filter(q => q.type === 'post-test');
  return postTest.sort(() => 0.5 - Math.random()).slice(0, 3);
};

export default function PostTestPage() {
  const { legacySession, submitPostTest } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  useEffect(() => {
    // Redirect if diagnostic not done or no nodes completed
    if (legacySession.diagnosticScore === null || legacySession.completedNodes.length === 0) {
      router.push('/graph');
    } else {
      setQuestions(getPostTestQuestions());
    }
  }, [legacySession, router]);

  const handleQuizComplete = (score: number) => {
    submitPostTest(score);
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading post-test...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Quiz
        questions={questions}
        onComplete={handleQuizComplete}
        title="Post-Test"
        description="Let's see how much you've learned!"
      />
    </div>
  );
}
