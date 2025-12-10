"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { getProblemById, getConceptById } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { useExplainability } from "@/context/ExplainabilityContext";
import { useGamification } from "@/context/GamificationContext";
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
  } = useSession();

  const {
    logConceptRevealed,
    logPhaseTransition,
    logMasteryUpdate,
    updatePathExplanation,
  } = useExplainability();

  const { addXP } = useGamification();

  const [problem, setProblem] = useState<ProblemScenario | null>(null);
  const [activeTab, setActiveTab] = useState("scenario");
  const [notes, setNotes] = useState("");
  const [showLesson, setShowLesson] = useState(false);
  const [lessonConcepts, setLessonConcepts] = useState<string[]>([]);

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

  // Simulate AI Learning Path Analysis (Demo Feature)
  useEffect(() => {
    if (problem) {
      const timer = setTimeout(() => {
        updatePathExplanation({
          currentPath: {
            problemId: problem.id,
            phaseId: currentProgress?.currentPhaseId || 'phase-1',
            suggestedConcepts: problem.coreConcepts.slice(0, 3),
          },
          reasoning: "Based on your interest in the scenario, I've prioritized concepts related to Algorithmic Bias and Fairness. Your path is optimized for a 'Discovery' approach.",
          adaptations: [
            {
              trigger: "Initial Assessment",
              change: "Added 'Algorithmic Bias' as a foundational concept.",
              benefit: "Ensures you have the necessary vocabulary for this investigation."
            },
            {
              trigger: "Student Preference",
              change: "Enabled 'Socratic Mode' for deeper engagement.",
              benefit: "Encourages critical thinking rather than just finding answers."
            }
          ],
          studentProfile: {
            strengths: ["Critical Thinking"],
            areasForGrowth: ["Technical Definitions"],
            learningPace: "moderate",
            preferredMode: "socratic"
          }
        });
      }, 3000); // 3 second delay to simulate analysis

      return () => clearTimeout(timer);
    }
  }, [problem, updatePathExplanation, currentProgress]);

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

          if (concept) {
            // Award XP for discovery using the defined weight
            const xp = concept.xpValue || 50;
            addXP(xp, `Discovered concept: ${concept.title}`);
          }

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

      // Trigger Lesson Path
      setLessonConcepts(currentPhase.revealsConcepts);
      setShowLesson(true);
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
    <>
      <div className="container mx-auto p-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                {session.nextRecommendedNode?.relatedScenarioId === problemId && (
                  <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Recommended Next Step
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{problem.hook}</p>
            </div>
            <div className="flex items-start gap-4">
              {/* AI Transparency Toggle */}
              <ExplainabilityToggle />
              <EducationalTooltip
                definition={{
                  id: "investigation_progress",
                  component: "InvestigatePage",
                  content: "Your progress through this investigation. Complete all phases to unlock reflection.",
                  ethicalDesign: {
                    principle: "Progress Visualization",
                    rationale: "Clear progress indicators motivate continued engagement without pressure.",
                    category: "engagement" as const,
                  },
                  pedagogy: "Progress tracking supports goal-setting and self-regulation.",
                  technical: "Progress calculated as completed phases / total phases.",
                }}
                side="left"
              >
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
              </EducationalTooltip>
            </div>
          </div>

          {/* Path Context Banner */}
          {session.currentPath && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-3 flex items-center gap-4">
                <div className="p-2 bg-background rounded-full border">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Your Adaptive Learning Path</p>
                  <p className="text-xs text-muted-foreground">
                    Current Focus: <span className="font-semibold text-primary">{session.nextRecommendedNode?.title || "Evaluating Priorities"}</span>
                    {' '}&bull;{' '}
                    {session.currentPath.pathEfficiency}% Efficiency
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Scenario & Phases */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <EducationalTooltip
                    definition={{
                      id: "tab_scenario",
                      component: "InvestigatePage",
                      content: "Read the problem scenario and understand the stakeholders involved.",
                      ethicalDesign: {
                        principle: "Context First",
                        rationale: "Understanding context before analysis ensures informed decision-making.",
                        category: "transparency" as const,
                      },
                      pedagogy: "Scenario-based learning connects abstract ethics to concrete situations.",
                    }}
                    side="bottom"
                  >
                    <TabsTrigger value="scenario" className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Scenario</span>
                    </TabsTrigger>
                  </EducationalTooltip>
                  <EducationalTooltip
                    definition={{
                      id: "tab_investigate",
                      component: "InvestigatePage",
                      content: "Work through investigation phases and discover key concepts.",
                      ethicalDesign: {
                        principle: "Guided Discovery",
                        rationale: "Structured phases support systematic ethical analysis.",
                        category: "engagement" as const,
                      },
                      pedagogy: "Phased investigation builds understanding progressively.",
                    }}
                    side="bottom"
                  >
                    <TabsTrigger value="investigate" className="flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      <span className="hidden sm:inline">Investigate</span>
                    </TabsTrigger>
                  </EducationalTooltip>
                  <EducationalTooltip
                    definition={{
                      id: "tab_chat",
                      component: "InvestigatePage",
                      content: "Chat with the AI tutor who will ask questions to deepen your thinking.",
                      ethicalDesign: {
                        principle: "Socratic Guidance",
                        rationale: "Questions promote self-discovery over direct instruction.",
                        category: "autonomy" as const,
                        references: ["Socratic Method"],
                      },
                      pedagogy: "AI guide asks questions to help you think, not give answers.",
                    }}
                    side="bottom"
                  >
                    <TabsTrigger value="chat" className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Ask Guide</span>
                    </TabsTrigger>
                  </EducationalTooltip>
                  <EducationalTooltip
                    definition={{
                      id: "tab_notes",
                      component: "InvestigatePage",
                      content: "Write down your thoughts, questions, and discoveries.",
                      ethicalDesign: {
                        principle: "Learner Reflection",
                        rationale: "Note-taking supports metacognition and deeper processing.",
                        category: "autonomy" as const,
                      },
                      pedagogy: "Writing thoughts helps consolidate learning and reveal gaps.",
                    }}
                    side="bottom"
                  >
                    <TabsTrigger value="notes" className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Notes</span>
                    </TabsTrigger>
                  </EducationalTooltip>
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
                      <EducationalTooltip
                        definition={{
                          id: "stakeholders_section",
                          component: "InvestigatePage",
                          content: "Stakeholders are people affected by this situation. Understanding their different viewpoints is key to ethical analysis.",
                          ethicalDesign: {
                            principle: "Multi-Stakeholder Perspective",
                            rationale: "Ethical decisions require considering all affected parties.",
                            category: "fairness" as const,
                            references: ["Value Sensitive Design", "Stakeholder Theory"],
                          },
                          pedagogy: "Identifying stakeholders develops systems thinking and empathy.",
                          technical: "Stakeholders defined per scenario with roles and perspectives.",
                        }}
                        side="right"
                      >
                        <CardTitle className="flex items-center gap-2 cursor-help">
                          <Users className="w-5 h-5" />
                          People Involved
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </CardTitle>
                      </EducationalTooltip>
                      <CardDescription>
                        Consider each person's perspective
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {problem.stakeholders.map((stakeholder) => (
                          <EducationalTooltip
                            key={stakeholder.name}
                            definition={{
                              id: `stakeholder_${stakeholder.name.replace(/\s/g, '_').toLowerCase()}`,
                              component: "InvestigatePage",
                              content: `Think about: How might ${stakeholder.name}'s interests conflict with others? What would be fair from their point of view?`,
                              ethicalDesign: {
                                principle: "Perspective-Taking",
                                rationale: "Understanding different viewpoints is essential for ethical reasoning.",
                                category: "fairness" as const,
                              },
                              pedagogy: `${stakeholder.name}'s perspective helps you consider diverse impacts.`,
                            }}
                            side="top"
                          >
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
                          </EducationalTooltip>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Investigate Tab */}
                <TabsContent value="investigate" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investigation Phases</CardTitle>
                      <CardDescription>
                        Work through each phase to discover concepts
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

                              {/* Phase content */}
                              {isActive && currentPhase && (
                                <div className="mt-4 pt-4 border-t space-y-3">
                                  <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p>{currentPhase.prompt}</p>
                                  </div>
                                  {currentPhase.questionsToConsider && currentPhase.questionsToConsider.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Questions to Consider:</p>
                                      <ul className="text-sm space-y-1 list-disc list-inside">
                                        {currentPhase.questionsToConsider.map((question, i) => (
                                          <li key={i}>{question}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  <Button onClick={handlePhaseComplete} className="w-full">
                                    Complete Phase
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <MasteryGate
                    phasePrompt="Summarize the key ethical concepts you have discovered during this investigation so far."
                    requiredKeywords={currentProgress.discoveredConcepts.map(d => d.conceptId)}
                    onPass={goToReflection}
                  />
                </TabsContent>

                {/* Chat Tab */}
                <TabsContent value="chat">
                  <SocraticChat
                    problemId={problemId}
                    phaseId={currentPhaseId || ""}
                    discoveredConcepts={currentProgress.discoveredConcepts.map(
                      (d) => d.conceptId
                    )}
                    onConceptDiscover={handleConceptDiscover}
                  />
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Investigation Notes</CardTitle>
                      <CardDescription>
                        Document your thinking, questions, and discoveries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="What are you thinking about this problem? What have you learned so far?"
                        className="min-h-[300px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Discovered Concepts */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <EducationalTooltip
                    definition={{
                      id: "concepts_discovered",
                      component: "InvestigatePage",
                      content: "Key AI ethics concepts you've uncovered during your investigation. Click any concept to learn more and see related resources.",
                      ethicalDesign: {
                        principle: "Discovery Learning",
                        rationale: "Students discover concepts through investigation rather than direct instruction.",
                        category: "autonomy" as const,
                        references: ["Constructivist Learning Theory"],
                      },
                      pedagogy: "Active discovery leads to deeper understanding and retention.",
                      technical: "Concepts revealed when phase conditions are met.",
                    }}
                    side="left"
                  >
                    <CardTitle className="flex items-center gap-2 cursor-help">
                      Concepts Discovered
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </EducationalTooltip>
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
                    <EducationalTooltip
                      definition={{
                        id: "investigation_hints",
                        component: "InvestigatePage",
                        content: "If you're stuck, these hints can help guide your thinking without giving away the answer.",
                        ethicalDesign: {
                          principle: "Scaffolded Support",
                          rationale: "Hints provide gentle nudges that maintain learner agency.",
                          category: "autonomy" as const,
                          references: ["Zone of Proximal Development"],
                        },
                        pedagogy: "Progressive hints support struggle without frustration.",
                        technical: "Hints revealed on demand, usage tracked for adaptation.",
                      }}
                      side="left"
                    >
                      <CardTitle className="text-sm flex items-center gap-1 cursor-help">
                        Need a hint?
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </CardTitle>
                    </EducationalTooltip>
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

      {/* Lesson Path Modal */}
      {showLesson && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border-primary/20">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Investigation Complete! Time to Learn.
              </CardTitle>
              <CardDescription>
                You've uncovered key concepts. Master them now to advance your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {lessonConcepts.map(conceptId => {
                  const concept = getConceptById(conceptId);
                  if (!concept) return null;
                  return (
                    <div key={conceptId} className="group relative bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-headline text-lg">{concept.title}</h4>
                          <Badge variant="secondary">+{concept.xpValue} XP</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {concept.description}
                        </p>
                        <Button
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => router.push(`/learn/${conceptId}`)}
                        >
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Start Lesson
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button size="lg" onClick={() => setShowLesson(false)}>
                  Continue to Next Phase
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
