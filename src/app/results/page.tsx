"use client";

import { useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationalTooltip } from '@/components/ui/educational-tooltip';
import { ethicalTooltipDefinitions } from '@/lib/ethical-design-tooltips';
import { TrendingUp, Award, Rocket, Loader2, HelpCircle } from 'lucide-react';

export default function ResultsPage() {
  const { legacySession, startNewSession } = useSession();
  const router = useRouter();
  const { diagnosticScore, postTestScore } = legacySession;

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
        <EducationalTooltip
          definition={{
            id: "results_pretest_score",
            component: "ResultsPage",
            content: "Your knowledge level before starting the learning journey.",
            ethicalDesign: {
              principle: "Baseline Measurement",
              rationale: "Pre-test scores establish a baseline without judgment - everyone starts somewhere.",
              category: "fairness" as const,
            },
            pedagogy: "Pre-tests identify prior knowledge and personalize learning paths.",
            technical: "Score from diagnostic assessment at session start.",
          }}
          side="top"
        >
          <Card className="shadow-md cursor-help">
            <CardHeader>
              <CardTitle className="text-muted-foreground font-medium flex items-center justify-center gap-1">
                Pre-Test Score
                <HelpCircle className="w-3 h-3" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold">{Math.round(diagnosticScore)}%</p>
            </CardContent>
          </Card>
        </EducationalTooltip>

        <EducationalTooltip
          definition={{
            id: "results_posttest_score",
            component: "ResultsPage",
            content: "Your knowledge level after completing the learning journey.",
            ethicalDesign: {
              principle: "Growth Measurement",
              rationale: "Post-test measures growth, not absolute performance.",
              category: "engagement" as const,
            },
            pedagogy: "Post-tests validate learning and identify remaining gaps.",
            technical: "Score from final assessment after completing all problems.",
          }}
          side="top"
        >
          <Card className="shadow-md cursor-help">
            <CardHeader>
              <CardTitle className="text-muted-foreground font-medium flex items-center justify-center gap-1">
                Post-Test Score
                <HelpCircle className="w-3 h-3" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold text-primary">{Math.round(postTestScore)}%</p>
            </CardContent>
          </Card>
        </EducationalTooltip>

        <EducationalTooltip
          definition={{
            id: "results_improvement",
            component: "ResultsPage",
            content: "The difference between your pre-test and post-test scores, showing your growth.",
            ethicalDesign: {
              principle: "Growth Celebration",
              rationale: "Improvement highlights learning progress regardless of starting point.",
              category: "engagement" as const,
              references: ["Growth Mindset Research"],
            },
            pedagogy: "Focusing on improvement encourages continued learning.",
            technical: "Calculated as post-test score minus pre-test score.",
          }}
          side="top"
        >
          <Card className="shadow-md bg-primary/10 cursor-help">
            <CardHeader>
              <CardTitle className="text-primary font-medium flex items-center justify-center gap-2">
                <TrendingUp />
                Improvement
                <HelpCircle className="w-3 h-3" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold text-primary">
                {improvement >= 0 ? `+${improvement}`: improvement}%
              </p>
            </CardContent>
          </Card>
        </EducationalTooltip>
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
