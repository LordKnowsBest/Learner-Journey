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
import { EducationalTooltip } from '@/components/ui/educational-tooltip';
import { ethicalTooltipDefinitions } from '@/lib/ethical-design-tooltips';
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

// Helper function to get event type tooltip definition
const getEventTypeTooltip = (eventType: ExplainabilityEventType) => {
  const eventMap: Record<ExplainabilityEventType, string> = {
    tutor_response: 'explainability_event_tutor_response',
    mode_change: 'explainability_event_mode_change',
    concept_revealed: 'explainability_event_concept_revealed',
    phase_transition: 'explainability_event_phase_transition',
    mastery_update: 'explainability_event_mastery_update',
    path_adaptation: 'explainability_event_path_adaptation',
    hint_triggered: 'explainability_event_hint_triggered',
    reflection_feedback: 'explainability_event_reflection_feedback',
  };
  return ethicalTooltipDefinitions[eventMap[eventType]] || ethicalTooltipDefinitions.explainability_panel;
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <EducationalTooltip
        definition={getEventTypeTooltip(entry.eventType)}
        side="left"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left cursor-help">
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
      </EducationalTooltip>
      <CollapsibleContent>
        <div className="pl-12 pr-3 pb-3 space-y-3">
          {/* Explanation */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.explainability_what_happened}
              side="top"
            >
              <p className="text-sm font-medium mb-1 flex items-center gap-1 cursor-help">
                What happened:
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </p>
            </EducationalTooltip>
            <p className="text-sm text-muted-foreground">{entry.explanation}</p>
          </div>

          {/* Reasoning */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.explainability_reasoning}
              side="top"
            >
              <p className="text-sm font-medium mb-1 flex items-center gap-1 cursor-help">
                <Brain className="w-4 h-4" />
                Why this approach:
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </p>
            </EducationalTooltip>
            <p className="text-sm text-muted-foreground">{entry.reasoning}</p>
          </div>

          {/* Factors */}
          {entry.factors.length > 0 && (
            <div>
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.explainability_factors}
                side="top"
              >
                <p className="text-sm font-medium mb-2 flex items-center gap-1 cursor-help">
                  Factors considered:
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </p>
              </EducationalTooltip>
              <div className="space-y-1">
                {entry.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                  >
                    <span className="font-medium">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{factor.value}</span>
                      <EducationalTooltip
                        definition={ethicalTooltipDefinitions.explainability_factor_impact}
                        side="left"
                      >
                        <Badge
                          variant={factor.impact === 'positive' ? 'default' :
                                  factor.impact === 'negative' ? 'destructive' : 'secondary'}
                          className="text-xs cursor-help"
                        >
                          {factor.impact === 'positive' ? '+' :
                           factor.impact === 'negative' ? '-' : '○'}
                        </Badge>
                      </EducationalTooltip>
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
                <EducationalTooltip
                  definition={ethicalTooltipDefinitions.explainability_mode_badge}
                  side="top"
                >
                  <Badge variant="outline" className="text-xs cursor-help">
                    Mode: {entry.aiDecision.mode}
                  </Badge>
                </EducationalTooltip>
              )}
              {entry.aiDecision.confidence !== undefined && (
                <EducationalTooltip
                  definition={ethicalTooltipDefinitions.confidence_badge}
                  side="top"
                >
                  <Badge variant="outline" className="text-xs cursor-help">
                    Confidence: {Math.round(entry.aiDecision.confidence * 100)}%
                  </Badge>
                </EducationalTooltip>
              )}
            </div>
          )}

          {/* Related Concepts */}
          {entry.relatedConcepts && entry.relatedConcepts.length > 0 && (
            <div>
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.explainability_related_concepts}
                side="top"
              >
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                  Related concepts:
                  <HelpCircle className="w-3 h-3" />
                </p>
              </EducationalTooltip>
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
    <div className="space-y-4 p-4">
      {/* Current Path */}
      <div>
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.explainability_current_path}
          side="top"
        >
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
            Current Learning Path
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </h4>
        </EducationalTooltip>
        <div className="p-3 bg-muted/30 rounded-lg text-sm">
          <p className="text-muted-foreground">{pathExplanation.reasoning}</p>
        </div>
      </div>

      {/* Student Profile */}
      <div>
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.explainability_student_profile}
          side="top"
        >
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
            Student Learning Profile
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </h4>
        </EducationalTooltip>
        <div className="space-y-2">
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.explainability_learning_pace}
            side="left"
          >
            <div className="flex items-center justify-between text-sm cursor-help">
              <span className="text-muted-foreground flex items-center gap-1">
                Learning Pace
                <HelpCircle className="w-3 h-3" />
              </span>
              <Badge variant="outline">{pathExplanation.studentProfile.learningPace}</Badge>
            </div>
          </EducationalTooltip>
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.explainability_preferred_mode}
            side="left"
          >
            <div className="flex items-center justify-between text-sm cursor-help">
              <span className="text-muted-foreground flex items-center gap-1">
                Preferred Mode
                <HelpCircle className="w-3 h-3" />
              </span>
              <Badge variant="outline">{pathExplanation.studentProfile.preferredMode}</Badge>
            </div>
          </EducationalTooltip>
          {pathExplanation.studentProfile.strengths.length > 0 && (
            <div>
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.explainability_strengths}
                side="top"
              >
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                  Strengths:
                  <HelpCircle className="w-3 h-3" />
                </p>
              </EducationalTooltip>
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
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.explainability_areas_for_growth}
                side="top"
              >
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                  Areas for Growth:
                  <HelpCircle className="w-3 h-3" />
                </p>
              </EducationalTooltip>
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
          <EducationalTooltip
            definition={ethicalTooltipDefinitions.explainability_path_adaptations}
            side="top"
          >
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1 cursor-help">
              Path Adaptations
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </h4>
          </EducationalTooltip>
          <div className="space-y-2">
            {pathExplanation.adaptations.map((adaptation, i) => (
              <EducationalTooltip
                key={i}
                definition={{
                  id: `adaptation_${i}`,
                  component: "LearningPathSection",
                  content: `The AI made this change: ${adaptation.change}`,
                  ethicalDesign: {
                    principle: "Adaptation Transparency",
                    rationale: `Trigger: ${adaptation.trigger}. Expected benefit: ${adaptation.benefit}`,
                    category: "transparency",
                  },
                  pedagogy: "Understanding adaptations helps learners appreciate personalization.",
                }}
                side="left"
              >
                <div className="p-2 bg-muted/30 rounded text-sm cursor-help">
                  <p className="font-medium">{adaptation.change}</p>
                  <p className="text-xs text-muted-foreground">
                    Trigger: {adaptation.trigger} | Benefit: {adaptation.benefit}
                  </p>
                </div>
              </EducationalTooltip>
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
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.explainability_toggle_button}
          side="left"
        >
          <Button
            variant="outline"
            size="icon"
            className={`fixed right-4 bottom-4 z-50 rounded-full shadow-lg ${className}`}
            onClick={toggleSidebar}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </EducationalTooltip>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.explainability_panel}
                side="bottom"
              >
                <div className="p-2 rounded-full bg-primary/10 cursor-help">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
              </EducationalTooltip>
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
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.explainability_viewer_role}
              side="bottom"
            >
              <div className="flex items-center gap-2 cursor-help">
                <Users className="w-4 h-4 text-muted-foreground" />
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </div>
            </EducationalTooltip>
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
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.explainability_activity_log}
              side="bottom"
            >
              <Button
                variant={activeTab === 'activity' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setActiveTab('activity')}
              >
                <Clock className="w-4 h-4 mr-1" />
                Activity Log
              </Button>
            </EducationalTooltip>
            <EducationalTooltip
              definition={ethicalTooltipDefinitions.explainability_learning_path}
              side="bottom"
            >
              <Button
                variant={activeTab === 'path' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setActiveTab('path')}
              >
                <Target className="w-4 h-4 mr-1" />
                Learning Path
              </Button>
            </EducationalTooltip>
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
          <EducationalTooltip
            definition={{
              id: "explainability_footer_dynamic",
              component: "ExplainabilitySidebar",
              content: state.viewerRole === 'student'
                ? 'This panel helps you understand how the AI tutor is personalizing your learning experience.'
                : state.viewerRole === 'parent'
                ? "Review how the AI is supporting your child's learning journey and the decisions it makes."
                : state.viewerRole === 'teacher'
                ? "Analyze the AI's pedagogical decisions and how it adapts to student needs."
                : 'Full access to all AI decision data, reasoning, and system-level analytics.',
              ethicalDesign: {
                principle: "Role-Appropriate Transparency",
                rationale: "Different stakeholders benefit from different levels of explanation and context.",
                category: "transparency",
                references: ["Privacy by Design", "Multi-Stakeholder AI Transparency"],
              },
              pedagogy: "Understanding AI decisions empowers informed collaboration in learning.",
              technical: "Footer content is dynamically generated based on the selected viewer role.",
            }}
            side="top"
          >
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
          </EducationalTooltip>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Floating toggle button for easy access
export function ExplainabilityToggle({ className }: { className?: string }) {
  const { state, toggleSidebar } = useExplainability();

  return (
    <EducationalTooltip
      definition={ethicalTooltipDefinitions.explainability_toggle_button}
      side="bottom"
    >
      <Button
        variant={state.isVisible ? 'default' : 'outline'}
        size="sm"
        className={`gap-2 ${className}`}
        onClick={toggleSidebar}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">AI Transparency</span>
      </Button>
    </EducationalTooltip>
  );
}
