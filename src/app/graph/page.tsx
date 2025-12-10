"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { conceptResources, conceptLinks, getConceptById } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import {
  Lock,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Network,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConceptMapPage() {
  const router = useRouter();
  const { session, isConceptDiscovered } = useSession();

  const discoveredCount = session.allDiscoveredConcepts.length;
  const totalCount = conceptResources.length;
  const progressPercent = (discoveredCount / totalCount) * 100;

  // Group concepts by category
  const conceptsByCategory = conceptResources.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, typeof conceptResources>);

  // Get discovered connections
  const discoveredConnections = conceptLinks.filter(
    (link) =>
      session.allDiscoveredConcepts.includes(link.fromConcept) &&
      session.allDiscoveredConcepts.includes(link.toConcept)
  );

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "builds_on":
        return "text-blue-500";
      case "contrasts_with":
        return "text-orange-500";
      case "applies_to":
        return "text-green-500";
      case "example_of":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.concept_map_overview}
            side="bottom"
          >
            <h1 className="text-3xl font-bold cursor-help flex items-center justify-center gap-2">
              Concept Map
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </h1>
          </EducationalTooltip>
          <p className="text-muted-foreground">
            Discover concepts by investigating problems. The more you explore, the
            more connections you'll uncover!
          </p>
          <EducationalTooltip
            definition={{
              id: "concept_discovery_progress",
              component: "ConceptMapPage",
              content: `You've discovered ${discoveredCount} out of ${totalCount} AI ethics concepts.`,
              ethicalDesign: {
                principle: "Progress Visualization",
                rationale: "Visible progress motivates continued exploration without creating pressure.",
                category: "engagement",
                references: ["Self-Determination Theory", "Progress Principle"],
              },
              pedagogy: "Progress tracking supports goal-setting and self-regulation.",
              technical: "Discovery count persists per session with optional cross-session tracking.",
            }}
            side="bottom"
          >
            <div className="flex items-center justify-center gap-4 cursor-help">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <span>
                  {discoveredCount} / {totalCount} concepts discovered
                </span>
              </div>
              <Progress value={progressPercent} className="w-32" />
            </div>
          </EducationalTooltip>
        </div>

        {/* Call to Action if no concepts discovered */}
        {discoveredCount === 0 && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Start Your Discovery</h3>
              <p className="text-muted-foreground">
                Choose a problem to investigate and you'll begin discovering AI
                ethics concepts as you explore!
              </p>
              <Button onClick={() => router.push("/problems")}>
                Choose a Problem
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Concept Categories */}
        {Object.entries(conceptsByCategory).map(([category, concepts]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Network className="w-5 h-5" />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts.map((concept) => {
                const isDiscovered = isConceptDiscovered(concept.id);
                const mastery = session.conceptMastery[concept.id] || 0;

                return (
                  <EducationalTooltip
                    key={concept.id}
                    definition={isDiscovered
                      ? ethicalTooltipDefinitions.concept_discovered
                      : ethicalTooltipDefinitions.concept_locked
                    }
                    side="top"
                  >
                    <Card
                      onClick={() => router.push(`/learn/${concept.id}`)}
                      className={cn(
                        "transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]",
                        isDiscovered
                          ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                          : "opacity-60 border-dashed hover:opacity-100"
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {isDiscovered ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                            {concept.title}
                          </CardTitle>
                        </div>
                        <CardDescription
                          className={cn(!isDiscovered && "blur-sm select-none")}
                        >
                          {isDiscovered
                            ? concept.description
                            : "Discover this concept by investigating problems"}
                        </CardDescription>
                      </CardHeader>
                      {isDiscovered && (
                        <CardContent className="pt-0">
                          <EducationalTooltip
                            definition={ethicalTooltipDefinitions.concept_mastery_progress}
                            side="top"
                          >
                            <div className="cursor-help">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Mastery</span>
                                <span>{mastery}%</span>
                              </div>
                              <Progress value={mastery} className="mt-1 h-2" />
                            </div>
                          </EducationalTooltip>

                          {/* Related Concepts */}
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">
                              Related:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {concept.relatedConcepts.slice(0, 3).map((relatedId) => {
                                const isRelatedDiscovered =
                                  isConceptDiscovered(relatedId);
                                const related = getConceptById(relatedId);
                                return (
                                  <Badge
                                    key={relatedId}
                                    variant={
                                      isRelatedDiscovered ? "secondary" : "outline"
                                    }
                                    className={cn(
                                      "text-xs",
                                      !isRelatedDiscovered && "opacity-50"
                                    )}
                                  >
                                    {isRelatedDiscovered
                                      ? related?.title || relatedId
                                      : "???"}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </EducationalTooltip>
                );
              })}
            </div>
          </div>
        ))}

        {/* Discovered Connections */}
        {discoveredConnections.length > 0 && (
          <Card>
            <CardHeader>
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.concept_connections}
                side="right"
              >
                <CardTitle className="flex items-center gap-2 cursor-help">
                  <Network className="w-5 h-5" />
                  Connections You've Discovered
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </EducationalTooltip>
              <CardDescription>
                How concepts relate to each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discoveredConnections.map((link, index) => {
                  const fromConcept = getConceptById(link.fromConcept);
                  const toConcept = getConceptById(link.toConcept);
                  const relationshipTooltip = link.relationship === 'builds_on'
                    ? ethicalTooltipDefinitions.concept_relationship_builds_on
                    : link.relationship === 'contrasts_with'
                    ? ethicalTooltipDefinitions.concept_relationship_contrasts
                    : {
                        id: `relationship_${link.relationship}`,
                        component: "ConceptMapPage",
                        content: `${fromConcept?.title} ${link.relationship.replace(/_/g, ' ')} ${toConcept?.title}`,
                        ethicalDesign: {
                          principle: "Concept Relationships",
                          rationale: "Understanding how concepts relate deepens comprehension.",
                          category: "transparency" as const,
                        },
                        pedagogy: "Explicit connections help build integrated knowledge.",
                      };
                  return (
                    <EducationalTooltip
                      key={index}
                      definition={relationshipTooltip}
                      side="top"
                    >
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm cursor-help">
                        <Badge variant="secondary">{fromConcept?.title}</Badge>
                        <span
                          className={cn(
                            "text-xs",
                            getRelationshipColor(link.relationship)
                          )}
                        >
                          {link.relationship.replace(/_/g, " ")}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <Badge variant="secondary">{toConcept?.title}</Badge>
                      </div>
                    </EducationalTooltip>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <EducationalTooltip
            definition={{
              id: "nav_explore_problems",
              component: "ConceptMapPage",
              content: "Return to the problem selection page to investigate more scenarios.",
              ethicalDesign: {
                principle: "Learner Agency",
                rationale: "Easy navigation supports self-directed learning.",
                category: "autonomy",
              },
              pedagogy: "Multiple entry points support varied learning approaches.",
            }}
            side="top"
          >
            <Button variant="outline" onClick={() => router.push("/problems")}>
              Explore Problems
            </Button>
          </EducationalTooltip>
          {discoveredCount > 0 && (
            <EducationalTooltip
              definition={{
                id: "nav_journey_summary",
                component: "ConceptMapPage",
                content: "View a comprehensive summary of your learning journey so far.",
                ethicalDesign: {
                  principle: "Progress Reflection",
                  rationale: "Reviewing progress supports metacognitive awareness.",
                  category: "engagement",
                },
                pedagogy: "Reflection on learning supports deeper understanding.",
              }}
              side="top"
            >
              <Button onClick={() => router.push("/journey-summary")}>
                View Journey Summary
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </EducationalTooltip>
          )}
        </div>
      </div>
    </div>
  );
}
