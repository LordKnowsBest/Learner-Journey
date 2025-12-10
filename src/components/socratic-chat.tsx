"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
import { askSocraticTutor } from "@/ai/flows/ai-tutor-router";
import { useExplainabilityOptional } from "@/context/ExplainabilityContext";
import type { TutorMode } from "@/lib/types";
import { Send, Bot, User, Lightbulb, HelpCircle, BookOpen, Zap } from "lucide-react";

interface Message {
  role: "user" | "tutor";
  content: string;
  mode?: TutorMode;
  suggestedConcepts?: string[];
  timestamp: Date;
}

interface SocraticChatProps {
  problemId: string;
  phaseId: string;
  discoveredConcepts: string[];
  onConceptDiscover: (conceptId: string) => void;
}

export function SocraticChat({
  problemId,
  phaseId,
  discoveredConcepts,
  onConceptDiscover,
}: SocraticChatProps) {
  // Optional explainability context - may not be available in all contexts
  const explainability = useExplainabilityOptional();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      content:
        "Hi! I'm here to help you think through this problem. I won't give you the answers - but I'll ask questions to help you discover them yourself. What are you thinking about so far?",
      mode: "socratic",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stuckCount, setStuckCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getModeIcon = (mode?: TutorMode) => {
    switch (mode) {
      case "socratic":
        return <HelpCircle className="w-4 h-4" />;
      case "hint":
        return <Lightbulb className="w-4 h-4" />;
      case "explain":
        return <BookOpen className="w-4 h-4" />;
      case "challenge":
        return <Zap className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getModeLabel = (mode?: TutorMode) => {
    switch (mode) {
      case "socratic":
        return "Questioning";
      case "hint":
        return "Hinting";
      case "explain":
        return "Explaining";
      case "challenge":
        return "Challenging";
      default:
        return "Guide";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check for "stuck" indicators
      const stuckPhrases = [
        "i don't know",
        "idk",
        "help",
        "stuck",
        "confused",
        "no idea",
        "what do you mean",
        "i'm lost",
      ];
      const isStuck = stuckPhrases.some((phrase) =>
        input.toLowerCase().includes(phrase)
      );

      const newStuckCount = isStuck ? stuckCount + 1 : Math.max(0, stuckCount - 1);
      setStuckCount(newStuckCount);

      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await askSocraticTutor({
        problemId,
        phaseId,
        studentMessage: input.trim(),
        discoveredConcepts,
        conversationHistory,
        stuckCount: newStuckCount,
      });

      const tutorMessage: Message = {
        role: "tutor",
        content: response.response,
        mode: response.mode,
        suggestedConcepts: response.suggestedConcepts,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, tutorMessage]);

      // Log to explainability if available
      if (explainability && response.explainability) {
        explainability.logTutorResponse({
          mode: response.mode,
          reasoning: response.explainability.reasoning,
          pedagogicalIntent: response.explainability.pedagogicalIntent,
          factors: response.explainability.adaptationFactors.map(f => ({
            factor: f.factor,
            value: f.observation,
            impact: f.influence.toLowerCase().includes('increase') ? 'positive' as const :
                    f.influence.toLowerCase().includes('maintain') ? 'neutral' as const : 'neutral' as const,
          })),
          relatedConcepts: response.suggestedConcepts,
          confidence: response.explainability.confidenceLevel,
        });
      }

      // Handle concept revelation
      if (response.shouldRevealConcept && response.conceptToReveal) {
        onConceptDiscover(response.conceptToReveal);
      }
    } catch (error) {
      console.error("Error getting tutor response:", error);
      const errorMessage: Message = {
        role: "tutor",
        content:
          "I had trouble processing that. Could you try rephrasing your question?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getModeTooltipDefinition = (mode?: TutorMode) => {
    switch (mode) {
      case "socratic":
        return ethicalTooltipDefinitions.socratic_mode_questioning;
      case "hint":
        return ethicalTooltipDefinitions.socratic_mode_hinting;
      case "explain":
        return ethicalTooltipDefinitions.socratic_mode_explaining;
      case "challenge":
        return ethicalTooltipDefinitions.socratic_mode_challenging;
      default:
        return ethicalTooltipDefinitions.socratic_ai_guide;
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.socratic_ai_guide}
          side="right"
        >
          <CardTitle className="flex items-center gap-2 text-lg cursor-help">
            <Bot className="w-5 h-5 text-primary" />
            AI Guide
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </CardTitle>
        </EducationalTooltip>
      </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <EducationalTooltip
                    definition={message.role === "user"
                      ? {
                          id: "user_message",
                          component: "SocraticChat",
                          content: "Your message",
                          ethicalDesign: {
                            principle: "Learner Voice",
                            rationale: "Your contributions drive the learning conversation.",
                            category: "autonomy",
                          },
                        }
                      : getModeTooltipDefinition(message.mode)
                    }
                    side="top"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-help ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        getModeIcon(message.mode)
                      )}
                    </div>
                  </EducationalTooltip>
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {message.role === "tutor" && message.mode && (
                      <EducationalTooltip
                        definition={getModeTooltipDefinition(message.mode)}
                        side="top"
                      >
                        <Badge variant="outline" className="text-xs mb-1 cursor-help">
                          {getModeLabel(message.mode)}
                        </Badge>
                      </EducationalTooltip>
                    )}
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[85%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    {message.suggestedConcepts &&
                      message.suggestedConcepts.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.suggestedConcepts.map((concept) => (
                            <EducationalTooltip
                              key={concept}
                              definition={ethicalTooltipDefinitions.socratic_suggested_concept}
                              side="top"
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-primary/20"
                                onClick={() => onConceptDiscover(concept)}
                              >
                                <Lightbulb className="w-3 h-3 mr-1" />
                                {concept}
                              </Badge>
                            </EducationalTooltip>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.socratic_input_field}
                side="top"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts or ask a question..."
                  disabled={isLoading}
                  className="flex-1"
                />
              </EducationalTooltip>
              <EducationalTooltip
                definition={ethicalTooltipDefinitions.socratic_send_button}
                side="top"
              >
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </EducationalTooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              The guide will ask questions to help you think - not give you answers
            </p>
          </div>
        </CardContent>
      </Card>
  );
}
