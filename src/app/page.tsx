"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Users, Lightbulb, Target } from "lucide-react";

export default function WelcomePage() {
  return (
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
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Choose a Problem</h3>
                <p className="text-sm text-muted-foreground">
                  Pick a scenario that interests you - from AI in schools to social media algorithms
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Investigate</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the problem from different angles and discover key concepts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Brain className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Learn with AI</h3>
                <p className="text-sm text-muted-foreground">
                  An AI guide will ask questions to help you think deeper - not give you answers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Propose Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Think about all stakeholders and create your own recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8">
              <Link href="/problems">
                Start Your Investigation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Estimated time: 20-30 minutes per problem
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
