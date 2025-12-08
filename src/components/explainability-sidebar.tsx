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
  HelpCircle,
} from 'lucide-react';
import type { ExplainabilityEntry, ExplainabilityEventType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

// Tooltip definitions for explaining UI elements to users
const tooltipDefinitions = {
  // Event types
  tutor_response: 'The AI generated a response to guide your learning. Click to see why it chose this approach.',
  mode_change: 'The AI adjusted its teaching style based on your progress and needs.',
  concept_revealed: 'You discovered a new AI ethics concept through your investigation.',
  phase_transition: 'You completed a learning phase and moved to the next stage.',
  mastery_update: 'Your understanding of a concept has improved based on your responses.',
  path_adaptation: 'The AI personalized your learning path based on your performance.',
  hint_triggered: 'The AI provided a hint to help you progress when you seemed stuck.',
  reflection_feedback: 'The AI provided feedback on your reflection or solution.',

  // UI elements
  activityLog: 'View a chronological record of all AI decisions and actions during your learning session.',
  learningPath: 'See how the AI is personalizing your learning journey based on your progress.',
  viewerRole: 'Switch between different perspectives to see information relevant to students, parents, teachers, or administrators.',
  confidenceBadge: 'Shows how certain the AI is about this decision. Higher confidence means the AI has more evidence to support this choice.',
  modeBadge: 'The teaching mode the AI used: Questioning (asks you to think), Hinting (gives clues), Explaining (teaches directly), or Challenging (pushes deeper).',
  factorImpact: 'How this factor influenced the AI\'s decision: positive (+) encouraged, negative (-) discouraged, or neutral (○) no effect.',
  reasoning: 'The AI\'s explanation for why it made this particular decision.',
  whatHappened: 'A simple description of the action the AI took.',
  relatedConcepts: 'AI ethics concepts that are connected to this learning moment.',
  studentProfile: 'A summary of your learning preferences and patterns that the AI has observed.',
  pathAdaptations: 'Changes the AI has made to your learning journey to better suit your needs.',
};

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
    <TooltipProvider delayDuration={300}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p>{tooltipDefinitions[entry.eventType]}</p>
          </TooltipContent>
        </Tooltip>
        <CollapsibleContent>
          <div className="pl-12 pr-3 pb-3 space-y-3">
            {/* Explanation */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium mb-1 flex items-center gap-1 cursor-help">
                    What happened:
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipDefinitions.whatHappened}</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-sm text-muted-foreground">{entry.explanation}</p>
            </div>

            {/* Reasoning */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium mb-1 flex items-center gap-1 cursor-help">
                    <Brain className="w-4 h-4" />
                    Why this approach:
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipDefinitions.reasoning}</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-sm text-muted-foreground">{entry.reasoning}</p>
            </div>

            {/* Factors */}
            {entry.factors.length > 0 && (
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1 cursor-help">
                      Factors considered:
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>These are the inputs the AI used to make its decision. Each factor shows what was observed and how it influenced the outcome.</p>
                  </TooltipContent>
                </Tooltip>
                <div className="space-y-1">
                  {entry.factors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                    >
                      <span className="font-medium">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{factor.value}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={factor.impact === 'positive' ? 'default' :
                                      factor.impact === 'negative' ? 'destructive' : 'secondary'}
                              className="text-xs cursor-help"
                            >
                              {factor.impact === 'positive' ? '+' :
                               factor.impact === 'negative' ? '-' : '○'}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipDefinitions.factorImpact}</p>
                          </TooltipContent>
                        </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        Mode: {entry.aiDecision.mode}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{tooltipDefinitions.modeBadge}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {entry.aiDecision.confidence !== undefined && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">
                        Confidence: {Math.round(entry.aiDecision.confidence * 100)}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{tooltipDefinitions.confidenceBadge}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}

            {/* Related Concepts */}
            {entry.relatedConcepts && entry.relatedConcepts.length > 0 && (
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                      Related concepts:
                      <HelpCircle className="w-3 h-3" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipDefinitions.relatedConcepts}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-wrap gap-1">
                  {entry.relatedConcepts.map(concept => (
                    <Badge key={concept} variant="secondary" className="text-xs">
                      {concept.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
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
        <p className="text-xs mt-2">Start investigating a problem to see how the AI adapts to your learning style.</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4 p-4">
        {/* Current Path */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
                Current Learning Path
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </h4>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>This explains why the AI has organized your learning in this particular way, based on the concepts you need to master.</p>
            </TooltipContent>
          </Tooltip>
          <div className="p-3 bg-muted/30 rounded-lg text-sm">
            <p className="text-muted-foreground">{pathExplanation.reasoning}</p>
          </div>
        </div>

        {/* Student Profile */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
                Student Learning Profile
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </h4>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltipDefinitions.studentProfile}</p>
            </TooltipContent>
          </Tooltip>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between text-sm cursor-help">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Learning Pace
                    <HelpCircle className="w-3 h-3" />
                  </span>
                  <Badge variant="outline">{pathExplanation.studentProfile.learningPace}</Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>How quickly you tend to move through concepts. The AI adjusts content complexity accordingly.</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between text-sm cursor-help">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Preferred Mode
                    <HelpCircle className="w-3 h-3" />
                  </span>
                  <Badge variant="outline">{pathExplanation.studentProfile.preferredMode}</Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your preferred way of learning: questioning (discovery), hints (guided), explain (direct), or challenge (advanced).</p>
              </TooltipContent>
            </Tooltip>
            {pathExplanation.studentProfile.strengths.length > 0 && (
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                      Strengths:
                      <HelpCircle className="w-3 h-3" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Areas where you've shown strong understanding. The AI may build on these when introducing new concepts.</p>
                  </TooltipContent>
                </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                      Areas for Growth:
                      <HelpCircle className="w-3 h-3" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Topics where additional practice would help. The AI will provide extra support in these areas.</p>
                  </TooltipContent>
                </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
                  Path Adaptations
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </h4>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltipDefinitions.pathAdaptations}</p>
              </TooltipContent>
            </Tooltip>
            <div className="space-y-2">
              {pathExplanation.adaptations.map((adaptation, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-muted/30 rounded text-sm cursor-help">
                      <p className="font-medium">{adaptation.change}</p>
                      <p className="text-xs text-muted-foreground">
                        Trigger: {adaptation.trigger} | Benefit: {adaptation.benefit}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>The AI made this change to your learning path because: {adaptation.trigger}. Expected benefit: {adaptation.benefit}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
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
        <TooltipProvider delayDuration={300}>
          <SheetHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-full bg-primary/10 cursor-help">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Transparency Panel - See how the AI makes decisions to support your learning</p>
                  </TooltipContent>
                </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltipDefinitions.viewerRole}</p>
                </TooltipContent>
              </Tooltip>
              <Select
                value={state.viewerRole}
                onValueChange={(v) => setViewerRole(v as typeof state.viewerRole)}
              >
                <SelectTrigger className="h-8 text-xs w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <span className="flex items-center gap-2">Student View</span>
                  </SelectItem>
                  <SelectItem value="parent">
                    <span className="flex items-center gap-2">Parent View</span>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <span className="flex items-center gap-2">Teacher View</span>
                  </SelectItem>
                  <SelectItem value="admin">
                    <span className="flex items-center gap-2">Admin View</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2 mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'activity' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setActiveTab('activity')}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Activity Log
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipDefinitions.activityLog}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'path' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setActiveTab('path')}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Learning Path
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipDefinitions.learningPath}</p>
                </TooltipContent>
              </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help">
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
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                {state.viewerRole === 'student'
                  ? 'This panel helps you understand how the AI tutor is personalizing your learning experience.'
                  : state.viewerRole === 'parent'
                  ? 'Review how the AI is supporting your child\'s learning journey and the decisions it makes.'
                  : state.viewerRole === 'teacher'
                  ? 'Analyze the AI\'s pedagogical decisions and how it adapts to student needs.'
                  : 'Full access to all AI decision data, reasoning, and system-level analytics.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}

// Floating toggle button for easy access
export function ExplainabilityToggle({ className }: { className?: string }) {
  const { state, toggleSidebar } = useExplainability();

  return (
    <TooltipProvider delayDuration={300}>
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
        <TooltipContent className="max-w-xs">
          <p className="font-medium">AI Transparency Panel</p>
          <p className="text-xs mt-1">View how the AI makes decisions to personalize your learning. See reasoning, confidence levels, and learning path adaptations.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
