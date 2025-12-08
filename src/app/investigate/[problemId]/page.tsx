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
import { MasteryGate } from "@/components/investigate/mastery-gate";
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
    startProblem,
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
      const progress = getCurrentProblem();

      if (!progress || progress.scenarioId !== problemId) {
        startProblem(problemId);
      }
    } else {
      router.push("/problems");
    }
  }, [problemId, router, startProblem, getCurrentProblem]);

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
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="What are you thinking about this problem? What have you learned so far?"
            className="min-h-[300px]"
          />
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
        </div >

        {/* Explainability Sidebar for Stakeholder Trust */}
        < ExplainabilitySidebar />
    </TooltipProvider >
  );
}
