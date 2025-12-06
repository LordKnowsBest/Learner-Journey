"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { problemScenarios } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { Clock, Users, ArrowRight, CheckCircle, Play, HelpCircle } from "lucide-react";

// Tooltip definitions for problems page
const problemsTooltips = {
  difficulty: {
    beginner: "A great starting point. This problem introduces fundamental AI ethics concepts with guided support.",
    intermediate: "Builds on basic concepts. Requires some prior understanding and deeper critical thinking.",
    advanced: "Complex ethical dilemmas with multiple perspectives. Best after completing easier problems.",
  },
  estimatedTime: "Approximate time to complete the investigation. Actual time may vary based on your pace.",
  stakeholders: "Different people affected by this situation. You'll consider each perspective during investigation.",
  tags: "Key themes and concepts covered in this problem.",
  conceptsDiscovered: "Total AI ethics concepts you've learned across all problems.",
};

export default function ProblemsPage() {
  const { startProblem, session } = useSession();

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
    <TooltipProvider delayDuration={300}>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={`cursor-help ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{problemsTooltips.difficulty[problem.difficulty as keyof typeof problemsTooltips.difficulty]}</p>
                          </TooltipContent>
                        </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <Clock className="w-4 h-4" />
                            <span>{problem.estimatedTime} min</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{problemsTooltips.estimatedTime}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <Users className="w-4 h-4" />
                            <span>{problem.stakeholders.length} stakeholders</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{problemsTooltips.stakeholders}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Stakeholders Preview */}
                    <div className="flex flex-wrap gap-2">
                      {problem.stakeholders.map((stakeholder) => (
                        <Tooltip key={stakeholder.name}>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-help">
                              {stakeholder.name} ({stakeholder.role})
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{stakeholder.perspective}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>

                    {/* Tags */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-wrap gap-2 cursor-help">
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{problemsTooltips.tags}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>

                  <CardFooter>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => startProblem(problem.id)}
                          className="w-full"
                          size="lg"
                        >
                          {isInProgress ? 'Continue Investigation' : 'Start Investigation'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isInProgress ? 'Pick up where you left off' : 'Begin exploring this ethical dilemma'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Concepts Discovered Counter */}
          {session.allDiscoveredConcepts.length > 0 && (
            <Card className="mt-8 bg-muted/50">
              <CardContent className="pt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center cursor-help">
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        Concepts Discovered So Far
                        <HelpCircle className="w-3 h-3" />
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {session.allDiscoveredConcepts.length}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{problemsTooltips.conceptsDiscovered}</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
