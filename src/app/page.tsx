"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-2xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-bold text-primary">
            Welcome to the KAITE Demo
          </CardTitle>
          <CardDescription className="text-lg">
            Your AI-powered guide to understanding AI Ethics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            You're about to start a 15-minute learning journey. First, you'll take a short diagnostic test to see what you already know. Then, you'll explore a concept and see how much you've learned!
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/diagnostic">
              Start Learning Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
