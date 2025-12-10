"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { problemScenarios } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { PathRouter } from "@/lib/engines/PathRouter";
import {
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Play,
  HelpCircle,
  Sparkles,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
} from "lucide-react";

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
  const {
    startProblem,
    session,
    legacySession,
    assessmentState,
    hasCompletedDiagnostic,
    getRecommendedDifficulty,
    getMasterySummary,
  } = useSession();
  const router = useRouter();

  // Get mastery-based recommendations
  const pathRouter = useMemo(() => new PathRouter(), []);

  const { recommendations, progressSummary, recommendedDifficulty, hasTakenAssessment } = useMemo(() => {
    const profile = assessmentState?.masteryProfile || null;
    const hasAssessment = hasCompletedDiagnostic();

    return {
      recommendations: pathRouter.getRecommendedNodes(profile, 3),
      progressSummary: pathRouter.getProgressSummary(profile),
      recommendedDifficulty: getRecommendedDifficulty(),
      hasTakenAssessment: hasAssessment,
    };
  }, [assessmentState?.masteryProfile, pathRouter, hasCompletedDiagnostic, getRecommendedDifficulty]);

  // Get recommended problem IDs based on mastery
  const recommendedProblemIds = useMemo(() => {
    const recommendedNodeIds = recommendations.map(r => r.node.relatedScenarioId).filter(Boolean);
    return new Set(recommendedNodeIds);
  }, [recommendations]);

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

        {/* Soft Recommendation Banner - Encourages but doesn't block */}
        {!hasTakenAssessment && (
          <Card className="mb-8 border-primary/30 bg-primary/5 dark:bg-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Get Personalized Recommendations
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Take a quick 5-minute assessment to help us understand your current knowledge.
                    We&apos;ll then recommend problems that match your skill level and highlight
                    areas where you can grow the most.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push('/assessment')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Take Assessment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                    >
                      I&apos;ll explore on my own
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mastery Progress Summary - Only show if assessment taken */}
        {hasTakenAssessment && progressSummary && (
          <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Your Learning Progress</h3>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {progressSummary.overallProgress}% Complete
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {progressSummary.masteredNodes}
                  </p>
                  <p className="text-xs text-muted-foreground">Mastered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {progressSummary.inProgressNodes}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">
                    {progressSummary.notStartedNodes}
                  </p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
              {progressSummary.areasForGrowth.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Focus areas for growth:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {progressSummary.areasForGrowth.slice(0, 3).map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs capitalize">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Problem Cards */}
        <div className="grid gap-6">
          {problemScenarios.map((problem) => {
            const status = getProblemStatus(problem.id);
            const isInProgress = status === 'investigating' || status === 'reflecting';
            const isRecommended = recommendedProblemIds.has(problem.id) ||
              (hasTakenAssessment && problem.difficulty === recommendedDifficulty);
            const matchesDifficulty = problem.difficulty === recommendedDifficulty;

            return (
              <Card
                key={problem.id}
                className={`transition-all hover:shadow-lg ${
                  isInProgress ? 'ring-2 ring-primary' : ''
                } ${isRecommended && !isInProgress ? 'ring-1 ring-amber-400/50' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-2xl">{problem.title}</CardTitle>
                        {isRecommended && hasTakenAssessment && (
                          <EducationalTooltip
                            definition={{
                              id: "recommended_problem",
                              component: "ProblemsPage",
                              content: "This problem matches your current skill level based on your assessment results.",
                              ethicalDesign: {
                                principle: "Personalized Learning",
                                rationale: "Recommendations based on assessment help students find appropriately challenging content.",
                                category: "engagement",
                                references: ["Zone of Proximal Development", "Adaptive Learning Theory"],
                              },
                              pedagogy: "We recommend problems that stretch your abilities without overwhelming you.",
                            }}
                            side="top"
                          >
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 cursor-help">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Recommended
                            </Badge>
                          </EducationalTooltip>
                        )}
                      </div>
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
