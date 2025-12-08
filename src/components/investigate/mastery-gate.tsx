"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { evaluateResponse } from "@/lib/scoring-service";
import { useGamification } from "@/context/GamificationContext";
import { AlertCircle, CheckCircle, ArrowRight, Loader2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface MasteryGateProps {
    phasePrompt: string;
    requiredKeywords: string[];
    onPass: () => void;
}

export function MasteryGate({ phasePrompt, requiredKeywords, onPass }: MasteryGateProps) {
    const [response, setResponse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null); // Store scoring result
    const [attempts, setAttempts] = useState(0);

    const { addXP, incrementStreak } = useGamification();

    const handleSubmit = async () => {
        if (!response.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const evaluation = await evaluateResponse(
                phasePrompt,
                response,
                requiredKeywords
            );

            setResult(evaluation);
            setAttempts(prev => prev + 1);

            if (evaluation.passed) {
                // Success Logic
                const xpAmount = evaluation.score > 90 ? 150 : 100; // Bonus for high score
                const bonus = evaluation.reasoningDepth === 'deep' ? 50 : 0;

                addXP(xpAmount + bonus, "Phase Mastery");
                incrementStreak();

                // Wait a moment for the animation before calling onPass
                setTimeout(() => {
                    onPass();
                }, 3000);
            } else {
                // Remediation Logic (just XP for effort)
                addXP(10, "Effort");
            }
        } catch (error) {
            console.error("Evaluation failed", error);
            setResult({
                passed: false,
                score: 0,
                feedback: "An error occurred during evaluation. Please try again.",
                missingConcepts: [],
                strengths: [],
                reasoningDepth: 'shallow'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result && result.passed) {
        return (
            <Card className="border-green-500 bg-green-50/50 dark:bg-green-900/10 backdrop-blur">
                <CardContent className="pt-6 text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                        <Star className="w-10 h-10 text-green-600 fill-green-600" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Mastery Achieved!</h3>
                    <p className="text-muted-foreground">Score: {result.score}%</p>

                    <div className="flex justify-center gap-2">
                        <Badge variant="outline" className="bg-background text-green-600 border-green-200">
                            +100 XP
                        </Badge>
                        {result.reasoningDepth === 'deep' && (
                            <Badge variant="outline" className="bg-background text-purple-600 border-purple-200">
                                +50 Depth Bonus
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm italic">"{result.feedback}"</p>

                    <p className="text-xs text-muted-foreground animate-pulse">Unlocking next phase...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-l-4 ${result && !result.passed ? 'border-l-red-500' : 'border-l-primary'}`}>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    Confirm Understanding
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {attempts === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Before moving on, explain how the concepts you discovered apply to this phase's problem.
                    </p>
                )}

                <Textarea
                    placeholder="I noticed that..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className={result && !result.passed ? 'border-red-300 bg-red-50/50' : ''}
                />

                {/* Feedback Area */}
                <AnimatePresence>
                    {result && !result.passed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-red-100/50 dark:bg-red-900/20 rounded-md space-y-2"
                        >
                            <div className="flex items-center gap-2 text-red-600 font-semibold">
                                <AlertCircle className="w-4 h-4" />
                                <span>Not quite there yet ({result.score}%)</span>
                            </div>
                            <p className="text-sm text-foreground">{result.feedback}</p>

                            {result.missingConcepts.length > 0 && (
                                <div className="text-xs">
                                    <span className="font-semibold">Review these concepts:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {result.missingConcepts.map((c: string) => (
                                            <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !response.trim()}
                    className="w-full"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            Submit for Analysis
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
