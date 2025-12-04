"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { knowledgeGraphNodes } from '@/lib/data';
import type { KnowledgeNode } from '@/lib/types';
import { Quiz } from '@/components/quiz';
import { AITutor } from '@/components/ai-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Film, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConceptLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { completeNode, legacySession } = useSession();
  const { toast } = useToast();
  
  const [node, setNode] = useState<KnowledgeNode | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const nodeId = params.nodeId as string;

  useEffect(() => {
    const currentNode = knowledgeGraphNodes.find(n => n.id === nodeId);
    if (currentNode) {
      setNode(currentNode);
    } else {
      router.push('/graph');
    }
  }, [nodeId, router]);
  
  // Redirect if trying to access already completed node for quiz
  useEffect(() => {
    if (legacySession.completedNodes.includes(nodeId)) {
        toast({ title: "Concept Already Completed", description: "You have already completed this concept." });
        router.push('/graph');
    }
  }, [nodeId, legacySession.completedNodes, router, toast]);

  const handleQuizComplete = (score: number) => {
    if (node) {
      // Must get 2/3 correct
      if (score >= 66) {
        completeNode(node.id);
        toast({
            title: "Quiz Passed!",
            description: `You scored ${Math.round(score)}%. Great job!`,
        });
      } else {
        toast({
            variant: "destructive",
            title: "Keep Trying!",
            description: `You scored ${Math.round(score)}%. You need at least 67% to pass. Please review the material and try again.`,
        });
        setShowQuiz(false); // Let them try again
      }
    }
  };

  if (!node) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading concept...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
      {!showQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-headline">{node.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={node.videoUrl}
                    title={node.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a href={node.articleUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Article: {node.articleTitle}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                    <Button onClick={() => setShowQuiz(true)} size="lg" className="flex-1">
                        <Film className="mr-2 h-4 w-4" />
                        I'm ready for the quiz!
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <AITutor nodeId={node.id} />
          </div>
        </div>
      ) : (
        <Quiz
          questions={node.quiz}
          onComplete={handleQuizComplete}
          title={`${node.title} Quiz`}
          description="Test your knowledge on this concept."
        />
      )}
    </div>
  );
}
