"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/context/SessionContext";
import { conceptResources, problemScenarios, getConceptById, conceptLinks } from "@/lib/data";
import { ConceptCard } from "@/components/concept-card";
import {
  Trophy,
  Lightbulb,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  RefreshCw,
  Network,
} from "lucide-react";

export default function JourneySummaryPage() {
  const router = useRouter();
  const { session, startNewSession } = useSession();

  const completedProblems = session.problemsProgress.filter(
    (p) => p.status === "completed"
  );
  const totalConcepts = conceptResources.length;
  const discoveredConcepts = session.allDiscoveredConcepts.length;
  const masteryAvg =
    Object.values(session.conceptMastery).length > 0
      ? Math.round(
          Object.values(session.conceptMastery).reduce((a, b) => a + b, 0) /
            Object.values(session.conceptMastery).length
        )
      : 0;

  // Calculate total time (mock - would need actual tracking)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} minutes`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  // Get undiscovered concepts
  const undiscoveredConcepts = conceptResources.filter(
    (c) => !session.allDiscoveredConcepts.includes(c.id)
  );

  // Get concept connections for discovered concepts
  const discoveredLinks = conceptLinks.filter(
    (link) =>
      session.allDiscoveredConcepts.includes(link.fromConcept) &&
      session.allDiscoveredConcepts.includes(link.toConcept)
  );

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Your Learning Journey</h1>
          <p className="text-muted-foreground text-lg">
            Here's what you've accomplished exploring AI ethics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{completedProblems.length}</p>
              <p className="text-sm text-muted-foreground">
                Problems Solved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Lightbulb className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{discoveredConcepts}</p>
              <p className="text-sm text-muted-foreground">
                Concepts Discovered
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{masteryAvg}%</p>
              <p className="text-sm text-muted-foreground">
                Average Mastery
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Network className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{discoveredLinks.length}</p>
              <p className="text-sm text-muted-foreground">
                Connections Made
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Concept Mastery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Concept Mastery
            </CardTitle>
            <CardDescription>
              {discoveredConcepts} of {totalConcepts} concepts explored
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={(discoveredConcepts / totalConcepts) * 100}
              className="mb-6"
            />

            {session.allDiscoveredConcepts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.allDiscoveredConcepts.map((conceptId) => {
                  const concept = getConceptById(conceptId);
                  if (!concept) return null;
                  return (
                    <ConceptCard
                      key={conceptId}
                      concept={concept}
                      mastery={session.conceptMastery[conceptId] || 0}
                      compact
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Start investigating problems to discover concepts!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Concept Connections */}
        {discoveredLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Connections You've Made
              </CardTitle>
              <CardDescription>
                How the concepts relate to each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discoveredLinks.slice(0, 6).map((link, index) => {
                  const fromConcept = getConceptById(link.fromConcept);
                  const toConcept = getConceptById(link.toConcept);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <Badge variant="secondary">{fromConcept?.title}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {link.relationship.replace(/_/g, " ")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary">{toConcept?.title}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Problems Completed */}
        {completedProblems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Problems You've Investigated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedProblems.map((progress) => {
                  const problem = problemScenarios.find(
                    (p) => p.id === progress.scenarioId
                  );
                  if (!problem) return null;
                  return (
                    <div
                      key={progress.scenarioId}
                      className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div>
                        <p className="font-medium">{problem.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {progress.discoveredConcepts.length} concepts • {" "}
                          {progress.reflectionResponses.length} reflections
                        </p>
                      </div>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {undiscoveredConcepts.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Concepts still to explore:
                </p>
                <div className="flex flex-wrap gap-2">
                  {undiscoveredConcepts.slice(0, 5).map((concept) => (
                    <Badge key={concept.id} variant="outline">
                      {concept.title}
                    </Badge>
                  ))}
                  {undiscoveredConcepts.length > 5 && (
                    <Badge variant="outline">
                      +{undiscoveredConcepts.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {problemScenarios.filter(
              (p) => !completedProblems.find((cp) => cp.scenarioId === p.id)
            ).length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Problems waiting for you:
                </p>
                <div className="flex flex-wrap gap-2">
                  {problemScenarios
                    .filter(
                      (p) =>
                        !completedProblems.find((cp) => cp.scenarioId === p.id)
                    )
                    .map((problem) => (
                      <Badge key={problem.id} variant="secondary">
                        {problem.title}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/problems")}
              className="flex-1"
              size="lg"
            >
              Explore More Problems
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={startNewSession}
              className="flex-1"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Start Fresh
            </Button>
          </CardFooter>
        </Card>

        {/* Encouragement */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Remember: There are no perfect answers in AI ethics - just thoughtful
            consideration of different perspectives.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Keep questioning, keep learning!
          </p>
        </div>
      </div>
    </div>
  );
}
