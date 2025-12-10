"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { getProblemById, getConceptById } from "@/lib/data";
import { useSession } from "@/context/SessionContext";
import { evaluateReflection } from "@/ai/flows/ai-tutor-assistance";
import {
  CheckCircle,
  Lightbulb,
  Send,
  ArrowRight,
  FileText,
  Star,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { ProblemScenario, ReflectionPrompt } from "@/lib/types";

interface FeedbackResult {
  overallFeedback: string;
  strengths: string[];
  areasToImprove: string[];
  conceptsWellApplied: string[];
  conceptsMissed: string[];
  followUpQuestion: string;
  score: number;
}

export default function ReflectPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;

  const {
    session,
    getCurrentProblem,
    submitReflection,
    completeProblem,
  } = useSession();

  const [problem, setProblem] = useState<ProblemScenario | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackResult>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const p = getProblemById(problemId);
    if (p) {
      setProblem(p);
    } else {
      router.push("/problems");
    }
  }, [problemId, router]);

  const currentProgress = getCurrentProblem();

  if (!problem || !currentProgress) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[50vh]">
        <p>Loading reflection...</p>
      </div>
    );
  }

  const currentPrompt = problem.reflectionPrompts[currentPromptIndex];
  const totalPrompts = problem.reflectionPrompts.length;
  const progressPercent = ((currentPromptIndex + 1) / totalPrompts) * 100;

  const handleResponseChange = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentPrompt.id]: value,
    }));
  };

  const handleSubmitReflection = async () => {
    const response = responses[currentPrompt.id];
    if (!response?.trim()) return;

    setIsSubmitting(true);

    try {
      // Get AI feedback
      const feedback = await evaluateReflection({
        problemId,
        reflectionPromptId: currentPrompt.id,
        studentResponse: response,
        conceptsDiscovered: session.allDiscoveredConcepts,
      });

      setFeedbacks((prev) => ({
        ...prev,
        [currentPrompt.id]: feedback,
      }));

      // Save to session
      submitReflection(
        currentPrompt.id,
        response,
        feedback.conceptsWellApplied
      );
    } catch (error) {
      console.error("Error evaluating reflection:", error);
      // Provide basic feedback on error
      setFeedbacks((prev) => ({
        ...prev,
        [currentPrompt.id]: {
          overallFeedback: "Thank you for your thoughtful response!",
          strengths: ["You engaged with the problem"],
          areasToImprove: [],
          conceptsWellApplied: [],
          conceptsMissed: [],
          followUpQuestion: "",
          score: 70,
        },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleComplete = () => {
    // Calculate overall solution from all responses
    const solutionProposal = Object.values(responses).join("\n\n---\n\n");
    completeProblem(solutionProposal);
  };

  const hasFeedback = feedbacks[currentPrompt?.id];
  const currentResponse = responses[currentPrompt?.id] || "";

  if (isComplete) {
    // Calculate average score
    const scores = Object.values(feedbacks).map((f) => f.score);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    return (
      <div className="container mx-auto p-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Investigation Complete!</CardTitle>
              <CardDescription>
                Great work thinking through "{problem.title}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Summary */}
              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                <p className="text-5xl font-bold text-primary">{avgScore}%</p>
                <Progress value={avgScore} className="mt-4" />
              </div>

              {/* Concepts Mastered */}
              <div>
                <h4 className="font-semibold mb-3">
                  Concepts You Explored ({session.allDiscoveredConcepts.length})
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentProgress.discoveredConcepts.map((discovery) => {
                    const concept = getConceptById(discovery.conceptId);
                    return (
                      <Badge
                        key={discovery.conceptId}
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {concept?.title || discovery.conceptId}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="text-left">
                <h4 className="font-semibold mb-3">Key Strengths</h4>
                <div className="space-y-2">
                  {Object.values(feedbacks)
                    .flatMap((f) => f.strengths)
                    .filter((s, i, arr) => arr.indexOf(s) === i)
                    .slice(0, 3)
                    .map((strength, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded"
                      >
                        <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{strength}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button onClick={handleComplete} size="lg" className="w-full">
                View Journey Summary
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/problems")}
              >
                Try Another Problem
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <EducationalTooltip
            definition={{
              id: "reflection_header",
              component: "ReflectPage",
              content: "Reflection consolidates your learning by connecting concepts to the ethical dilemma you investigated.",
              ethicalDesign: {
                principle: "Reflective Practice",
                rationale: "Structured reflection deepens understanding and promotes metacognition.",
                category: "engagement" as const,
                references: ["Kolb's Experiential Learning Cycle"],
              },
              pedagogy: "Writing reflections helps integrate new knowledge with existing understanding.",
              technical: "Responses evaluated by AI for concept application and critical thinking.",
            }}
            side="bottom"
          >
            <div className="cursor-help">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Time to Reflect
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </h1>
              <p className="text-muted-foreground">{problem.title}</p>
            </div>
          </EducationalTooltip>
          <EducationalTooltip
            definition={{
              id: "reflection_progress",
              component: "ReflectPage",
              content: "Your progress through the reflection questions. Complete all to finish the investigation.",
              ethicalDesign: {
                principle: "Progress Transparency",
                rationale: "Clear progress indicators support self-regulation and completion.",
                category: "engagement" as const,
              },
              pedagogy: "Progress tracking motivates completion without pressure.",
            }}
            side="left"
          >
            <div className="text-right cursor-help">
              <p className="text-sm text-muted-foreground">
                Question {currentPromptIndex + 1} of {totalPrompts}
              </p>
              <Progress value={progressPercent} className="w-32 mt-1" />
            </div>
          </EducationalTooltip>
        </div>

        {/* Concepts Reference */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <EducationalTooltip
              definition={{
                id: "reflection_concepts_reference",
                component: "ReflectPage",
                content: "These are the concepts you discovered during investigation. Reference them in your reflection.",
                ethicalDesign: {
                  principle: "Knowledge Scaffolding",
                  rationale: "Showing discovered concepts helps learners connect reflection to what they learned.",
                  category: "engagement" as const,
                },
                pedagogy: "Explicit concept reminders support transfer and application.",
                technical: "Concepts pulled from session state and problem progress.",
              }}
              side="right"
            >
              <CardTitle className="text-sm flex items-center gap-2 cursor-help">
                <Lightbulb className="w-4 h-4" />
                Concepts You Discovered
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </CardTitle>
            </EducationalTooltip>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentProgress.discoveredConcepts.map((discovery) => {
                const concept = getConceptById(discovery.conceptId);
                return (
                  <Badge key={discovery.conceptId} variant="secondary">
                    {concept?.title || discovery.conceptId}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reflection Prompt */}
        <Card>
          <CardHeader>
            <EducationalTooltip
              definition={{
                id: "reflection_question",
                component: "ReflectPage",
                content: "This question prompts you to apply concepts and think critically about the ethical dilemma.",
                ethicalDesign: {
                  principle: "Guided Reflection",
                  rationale: "Well-crafted questions support meaningful reflection without prescribing answers.",
                  category: "autonomy" as const,
                  references: ["Bloom's Taxonomy - Higher-Order Thinking"],
                },
                pedagogy: "Open-ended questions encourage analysis and synthesis.",
                technical: "Questions designed for each problem scenario with rubric alignment.",
              }}
              side="right"
            >
              <CardTitle className="flex items-center gap-2 cursor-help">
                <FileText className="w-5 h-5 text-primary" />
                Reflection Question
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </EducationalTooltip>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-lg">{currentPrompt.question}</p>
            </div>

            {/* Rubric Preview */}
            <EducationalTooltip
              definition={{
                id: "reflection_rubric",
                component: "ReflectPage",
                content: "These criteria show what the AI will evaluate in your response.",
                ethicalDesign: {
                  principle: "Transparent Assessment",
                  rationale: "Clear criteria help learners understand expectations before writing.",
                  category: "transparency" as const,
                  references: ["Transparent Assessment Practices"],
                },
                pedagogy: "Knowing evaluation criteria supports self-assessment and revision.",
                technical: "Rubric weights determine final score calculation.",
              }}
              side="right"
            >
              <div className="cursor-help">
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  Your response will be evaluated on:
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentPrompt.rubricCriteria.map((criterion) => (
                    <div
                      key={criterion.criterion}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>
                        {criterion.criterion} ({criterion.weight}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </EducationalTooltip>

            {/* Response Area */}
            {!hasFeedback ? (
              <>
                <Textarea
                  value={currentResponse}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder="Write your reflection here. Think about all the stakeholders and concepts you've learned about..."
                  className="min-h-[200px]"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {currentResponse.length} characters
                  </p>
                  <Button
                    onClick={handleSubmitReflection}
                    disabled={isSubmitting || currentResponse.length < 50}
                  >
                    {isSubmitting ? (
                      "Analyzing..."
                    ) : (
                      <>
                        Submit Response
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
                {currentResponse.length > 0 && currentResponse.length < 50 && (
                  <p className="text-xs text-orange-500">
                    Please write at least 50 characters
                  </p>
                )}
              </>
            ) : (
              /* Feedback Display */
              <div className="space-y-4">
                {/* Your Response */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Your Response:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentResponse}
                  </p>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {hasFeedback.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{hasFeedback.overallFeedback}</p>
                  </div>
                </div>

                {/* Strengths */}
                {hasFeedback.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-500" />
                      Strengths
                    </p>
                    <ul className="space-y-1">
                      {hasFeedback.strengths.map((strength, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas to Improve */}
                {hasFeedback.areasToImprove.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Areas to Consider
                    </p>
                    <ul className="space-y-1">
                      {hasFeedback.areasToImprove.map((area, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Question */}
                {hasFeedback.followUpQuestion && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-1">Think about this:</p>
                    <p className="text-sm italic">{hasFeedback.followUpQuestion}</p>
                  </div>
                )}

                <Button onClick={handleNext} className="w-full" size="lg">
                  {currentPromptIndex < totalPrompts - 1
                    ? "Next Question"
                    : "Complete Investigation"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
