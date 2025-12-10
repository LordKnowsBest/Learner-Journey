"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { getConceptById } from '@/lib/data';
import type { ConceptResource } from '@/lib/types';
import { AITutor } from '@/components/ai-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EducationalTooltip } from '@/components/ui/educational-tooltip';
import { ethicalTooltipDefinitions } from '@/lib/ethical-design-tooltips';
import { ExternalLink, Film, BookOpen, Loader2, Lightbulb, HelpCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConceptLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { discoverConcept, isConceptDiscovered } = useSession();
  const { toast } = useToast();

  const [concept, setConcept] = useState<ConceptResource | null>(null);

  const nodeId = params.nodeId as string;

  useEffect(() => {
    const currentConcept = getConceptById(nodeId);
    if (currentConcept) {
      setConcept(currentConcept);
    } else {
      router.push('/graph');
    }
  }, [nodeId, router]);

  // Mark as discovered if visiting (optional, normally discovered via problems)
  useEffect(() => {
    if (concept && !isConceptDiscovered(concept.id)) {
      // We might not want to auto-discover everything just by visiting URL, 
      // but for now let's assume if they got here, they found it.
      // discoverConcept(concept.id, 'direct_access'); 
    }
  }, [concept, isConceptDiscovered, discoverConcept]);

  if (!concept) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading concept...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 animate-fade-in text-foreground">
      <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.push('/graph')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Knowledge Graph
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Main Content Card */}
          <Card className="overflow-hidden border-2 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 bg-background">{concept.category}</Badge>
                  <CardTitle className="text-3xl font-headline mb-1">{concept.title}</CardTitle>
                  <CardDescription className="text-lg">{concept.description}</CardDescription>
                </div>
                {isConceptDiscovered(concept.id) && (
                  <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Discovered
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

              {/* Video Section */}
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.learn_video_content}
                side="top"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden border bg-black/5 shadow-inner cursor-help">
                  <iframe
                    width="100%"
                    height="100%"
                    src={concept.videoUrl}
                    title={concept.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </EducationalTooltip>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <EducationalTooltip
                  definition={ethicalTooltipDefinitions.learn_article_link}
                  side="top"
                >
                  <a href={concept.articleUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full h-12 text-base border-primary/20 hover:bg-primary/5">
                      <BookOpen className="mr-2 h-4 w-4 text-primary" />
                      Read: {concept.articleTitle}
                      <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                    </Button>
                  </a>
                </EducationalTooltip>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <EducationalTooltip
                definition={{
                  id: "learn_key_insights",
                  component: "ConceptLearningPage",
                  content: "Important takeaways distilled from this concept.",
                  ethicalDesign: {
                    principle: "Scaffolded Learning",
                    rationale: "Key insights help learners identify what's most important without overwhelming.",
                    category: "engagement" as const,
                    references: ["Cognitive Load Theory"],
                  },
                  pedagogy: "Summarizing key points supports retention and comprehension checks.",
                  technical: "Insights curated by subject matter experts.",
                }}
                side="right"
              >
                <CardTitle className="flex items-center gap-2 cursor-help">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Key Insights
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
              </EducationalTooltip>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {concept.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Guiding Questions */}
          <Card>
            <CardHeader>
              <EducationalTooltip
                definition={{
                  id: "learn_deep_thinking",
                  component: "ConceptLearningPage",
                  content: "Questions to encourage deeper reflection on this concept.",
                  ethicalDesign: {
                    principle: "Socratic Inquiry",
                    rationale: "Questions promote active thinking over passive consumption.",
                    category: "autonomy" as const,
                    references: ["Socratic Method", "Inquiry-Based Learning"],
                  },
                  pedagogy: "Guiding questions help learners connect concepts to their own thinking.",
                  technical: "Questions designed by learning designers for each concept.",
                }}
                side="right"
              >
                <CardTitle className="flex items-center gap-2 cursor-help">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Deep Thinking
                </CardTitle>
              </EducationalTooltip>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {concept.guidingQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
                    <p className="font-medium italic text-muted-foreground">"{q}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar: AI Tutor & Related */}
        <div className="lg:col-span-1 space-y-6">
          <AITutor nodeId={concept.id} />

          <Card>
            <CardHeader compact>
              <EducationalTooltip
                definition={{
                  id: "learn_related_concepts",
                  component: "ConceptLearningPage",
                  content: "Other concepts connected to this one in the knowledge graph.",
                  ethicalDesign: {
                    principle: "Connected Learning",
                    rationale: "Showing relationships between concepts builds integrated understanding.",
                    category: "engagement" as const,
                    references: ["Knowledge Graph Theory", "Concept Mapping"],
                  },
                  pedagogy: "Related concepts help learners see the bigger picture.",
                  technical: "Relationships defined in the concept graph data structure.",
                }}
                side="left"
              >
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider cursor-help flex items-center gap-1">
                  Related Concepts
                  <HelpCircle className="w-3 h-3" />
                </CardTitle>
              </EducationalTooltip>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {concept.relatedConcepts.map(relatedId => (
                  <Button
                    key={relatedId}
                    variant="secondary"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => router.push(`/learn/${relatedId}`)}
                  >
                    {relatedId.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
