"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, PlayCircle, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function LearningPathsTab() {
    const modules = [
        { title: "Module 1: AI Basics", status: "completed", completion: 100, students: 28 },
        { title: "Module 2: Bias & Ethics", status: "active", completion: 65, students: 22 },
        { title: "Module 3: Data Privacy", status: "upcoming", completion: 0, students: 0 },
        { title: "Module 4: Future Work", status: "locked", completion: 0, students: 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Class Curriculum Velocity</CardTitle>
                        <CardDescription>Real-time view of where students are in the learning journey.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l-2 border-muted pl-6 space-y-8 ml-4 my-2">
                            {modules.map((mod, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${mod.status === 'completed' ? 'bg-green-500 border-green-500' :
                                            mod.status === 'active' ? 'bg-primary border-primary ring-4 ring-primary/20' :
                                                'bg-background border-muted'
                                        }`} />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                {mod.title}
                                                {mod.status === 'active' && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current Focus</span>}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {mod.status === 'completed' ? 'All objectives met' :
                                                    mod.status === 'active' ? 'Most students are investigating scenarios' : 'Scheduled for Week 6'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{mod.students}</span>
                                            <span className="text-xs text-muted-foreground block">Active</span>
                                        </div>
                                    </div>
                                    {mod.status !== 'locked' && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>Completion Rate</span>
                                                <span>{mod.completion}%</span>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="cursor-help">
                                                        <Progress value={mod.completion} className="h-2" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{mod.status === 'completed' ? 'All students passed' : `${mod.completion}% of class has passed Mastery Gate`}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Pacing Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <Clock className="w-8 h-8 text-orange-500 bg-orange-100 p-1.5 rounded-lg" />
                                <div>
                                    <p className="text-sm font-medium">Behind Schedule</p>
                                    <p className="text-xs text-muted-foreground mt-1">3 students are stuck on Module 2 for {'>'} 3 days.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Content Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm">
                                    <p className="font-medium text-green-600">Most Engaging</p>
                                    <p className="text-xs text-muted-foreground">"The Ethics of Self-Driving Cars"</p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-red-600">High Friction</p>
                                    <p className="text-xs text-muted-foreground">"Understanding Algorithmic Bias"</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
