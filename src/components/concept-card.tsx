"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ConceptResource } from "@/lib/types";
import {
  Lightbulb,
  Video,
  FileText,
  ChevronRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
} from "lucide-react";

// Tooltip definitions for concept cards
const conceptTooltips = {
  masteryLevel: "Your understanding level based on quiz performance and engagement with the concept.",
  keyInsights: "Core ideas and principles that define this AI ethics concept.",
  resources: "Videos, articles, and other materials to deepen your understanding.",
  thinkAbout: "Reflection questions to help you apply this concept to real situations.",
  relatedConcepts: "Other AI ethics concepts that connect to this one. Understanding these together builds a complete picture.",
  videoResource: "Watch this video to see the concept explained with examples.",
  articleResource: "Read this article for in-depth analysis and case studies.",
};

interface ConceptCardProps {
  concept: ConceptResource;
  mastery?: number;
  compact?: boolean;
  onExplore?: () => void;
}

export function ConceptCard({
  concept,
  mastery = 0,
  compact = false,
  onExplore,
}: ConceptCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMasteryColor = (level: number) => {
    if (level >= 80) return "text-green-500";
    if (level >= 50) return "text-yellow-500";
    if (level >= 20) return "text-orange-500";
    return "text-muted-foreground";
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return "Mastered";
    if (level >= 50) return "Developing";
    if (level >= 20) return "Exploring";
    return "Discovered";
  };

  if (compact) {
    return (
      <TooltipProvider delayDuration={300}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{concept.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={mastery} className="h-1 flex-1" />
                        <span className={`text-xs ${getMasteryColor(mastery)}`}>
                          {getMasteryLabel(mastery)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium">{concept.title}</p>
              <p className="text-xs mt-1">{concept.description.slice(0, 100)}...</p>
              <p className="text-xs mt-1 text-muted-foreground">Click to learn more and see resources</p>
            </TooltipContent>
          </Tooltip>
          <ConceptDialog concept={concept} mastery={mastery} />
        </Dialog>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
                {concept.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {concept.description}
              </p>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help">{concept.category}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Category: {concept.category} - This concept belongs to the {concept.category} area of AI ethics.</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-help">
                      <Progress value={mastery} className="w-20 h-2" />
                      <span className={`text-xs ${getMasteryColor(mastery)}`}>
                        {mastery}%
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{conceptTooltips.masteryLevel}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <ConceptDialog concept={concept} mastery={mastery} />
      </Dialog>
    </TooltipProvider>
  );
}

function ConceptDialog({
  concept,
  mastery,
}: {
  concept: ConceptResource;
  mastery: number;
}) {
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={300}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            {concept.title}
          </DialogTitle>
          <DialogDescription>{concept.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="insights" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="insights">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Key Insights
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{conceptTooltips.keyInsights}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="resources">
                  <Video className="w-4 h-4 mr-1" />
                  Resources
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{conceptTooltips.resources}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="questions">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Think About
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{conceptTooltips.thinkAbout}</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-2">
              {concept.keyInsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {/* Video */}
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="font-semibold flex items-center gap-2 cursor-help w-fit">
                    <Video className="w-4 h-4" />
                    Video
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </h4>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{conceptTooltips.videoResource}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={concept.videoUrl.replace("/embed/", "/watch?v=")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="flex-1 text-sm">{concept.videoTitle}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opens in a new tab - {Math.floor(concept.videoDuration / 60)} min watch</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-xs text-muted-foreground">
                Duration: {Math.floor(concept.videoDuration / 60)} min
              </p>
            </div>

            {/* Article */}
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="font-semibold flex items-center gap-2 cursor-help w-fit">
                    <FileText className="w-4 h-4" />
                    Article
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </h4>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{conceptTooltips.articleResource}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={concept.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="flex-1 text-sm">{concept.articleTitle}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opens in a new tab for in-depth reading</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Consider these questions to deepen your understanding:
            </p>
            <div className="space-y-2">
              {concept.guidingQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm">{question}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Concepts */}
        {concept.relatedConcepts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help w-fit">
                  Related Concepts
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </h4>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{conceptTooltips.relatedConcepts}</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex flex-wrap gap-2">
              {concept.relatedConcepts.map((relatedId) => (
                <Tooltip key={relatedId}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="cursor-help">
                      {relatedId.replace(/_/g, " ")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore this related concept to build a complete understanding</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Mastery */}
        <div className="mt-4 pt-4 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between text-sm cursor-help">
                <span className="text-muted-foreground flex items-center gap-1">
                  Your Understanding
                  <HelpCircle className="w-3 h-3" />
                </span>
                <span className="font-medium">{mastery}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{conceptTooltips.masteryLevel}</p>
            </TooltipContent>
          </Tooltip>
          <Progress value={mastery} className="mt-2" />
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <Button onClick={() => router.push(`/learn/${concept.id}`)} className="w-full sm:w-auto">
            <BookOpen className="w-4 h-4 mr-2" />
            Go to Full Lesson
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </TooltipProvider>
  );
}
