"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { askSocraticTutor } from "@/ai/flows/ai-tutor-router";
import { useExplainabilityOptional } from "@/context/ExplainabilityContext";
import type { TutorMode } from "@/lib/types";
import { Send, Bot, User, Lightbulb, HelpCircle, BookOpen, Zap } from "lucide-react";

// Tooltip definitions for chat interface
const chatTooltips = {
  aiGuide: "Your AI learning companion uses Socratic questioning to help you discover answers yourself, rather than giving direct answers.",
  modeQuestioning: "The AI is asking questions to guide your thinking and help you discover insights on your own.",
  modeHinting: "The AI is providing subtle clues to help you make progress without giving away the answer.",
  modeExplaining: "The AI is providing direct explanations to help you understand a concept.",
  modeChallenging: "The AI is pushing you to think deeper and consider more complex aspects.",
  suggestedConcept: "Click to mark this concept as discovered. The AI noticed this concept is relevant to your discussion.",
  sendMessage: "Share your thoughts, ask questions, or respond to the guide's questions.",
  inputHint: "Try explaining your reasoning, asking 'why' questions, or sharing what confuses you.",
};

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

  const getModeTooltip = (mode?: TutorMode) => {
    switch (mode) {
      case "socratic":
        return chatTooltips.modeQuestioning;
      case "hint":
        return chatTooltips.modeHinting;
      case "explain":
        return chatTooltips.modeExplaining;
      case "challenge":
        return chatTooltips.modeChallenging;
      default:
        return "AI Guide response";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="flex items-center gap-2 text-lg cursor-help">
                <Bot className="w-5 h-5 text-primary" />
                AI Guide
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{chatTooltips.aiGuide}</p>
            </TooltipContent>
          </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{message.role === "user" ? "Your message" : getModeTooltip(message.mode)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {message.role === "tutor" && message.mode && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs mb-1 cursor-help">
                            {getModeLabel(message.mode)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{getModeTooltip(message.mode)}</p>
                        </TooltipContent>
                      </Tooltip>
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
                            <Tooltip key={concept}>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-primary/20"
                                  onClick={() => onConceptDiscover(concept)}
                                >
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  {concept}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{chatTooltips.suggestedConcept}</p>
                              </TooltipContent>
                            </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts or ask a question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{chatTooltips.inputHint}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{chatTooltips.sendMessage}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              The guide will ask questions to help you think - not give you answers
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
