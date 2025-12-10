"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { problemScenarios } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { Clock, Users, ArrowRight, CheckCircle, Play, HelpCircle, Loader2 } from "lucide-react";

// Helper to get difficulty-specific tooltip
const getDifficultyTooltip = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return ethicalTooltipDefinitions.problem_difficulty_beginner;
    case 'intermediate':
      return ethicalTooltipDefinitions.problem_difficulty_intermediate;
    case 'advanced':
      return ethicalTooltipDefinitions.problem_difficulty_advanced;
    default:
      return ethicalTooltipDefinitions.problem_difficulty_beginner;
  }
};

export default function ProblemsPage() {
  const { startProblem, session, legacySession } = useSession();
  const router = useRouter();

  // Gate: Require diagnostic to be completed before accessing problems
  useEffect(() => {
    if (legacySession.diagnosticScore === null) {
      router.push('/diagnostic');
    }
  }, [legacySession.diagnosticScore, router]);

  // Show loading while checking diagnostic status
  if (legacySession.diagnosticScore === null) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Checking your progress...</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProblemStatus = (problemId: string) => {
    const progress = session.problemsProgress.find(p => p.scenarioId === problemId);
    if (!progress) return 'not_started';
    return progress.status;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'investigating':
      case 'reflecting':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Play className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Investigation</h1>
          <p className="text-muted-foreground text-lg">
            Each problem presents a real ethical dilemma. Pick one that interests you!
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid gap-6">
          {problemScenarios.map((problem) => {
            const status = getProblemStatus(problem.id);
            const isInProgress = status === 'investigating' || status === 'reflecting';

            return (
              <Card
                key={problem.id}
                className={`transition-all hover:shadow-lg ${
                  isInProgress ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-1">{problem.title}</CardTitle>
                      <CardDescription className="text-base">
                        {problem.hook}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(status)}
                      <EducationalTooltip
                        definition={getDifficultyTooltip(problem.difficulty)}
                        side="left"
                      >
                        <Badge className={`cursor-help ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </Badge>
                      </EducationalTooltip>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Scenario Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {problem.scenario.split('\n')[0]}...
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <EducationalTooltip
                      definition={ethicalTooltipDefinitions.problem_estimated_time}
                      side="top"
                    >
                      <div className="flex items-center gap-1 cursor-help">
                        <Clock className="w-4 h-4" />
                        <span>{problem.estimatedTime} min</span>
                      </div>
                    </EducationalTooltip>
                    <EducationalTooltip
                      definition={ethicalTooltipDefinitions.problem_stakeholders}
                      side="top"
                    >
                      <div className="flex items-center gap-1 cursor-help">
                        <Users className="w-4 h-4" />
                        <span>{problem.stakeholders.length} stakeholders</span>
                      </div>
                    </EducationalTooltip>
                  </div>

                  {/* Stakeholders Preview */}
                  <div className="flex flex-wrap gap-2">
                    {problem.stakeholders.map((stakeholder) => (
                      <EducationalTooltip
                        key={stakeholder.name}
                        definition={{
                          id: `stakeholder_${stakeholder.name.replace(/\s/g, '_').toLowerCase()}`,
                          component: "ProblemsPage",
                          content: stakeholder.perspective,
                          ethicalDesign: {
                            principle: "Multi-Stakeholder Perspective",
                            rationale: "Understanding different viewpoints is essential for ethical reasoning.",
                            category: "fairness",
                            references: ["Value Sensitive Design", "Stakeholder Theory"],
                          },
                          pedagogy: `${stakeholder.name}'s perspective helps you consider diverse impacts.`,
                        }}
                        side="top"
                      >
                        <Badge variant="outline" className="text-xs cursor-help">
                          {stakeholder.name} ({stakeholder.role})
                        </Badge>
                      </EducationalTooltip>
                    ))}
                  </div>

                  {/* Tags */}
                  <EducationalTooltip
                    definition={ethicalTooltipDefinitions.problem_tags}
                    side="top"
                  >
                    <div className="flex flex-wrap gap-2 cursor-help">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </EducationalTooltip>
                </CardContent>

                <CardFooter>
                  <EducationalTooltip
                    definition={ethicalTooltipDefinitions.problem_start_investigation}
                    side="top"
                  >
                    <Button
                      onClick={() => startProblem(problem.id)}
                      className="w-full"
                      size="lg"
                    >
                      {isInProgress ? 'Continue Investigation' : 'Start Investigation'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </EducationalTooltip>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Concepts Discovered Counter */}
        {session.allDiscoveredConcepts.length > 0 && (
          <Card className="mt-8 bg-muted/50">
            <CardContent className="pt-6">
              <EducationalTooltip
                definition={{
                  id: "concepts_discovered_counter",
                  component: "ProblemsPage",
                  content: "Total AI ethics concepts you've learned across all problems.",
                  ethicalDesign: {
                    principle: "Progress Recognition",
                    rationale: "Visible progress motivates continued learning without comparison to others.",
                    category: "engagement",
                    references: ["Self-Determination Theory", "Gamification Research"],
                  },
                  pedagogy: "Counting concepts discovered emphasizes growth over performance.",
                  technical: "Tracked per session with persistence for returning users.",
                }}
                side="top"
              >
                <div className="text-center cursor-help">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Concepts Discovered So Far
                    <HelpCircle className="w-3 h-3" />
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {session.allDiscoveredConcepts.length}
                  </p>
                </div>
              </EducationalTooltip>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
