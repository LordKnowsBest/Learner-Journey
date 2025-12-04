"use client";

import { useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, Rocket, Loader2 } from 'lucide-react';

export default function ResultsPage() {
  const { session, startNewSession } = useSession();
  const router = useRouter();
  const { diagnosticScore, postTestScore } = session;

  useEffect(() => {
    if (diagnosticScore === null || postTestScore === null) {
      router.push('/');
    }
  }, [diagnosticScore, postTestScore, router]);

  if (diagnosticScore === null || postTestScore === null) {
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading results...</p>
        </div>
    );
  }
  
  const improvement = Math.round(postTestScore - diagnosticScore);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 text-center animate-fade-in">
      <div className="mb-8">
        <Award className="h-20 w-20 text-yellow-500 mx-auto animate-bounce" />
        <h1 className="text-4xl font-bold font-headline mt-4">🎉 Congratulations! 🎉</h1>
        <p className="text-xl text-muted-foreground mt-2">You've completed the learning journey. Here are your results.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-muted-foreground font-medium">Pre-Test Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold">{Math.round(diagnosticScore)}%</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-muted-foreground font-medium">Post-Test Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-primary">{Math.round(postTestScore)}%</p>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-primary/10">
          <CardHeader>
            <CardTitle className="text-primary font-medium flex items-center justify-center gap-2">
                <TrendingUp />
                Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-primary">
                {improvement >= 0 ? `+${improvement}`: improvement}%
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-xl">
        You've mastered AI Ethics basics! <Rocket className="inline-block h-6 w-6" />
      </p>

      <Button onClick={startNewSession} size="lg" className="mt-6">
        Start New Session
      </Button>
    </div>
  );
}
