"use client";

import { useState } from 'react';
import { CornerDownLeft, Bot, User, HelpCircle } from 'lucide-react';
import type { Message } from '@/lib/types';
import { askTutor } from '@/ai/flows/ai-tutor-assistance';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EducationalTooltip } from '@/components/ui/educational-tooltip';
import { ethicalTooltipDefinitions } from '@/lib/ethical-design-tooltips';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AITutorProps {
  nodeId: string;
}

export function AITutor({ nodeId }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "I'm your AI Tutor! Ask me anything about this topic." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askTutor({ nodeId, question: input });
      const assistantMessage: Message = { role: 'assistant', text: result.answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error asking tutor:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not get a response from the AI tutor. Please try again.",
      });
      // Restore user message for retry
      setMessages(prev => prev.slice(0, -1));
      setInput(input);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <EducationalTooltip
          definition={ethicalTooltipDefinitions.learn_ai_tutor}
          side="left"
        >
          <CardTitle className="flex items-center gap-2 cursor-help">
            <Bot />
            AI Tutor
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </CardTitle>
        </EducationalTooltip>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow min-h-0">
        <ScrollArea className="flex-grow pr-4 -mr-4 mb-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex items-start gap-3", msg.role === 'user' && 'justify-end')}>
                {msg.role === 'assistant' && (
                  <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("rounded-lg p-3 max-w-[85%]", msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User size={18} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleAskQuestion} className="flex gap-2 items-center">
          <EducationalTooltip
            definition={{
              id: "ai_tutor_input",
              component: "AITutor",
              content: "Type your questions about the concept here.",
              ethicalDesign: {
                principle: "Learner Voice",
                rationale: "Questions drive learning and help identify gaps in understanding.",
                category: "autonomy" as const,
              },
              pedagogy: "Student questions reveal their thinking process.",
              technical: "Questions sent to LLM with concept context.",
            }}
            side="top"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-grow"
            />
          </EducationalTooltip>
          <EducationalTooltip
            definition={{
              id: "ai_tutor_send",
              component: "AITutor",
              content: "Send your question to the AI tutor.",
              ethicalDesign: {
                principle: "Immediate Feedback",
                rationale: "Quick responses maintain learning momentum.",
                category: "engagement" as const,
              },
              pedagogy: "Timely feedback supports learning flow.",
            }}
            side="top"
          >
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <CornerDownLeft className="h-4 w-4" />
              <span className="sr-only">Ask</span>
            </Button>
          </EducationalTooltip>
        </form>
      </CardContent>
    </Card>
  );
}
