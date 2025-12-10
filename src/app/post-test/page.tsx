"use client";

import { useSession } from '@/context/SessionContext';
import { assessmentQuestions } from '@/lib/data';
import { Quiz } from '@/components/quiz';
import { useEffect, useState } from 'react';
import type { AssessmentQuestion } from '@/lib/types';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Function to get 5 random post-test questions (same as diagnostic for fair comparison)
const getPostTestQuestions = () => {
  const postTest = assessmentQuestions.filter(q => q.type === 'post-test');
  // If not enough post-test questions, include some diagnostic ones
  if (postTest.length < 5) {
    const diagnostic = assessmentQuestions.filter(q => q.type === 'diagnostic');
    const combined = [...postTest, ...diagnostic];
    return combined.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
  return postTest.sort(() => 0.5 - Math.random()).slice(0, 5);
};

export default function PostTestPage() {
  const { session, legacySession, submitPostTest } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Check eligibility: diagnostic completed AND at least one problem completed
  const completedProblems = session.problemsProgress.filter(p => p.status === 'completed');
  const hasCompletedDiagnostic = legacySession.diagnosticScore !== null;
  const hasCompletedProblem = completedProblems.length > 0;
  const isEligible = hasCompletedDiagnostic && hasCompletedProblem;

  useEffect(() => {
    if (isEligible) {
      setQuestions(getPostTestQuestions());
      setIsReady(true);
    }
  }, [isEligible]);

  const handleQuizComplete = (score: number) => {
    submitPostTest(score);
  };

  // Not eligible - show requirements
  if (!isEligible) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <div>
                <CardTitle>Not Ready for Post-Test Yet</CardTitle>
                <CardDescription>
                  Complete these steps before taking your final assessment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                hasCompletedDiagnostic
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-muted'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  hasCompletedDiagnostic ? 'bg-green-500 text-white' : 'bg-muted-foreground/20'
                }`}>
                  {hasCompletedDiagnostic ? '✓' : '1'}
                </div>
                <span>Complete the diagnostic assessment</span>
                {!hasCompletedDiagnostic && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => router.push('/diagnostic')}
                  >
                    Take Diagnostic
                  </Button>
                )}
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                hasCompletedProblem
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-muted'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  hasCompletedProblem ? 'bg-green-500 text-white' : 'bg-muted-foreground/20'
                }`}>
                  {hasCompletedProblem ? '✓' : '2'}
                </div>
                <span>Complete at least one problem investigation</span>
                {!hasCompletedProblem && hasCompletedDiagnostic && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => router.push('/problems')}
                  >
                    Explore Problems
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading questions
  if (!isReady || questions.length === 0) {
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
        title="Post-Test Assessment"
        description={`Let's measure what you've learned! Your diagnostic score was ${legacySession.diagnosticScore}%.`}
      />
    </div>
  );
}
