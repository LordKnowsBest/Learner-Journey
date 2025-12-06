'use client';

import { useState } from 'react';
import { useExplainability } from '@/context/ExplainabilityContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye,
  Brain,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Shuffle,
  Target,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import type { ExplainabilityEntry, ExplainabilityEventType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

const eventTypeConfig: Record<ExplainabilityEventType, {
  icon: typeof Brain;
  label: string;
  color: string;
}> = {
  tutor_response: { icon: MessageSquare, label: 'AI Response', color: 'bg-blue-500' },
  mode_change: { icon: Shuffle, label: 'Approach Changed', color: 'bg-purple-500' },
  concept_revealed: { icon: Lightbulb, label: 'Concept Found', color: 'bg-yellow-500' },
  phase_transition: { icon: ChevronRight, label: 'Phase Complete', color: 'bg-green-500' },
  mastery_update: { icon: TrendingUp, label: 'Progress Made', color: 'bg-emerald-500' },
  path_adaptation: { icon: Target, label: 'Path Adjusted', color: 'bg-orange-500' },
  hint_triggered: { icon: Info, label: 'Hint Given', color: 'bg-cyan-500' },
  reflection_feedback: { icon: CheckCircle, label: 'Feedback', color: 'bg-indigo-500' },
};

function ExplainabilityEntryCard({ entry }: { entry: ExplainabilityEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = eventTypeConfig[entry.eventType];
  const Icon = config.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
          <div className={`p-2 rounded-full ${config.color} text-white flex-shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{entry.title}</p>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-12 pr-3 pb-3 space-y-3">
          {/* Explanation */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-1">What happened:</p>
            <p className="text-sm text-muted-foreground">{entry.explanation}</p>
          </div>

          {/* Reasoning */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium mb-1 flex items-center gap-1">
              <Brain className="w-4 h-4" />
              Why this approach:
            </p>
            <p className="text-sm text-muted-foreground">{entry.reasoning}</p>
          </div>

          {/* Factors */}
          {entry.factors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Factors considered:</p>
              <div className="space-y-1">
                {entry.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                  >
                    <span className="font-medium">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{factor.value}</span>
                      <Badge
                        variant={factor.impact === 'positive' ? 'default' :
                                factor.impact === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {factor.impact === 'positive' ? '+' :
                         factor.impact === 'negative' ? '-' : '○'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Decision Info */}
          {entry.aiDecision && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {entry.aiDecision.mode && (
                <Badge variant="outline" className="text-xs">
                  Mode: {entry.aiDecision.mode}
                </Badge>
              )}
              {entry.aiDecision.confidence !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Confidence: {Math.round(entry.aiDecision.confidence * 100)}%
                </Badge>
              )}
            </div>
          )}

          {/* Related Concepts */}
          {entry.relatedConcepts && entry.relatedConcepts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.relatedConcepts.map(concept => (
                <Badge key={concept} variant="secondary" className="text-xs">
                  {concept.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function LearningPathSection() {
  const { state } = useExplainability();
  const pathExplanation = state.currentPathExplanation;

  if (!pathExplanation) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Learning path explanation will appear as you progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Current Path */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Current Learning Path</h4>
        <div className="p-3 bg-muted/30 rounded-lg text-sm">
          <p className="text-muted-foreground">{pathExplanation.reasoning}</p>
        </div>
      </div>

      {/* Student Profile */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Student Learning Profile</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Learning Pace</span>
            <Badge variant="outline">{pathExplanation.studentProfile.learningPace}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Preferred Mode</span>
            <Badge variant="outline">{pathExplanation.studentProfile.preferredMode}</Badge>
          </div>
          {pathExplanation.studentProfile.strengths.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {pathExplanation.studentProfile.strengths.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-green-500/10 text-green-700">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {pathExplanation.studentProfile.areasForGrowth.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Areas for Growth:</p>
              <div className="flex flex-wrap gap-1">
                {pathExplanation.studentProfile.areasForGrowth.map((a, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-orange-500/10 text-orange-700">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adaptations */}
      {pathExplanation.adaptations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Path Adaptations</h4>
          <div className="space-y-2">
            {pathExplanation.adaptations.map((adaptation, i) => (
              <div key={i} className="p-2 bg-muted/30 rounded text-sm">
                <p className="font-medium">{adaptation.change}</p>
                <p className="text-xs text-muted-foreground">
                  Trigger: {adaptation.trigger} | Benefit: {adaptation.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ExplainabilitySidebarProps {
  className?: string;
}

export function ExplainabilitySidebar({ className }: ExplainabilitySidebarProps) {
  const { state, toggleSidebar, setViewerRole, getRecentEntries } = useExplainability();
  const [activeTab, setActiveTab] = useState<'activity' | 'path'>('activity');
  const recentEntries = getRecentEntries(50);

  return (
    <Sheet open={state.isVisible} onOpenChange={toggleSidebar}>
      <SheetTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`fixed right-4 bottom-4 z-50 rounded-full shadow-lg ${className}`}
                onClick={toggleSidebar}
              >
                <Eye className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>View AI Explainability</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg">AI Transparency</SheetTitle>
                <SheetDescription className="text-xs">
                  Understanding how the AI supports learning
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-2 mt-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Select
              value={state.viewerRole}
              onValueChange={(v) => setViewerRole(v as typeof state.viewerRole)}
            >
              <SelectTrigger className="h-8 text-xs w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student View</SelectItem>
                <SelectItem value="parent">Parent View</SelectItem>
                <SelectItem value="teacher">Teacher View</SelectItem>
                <SelectItem value="admin">Admin View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              variant={activeTab === 'activity' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('activity')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Activity Log
            </Button>
            <Button
              variant={activeTab === 'path' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('path')}
            >
              <Target className="w-4 h-4 mr-1" />
              Learning Path
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {activeTab === 'activity' ? (
            <div className="p-2">
              {recentEntries.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activity yet.</p>
                  <p className="text-xs mt-1">
                    AI decisions will appear here as you learn.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentEntries.map(entry => (
                    <ExplainabilityEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <LearningPathSection />
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>
              {state.viewerRole === 'student'
                ? 'See how the AI is helping you learn'
                : state.viewerRole === 'parent'
                ? "Monitor your child's learning support"
                : state.viewerRole === 'teacher'
                ? 'Review AI tutoring decisions'
                : 'Full system transparency'}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Floating toggle button for easy access
export function ExplainabilityToggle({ className }: { className?: string }) {
  const { state, toggleSidebar } = useExplainability();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={state.isVisible ? 'default' : 'outline'}
            size="sm"
            className={`gap-2 ${className}`}
            onClick={toggleSidebar}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">AI Transparency</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle AI explainability sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
