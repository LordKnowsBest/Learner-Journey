"use client";

import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { knowledgeGraphNodes } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, CheckCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KnowledgeGraphPage() {
  const { session } = useSession();
  const { completedNodes } = session;

  const nodesInOrder = [...knowledgeGraphNodes].sort((a, b) => a.order - b.order);
  
  // Find the first node in order whose prerequisites are met but which isn't completed yet.
  const nextNode = nodesInOrder.find(node => 
    !completedNodes.includes(node.id) && 
    node.prerequisites.every(prereq => completedNodes.includes(prereq))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Learning Path</h1>
        <p className="text-muted-foreground mt-2">Select a concept to begin. You'll unlock more as you go!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {nodesInOrder.map(node => {
          const isCompleted = completedNodes.includes(node.id);
          const prerequisitesMet = node.prerequisites.every(prereq => completedNodes.includes(prereq));
          const isLocked = !prerequisitesMet;
          const isNext = node.id === nextNode?.id && prerequisitesMet;

          const NodeContent = (
            <Card
              className={cn(
                "h-full flex flex-col text-center transition-all duration-300 transform hover:-translate-y-1",
                isCompleted && "bg-green-100 border-green-500",
                isNext && "border-primary border-2 shadow-lg",
                isLocked && "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              )}
            >
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : isNext ? (
                    <Target className="h-8 w-8 text-primary" />
                  ) : isLocked ? (
                    <Lock className="h-8 w-8" />
                  ) : (
                    // Available but not the primary 'next' node
                    <Target className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg">{node.title}</CardTitle>
                <CardDescription className={cn(isLocked && "text-muted-foreground/80")}>
                  {node.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );

          if (isLocked) {
            return <div key={node.id}>{NodeContent}</div>;
          }

          return (
            <Link key={node.id} href={`/learn/${node.id}`} className="h-full block">
              {NodeContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
