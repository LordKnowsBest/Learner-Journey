"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Brain, Users, Lightbulb, Target, HelpCircle } from "lucide-react";

// Tooltip definitions for welcome page
const welcomeTooltips = {
  chooseProblem: "Browse real-world scenarios involving AI ethics. Each problem presents different stakeholders and perspectives to consider.",
  investigate: "Work through guided phases, asking questions and uncovering key concepts. There's no single right answer!",
  learnWithAI: "Your AI guide uses Socratic questioning - asking questions to help you think deeper, not giving direct answers.",
  proposeSolutions: "After investigating, you'll consider all perspectives and propose your own thoughtful recommendations.",
  startButton: "Click to see available investigation scenarios and begin your AI ethics learning journey.",
  estimatedTime: "Each problem typically takes 20-30 minutes, but you can take breaks and return anytime.",
};

export default function WelcomePage() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center shadow-2xl animate-fade-in">
          <CardHeader className="space-y-4">
            <CardTitle className="text-4xl font-headline font-bold text-primary">
              Welcome to KAITE
            </CardTitle>
            <CardDescription className="text-xl">
              Learn AI Ethics by Solving Real Problems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-muted-foreground text-lg">
              You'll investigate real-world ethical dilemmas involving AI and technology.
              There are no simple right answers - just like in real life!
            </p>

            {/* How It Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 cursor-help hover:bg-muted transition-colors">
                    <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold flex items-center gap-1">
                        Choose a Problem
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pick a scenario that interests you - from AI in schools to social media algorithms
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{welcomeTooltips.chooseProblem}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 cursor-help hover:bg-muted transition-colors">
                    <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold flex items-center gap-1">
                        Investigate
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Explore the problem from different angles and discover key concepts
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{welcomeTooltips.investigate}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 cursor-help hover:bg-muted transition-colors">
                    <Brain className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold flex items-center gap-1">
                        Learn with AI
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        An AI guide will ask questions to help you think deeper - not give you answers
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{welcomeTooltips.learnWithAI}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 cursor-help hover:bg-muted transition-colors">
                    <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold flex items-center gap-1">
                        Propose Solutions
                        <HelpCircle className="w-3 h-3 text-muted-foreground" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Think about all stakeholders and create your own recommendations
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{welcomeTooltips.proposeSolutions}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="pt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8">
                    <Link href="/problems">
                      Start Your Investigation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{welcomeTooltips.startButton}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground cursor-help inline-flex items-center gap-1">
                  Estimated time: 20-30 minutes per problem
                  <HelpCircle className="w-3 h-3" />
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{welcomeTooltips.estimatedTime}</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
