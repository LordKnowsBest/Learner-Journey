"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProblemById, getConceptById } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { useExplainability } from "@/context/ExplainabilityContext";
import { SocraticChat } from "@/components/socratic-chat";
import { ConceptCard } from "@/components/concept-card";
import { ExplainabilitySidebar, ExplainabilityToggle } from "@/components/explainability-sidebar";
import {
  Users,
  ChevronRight,
  CheckCircle,
  Lock,
  Lightbulb,
  BookOpen,
  MessageCircle,
  FileText,
  ArrowRight,
  Play,
  HelpCircle,
} from "lucide-react";
import type { ProblemScenario, InvestigationPhase } from "@/lib/types";

export default function InvestigatePage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;

  const {
    session,
    getCurrentProblem,
    completePhase,
    discoverConcept,
    updateInvestigationNotes,
    isConceptDiscovered,
    startProblem,
  } = useSession();

  const {
    logConceptRevealed,
    logPhaseTransition,
    logMasteryUpdate,
    updatePathExplanation,
  } = useExplainability();

  const [problem, setProblem] = useState<ProblemScenario | null>(null);
  const [activeTab, setActiveTab] = useState("scenario");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const p = getProblemById(problemId);
    if (p) {
      setProblem(p);
    } else {
      router.push("/problems");
    }
  }, [problemId, router]);

  const currentProgress = getCurrentProblem();

  // Initialize session if needed
  useEffect(() => {
    if (problemId && !currentProgress) {
      startProblem(problemId);
    }
  }, [problemId, currentProgress, startProblem]);

  useEffect(() => {
    if (currentProgress) {
      setNotes(currentProgress.investigationNotes);
    }
  }, [currentProgress]);

  // Check if we're in reflection mode (moved to top level)
  useEffect(() => {
    if (currentProgress?.status === "reflecting") {
      goToReflection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProgress, problemId, router]);

  if (!problem || !currentProgress) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[50vh]">
        <p>Loading investigation...</p>
      </div>
    );
  }

  const currentPhaseId = currentProgress.currentPhaseId;
  const currentPhase = problem.phases.find((p) => p.id === currentPhaseId);
  const completedPhasesCount = currentProgress.phasesProgress.filter(
    (p) => p.status === "completed"
  ).length;
  const progressPercent = (completedPhasesCount / problem.phases.length) * 100;

  const handlePhaseComplete = () => {
    if (currentPhaseId && currentPhase && problem) {
      // Discover concepts from this phase
      currentPhase.revealsConcepts.forEach((conceptId) => {
        if (!isConceptDiscovered(conceptId)) {
          const concept = getConceptById(conceptId);
          discoverConcept(conceptId, currentPhaseId);

          // Log to explainability
          logConceptRevealed({
            conceptId,
            conceptTitle: concept?.title || conceptId,
            phaseId: currentPhaseId,
            reason: `Concept was revealed as part of completing the "${currentPhase.title}" phase.`,
          });
        }
      });

      // Find next phase
      const currentIndex = problem.phases.findIndex(p => p.id === currentPhaseId);
      const nextPhase = problem.phases[currentIndex + 1];

      // Log phase transition
      logPhaseTransition({
        fromPhase: currentPhase.title,
        toPhase: nextPhase?.title || 'Reflection',
        conceptsDiscovered: currentProgress?.discoveredConcepts.length || 0,
        reason: `Student completed all activities in "${currentPhase.title}" and is ready to ${nextPhase ? 'explore the next phase' : 'reflect on their learning'}.`,
      });

      completePhase(currentPhaseId);
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    updateInvestigationNotes(value);
  };

  const handleConceptDiscover = (conceptId: string) => {
    if (currentPhaseId && !isConceptDiscovered(conceptId)) {
      const concept = getConceptById(conceptId);
      discoverConcept(conceptId, currentPhaseId);

      // Log to explainability
      logConceptRevealed({
        conceptId,
        conceptTitle: concept?.title || conceptId,
        phaseId: currentPhaseId,
        reason: 'Student actively discovered this concept through their investigation and discussion.',
      });
    }
  };

  const goToReflection = () => {
    router.push(`/reflect/${problemId}`);
  };





  return (
    <TooltipProvider delayDuration={300}>
      <div className="container mx-auto p-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <p className="text-muted-foreground">{problem.hook}</p>
            </div>
            <div className="flex items-start gap-4">
              {/* AI Transparency Toggle */}
              <ExplainabilityToggle />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-right cursor-help">
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                      Progress
                      <HelpCircle className="w-3 h-3" />
                    </p>
                    <Progress value={progressPercent} className="w-32 mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {completedPhasesCount} / {problem.phases.length} phases
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your progress through this investigation. Complete all phases to unlock reflection.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Scenario & Phases */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="scenario" className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Scenario</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Read the problem scenario and understand the stakeholders involved</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="investigate" className="flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" />
                        <span className="hidden sm:inline">Investigate</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Work through investigation phases and discover key concepts</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="chat" className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Ask Guide</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chat with the AI tutor who will ask questions to deepen your thinking</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value="notes" className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Notes</span>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Write down your thoughts, questions, and discoveries</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>

                {/* Scenario Tab */}
                <TabsContent value="scenario" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>The Situation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {problem.scenario.split("\n").map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stakeholders */}
                  <Card>
                    <CardHeader>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardTitle className="flex items-center gap-2 cursor-help">
                            <Users className="w-5 h-5" />
                            People Involved
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Stakeholders are people affected by this situation. Understanding their different viewpoints is key to ethical analysis.</p>
                        </TooltipContent>
                      </Tooltip>
                      <CardDescription>
                        Consider each person's perspective
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {problem.stakeholders.map((stakeholder) => (
                          <Tooltip key={stakeholder.name}>
                            <TooltipTrigger asChild>
                              <div className="p-3 rounded-lg bg-muted/50 cursor-help hover:bg-muted transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">
                                    {stakeholder.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {stakeholder.role}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {stakeholder.perspective}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Think about: How might {stakeholder.name}'s interests conflict with others? What would be fair from their point of view?</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Investigate Tab */}
                <TabsContent value="investigate" className="space-y-4">
                  {/* Phase Navigation */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Investigation Phases</CardTitle>
                      <CardDescription>
                        Work through each phase to understand the problem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {problem.phases.map((phase, index) => {
                          const phaseProgress = currentProgress.phasesProgress.find(
                            (p) => p.phaseId === phase.id
                          );
                          const isActive = phase.id === currentPhaseId;
                          const isCompleted = phaseProgress?.status === "completed";
                          const isLocked = phaseProgress?.status === "locked";

                          return (
                            <div
                              key={phase.id}
                              className={`p-3 rounded-lg border transition-all ${isActive
                                ? "border-primary bg-primary/5"
                                : isCompleted
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : isLocked
                                    ? "border-muted bg-muted/30 opacity-60"
                                    : "border-muted"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                    ? "bg-green-500 text-white"
                                    : isActive
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : isLocked ? (
                                    <Lock className="w-4 h-4" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{phase.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {phase.description}
                                  </p>
                                </div>
                                {isActive && (
                                  <Badge className="bg-primary">Current</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Phase Content */}
                  {currentPhase && (
                    <Card className="border-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-primary" />
                          {currentPhase.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-lg">{currentPhase.prompt}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Questions to Consider:
                          </h4>
                          <ul className="space-y-2">
                            {currentPhase.questionsToConsider.map((q, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                                <span className="text-sm">{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Concepts to Discover */}
                        <div>
                          <h4 className="font-semibold mb-2">
                            Related Concepts:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentPhase.revealsConcepts.map((conceptId) => {
                              const concept = getConceptById(conceptId);
                              const discovered = isConceptDiscovered(conceptId);
                              return (
                                <Badge
                                  key={conceptId}
                                  variant={discovered ? "default" : "outline"}
                                  className={`cursor-pointer ${discovered
                                    ? "bg-green-500"
                                    : "hover:bg-primary/10"
                                    }`}
                                  onClick={() =>
                                    !discovered && handleConceptDiscover(conceptId)
                                  }
                                >
                                  {discovered && (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {concept?.title || conceptId}
                                </Badge>
                              );
                            })}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Click concepts as you learn about them
                          </p>
                        </div>

                        <Button
                          onClick={handlePhaseComplete}
                          className="w-full"
                          size="lg"
                        >
                          Complete This Phase
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* All phases complete - go to reflection */}
                  {!currentPhase && completedPhasesCount === problem.phases.length && (
                    <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                      <CardContent className="pt-6 text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h3 className="text-xl font-bold">
                          Investigation Complete!
                        </h3>
                        <p className="text-muted-foreground">
                          You've explored all phases. Now it's time to reflect on
                          what you've learned and propose your solution.
                        </p>
                        <Button onClick={goToReflection} size="lg">
                          Continue to Reflection
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Chat Tab */}
                <TabsContent value="chat">
                  <SocraticChat
                    problemId={problemId}
                    phaseId={currentPhaseId || ""}
                    discoveredConcepts={session.allDiscoveredConcepts}
                    onConceptDiscover={handleConceptDiscover}
                  />
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Investigation Notes</CardTitle>
                      <CardDescription>
                        Write down your thoughts, questions, and findings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="What are you thinking about this problem? What have you learned so far?"
                        className="min-h-[300px]"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Your notes are saved automatically
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Concepts Discovered */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="flex items-center gap-2 cursor-help">
                        <Lightbulb className="w-5 h-5" />
                        Concepts Discovered
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Key AI ethics concepts you've uncovered during your investigation. Click any concept to learn more and see related resources.</p>
                    </TooltipContent>
                  </Tooltip>
                  <CardDescription>
                    {currentProgress.discoveredConcepts.length} concepts found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentProgress.discoveredConcepts.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      <p>As you investigate, you'll discover key AI ethics concepts here.</p>
                      <p className="text-xs mt-2">Click on concept badges in the investigate tab or ask the AI guide about concepts.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.from(new Map(currentProgress.discoveredConcepts.map(d => [d.conceptId, d])).values()).map((discovery) => {
                        const concept = getConceptById(discovery.conceptId);
                        if (!concept) return null;
                        return (
                          <ConceptCard
                            key={discovery.conceptId}
                            concept={concept}
                            mastery={session.conceptMastery[discovery.conceptId] || 0}
                            compact
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hints (if stuck) */}
              {currentPhase && currentPhase.hints.length > 0 && (
                <Card>
                  <CardHeader>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-sm flex items-center gap-1 cursor-help">
                          Need a hint?
                          <HelpCircle className="w-3 h-3 text-muted-foreground" />
                        </CardTitle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>If you're stuck, these hints can help guide your thinking without giving away the answer.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <details className="cursor-pointer">
                      <summary className="text-sm text-muted-foreground hover:text-foreground">
                        Click to reveal a hint
                      </summary>
                      <ul className="mt-2 space-y-2">
                        {currentPhase.hints.map((hint, i) => (
                          <li
                            key={i}
                            className="text-sm p-2 bg-muted/50 rounded"
                          >
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explainability Sidebar for Stakeholder Trust */}
      <ExplainabilitySidebar />
    </TooltipProvider>
  );
}
