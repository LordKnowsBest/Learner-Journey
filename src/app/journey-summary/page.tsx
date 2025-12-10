"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { useSession } from "@/context/SessionContext";
import { conceptResources, problemScenarios, getConceptById, conceptLinks } from "@/lib/data";
import { ConceptCard } from "@/components/concept-card";
import { BadgeShowcase } from "@/components/gamification/badge-showcase";
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
  HelpCircle,
  Award,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export default function JourneySummaryPage() {
  const router = useRouter();
  const { session, legacySession, startNewSession } = useSession();

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
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.journey_overview}
            side="bottom"
          >
            <h1 className="text-3xl font-bold cursor-help flex items-center justify-center gap-2">
              Your Learning Journey
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </h1>
          </EducationalTooltip>
          <p className="text-muted-foreground text-lg">
            Here's what you've accomplished exploring AI ethics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.stat_problems_solved}
            side="bottom"
          >
            <Card className="cursor-help">
              <CardContent className="pt-6 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{completedProblems.length}</p>
                <p className="text-sm text-muted-foreground">
                  Problems Solved
                </p>
              </CardContent>
            </Card>
          </EducationalTooltip>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.stat_concepts_discovered}
            side="bottom"
          >
            <Card className="cursor-help">
              <CardContent className="pt-6 text-center">
                <Lightbulb className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{discoveredConcepts}</p>
                <p className="text-sm text-muted-foreground">
                  Concepts Discovered
                </p>
              </CardContent>
            </Card>
          </EducationalTooltip>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.stat_average_mastery}
            side="bottom"
          >
            <Card className="cursor-help">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{masteryAvg}%</p>
                <p className="text-sm text-muted-foreground">
                  Average Mastery
                </p>
              </CardContent>
            </Card>
          </EducationalTooltip>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.stat_connections_made}
            side="bottom"
          >
            <Card className="cursor-help">
              <CardContent className="pt-6 text-center">
                <Network className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{discoveredLinks.length}</p>
                <p className="text-sm text-muted-foreground">
                  Connections Made
                </p>
              </CardContent>
            </Card>
          </EducationalTooltip>
        </div>

        {/* Badge Collection */}
        <EducationalTooltip
          definition={{
            id: "badge_collection",
            component: "JourneySummaryPage",
            content: "Badges earned through your learning journey - each representing a milestone achievement.",
            ethicalDesign: {
              principle: "Achievement Recognition",
              rationale: "Visual badges celebrate progress without creating unhealthy competition.",
              category: "engagement" as const,
              references: ["Self-Determination Theory", "Gamification Research"],
            },
            pedagogy: "Badges tied to meaningful learning milestones reinforce intrinsic motivation.",
            technical: "Badges automatically awarded when progress metrics meet unlock criteria.",
          }}
          side="top"
        >
          <div className="cursor-help">
            <BadgeShowcase showCategories={true} showProgress={true} />
          </div>
        </EducationalTooltip>

        {/* Concept Mastery */}
        <Card>
          <CardHeader>
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.concept_mastery_progress}
              side="right"
            >
              <CardTitle className="flex items-center gap-2 cursor-help">
                <Lightbulb className="w-5 h-5" />
                Concept Mastery
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </EducationalTooltip>
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
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.concept_connections}
                side="right"
              >
                <CardTitle className="flex items-center gap-2 cursor-help">
                  <Network className="w-5 h-5" />
                  Connections You've Made
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </EducationalTooltip>
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
              <EducationalTooltip
                definition={{
                  id: "problems_investigated",
                  component: "JourneySummaryPage",
                  content: "Ethical dilemmas you've fully explored, including investigation and reflection phases.",
                  ethicalDesign: {
                    principle: "Engagement History",
                    rationale: "Reviewing completed problems reinforces learning and shows progress.",
                    category: "engagement" as const,
                    references: ["Spaced Repetition Research"],
                  },
                  pedagogy: "Seeing completed work builds confidence and encourages continued exploration.",
                  technical: "Problems marked complete after all phases and reflections submitted.",
                }}
                side="right"
              >
                <CardTitle className="flex items-center gap-2 cursor-help">
                  <Target className="w-5 h-5" />
                  Problems You've Investigated
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </EducationalTooltip>
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

        {/* Post-Test Call-to-Action */}
        {legacySession.diagnosticScore !== null && completedProblems.length > 0 && legacySession.postTestScore === null && (
          <EducationalTooltip
            definition={{
              id: "post_test_cta",
              component: "JourneySummaryPage",
              content: "Take the final assessment to measure your learning progress.",
              ethicalDesign: {
                principle: "Growth Measurement",
                rationale: "Post-tests celebrate learning gains rather than judging absolute performance.",
                category: "engagement" as const,
                references: ["Formative Assessment Research"],
              },
              pedagogy: "Comparing pre and post scores helps learners see their growth.",
              technical: "Available after completing diagnostic and at least one problem.",
            }}
            side="top"
          >
            <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  Ready for Your Final Assessment!
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  You've completed {completedProblems.length} problem{completedProblems.length > 1 ? 's' : ''} and discovered {discoveredConcepts} concepts.
                  Take the post-test to see how much you've learned!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Diagnostic: {Math.round(legacySession.diagnosticScore)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedProblems.length} Problem{completedProblems.length > 1 ? 's' : ''} Completed</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/post-test")}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Take Post-Test Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </EducationalTooltip>
        )}

        {/* Already Completed Post-Test */}
        {legacySession.postTestScore !== null && (
          <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-300">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                Journey Complete!
              </CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">
                You've completed your learning journey. Here's your growth summary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {Math.round(legacySession.diagnosticScore || 0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Pre-Test</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {Math.round(legacySession.postTestScore)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Post-Test</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    +{Math.round(legacySession.postTestScore - (legacySession.diagnosticScore || 0))}%
                  </p>
                  <p className="text-xs text-muted-foreground">Growth</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/results")}
                variant="outline"
                className="w-full mt-4 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                View Detailed Results
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* What's Next */}
        <Card className="border-primary">
          <CardHeader>
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.whats_next_section}
              side="right"
            >
              <CardTitle className="flex items-center gap-2 cursor-help">
                <BookOpen className="w-5 h-5" />
                What's Next?
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </EducationalTooltip>
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
            <EducationalTooltip
              definition={{
                id: "explore_more_problems",
                component: "JourneySummaryPage",
                content: "Continue your learning journey by investigating more ethical dilemmas.",
                ethicalDesign: {
                  principle: "Continued Learning",
                  rationale: "Easy navigation supports self-directed exploration at your own pace.",
                  category: "autonomy" as const,
                },
                pedagogy: "Multiple entry points and clear navigation support varied learning approaches.",
              }}
              side="top"
            >
              <Button
                onClick={() => router.push("/problems")}
                className="flex-1"
                size="lg"
              >
                Explore More Problems
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </EducationalTooltip>
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.start_fresh_button}
              side="top"
            >
              <Button
                variant="outline"
                onClick={startNewSession}
                className="flex-1"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Start Fresh
              </Button>
            </EducationalTooltip>
          </CardFooter>
        </Card>

        {/* Encouragement */}
        <EducationalTooltip
          definition={{
            id: "journey_encouragement",
            component: "JourneySummaryPage",
            content: "AI ethics is about thoughtful consideration, not perfect answers.",
            ethicalDesign: {
              principle: "Growth Mindset",
              rationale: "Encouraging messages reinforce that learning is a journey, not a destination.",
              category: "engagement" as const,
              references: ["Carol Dweck - Growth Mindset"],
            },
            pedagogy: "Framing ethics as ongoing inquiry rather than right/wrong answers supports deeper thinking.",
            technical: "Encouragement displays regardless of progress state.",
          }}
          side="top"
        >
          <div className="text-center py-8 cursor-help">
            <p className="text-muted-foreground">
              Remember: There are no perfect answers in AI ethics - just thoughtful
              consideration of different perspectives.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Keep questioning, keep learning!
            </p>
          </div>
        </EducationalTooltip>
      </div>
    </div>
  );
}
