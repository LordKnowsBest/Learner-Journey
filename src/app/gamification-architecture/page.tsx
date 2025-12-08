"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Trophy,
    Zap,
    GraduationCap,
    Target,
    Users,
    Code,
    ArrowRight,
    Star,
    Shield,
    Activity,
    Flame,
} from "lucide-react";
import { useGamification, BADGES } from "@/context/GamificationContext";

export default function GamificationArchitecturePage() {
    const { state, addXP, incrementStreak } = useGamification();
    const [activeRole, setActiveRole] = useState("student");
    const [simulatedXP, setSimulatedXP] = useState(0);

    // Calculate progress to next level
    const xpForNextLevel = 100; // Based on GamificationContext logic: Math.floor(xp / 100) + 1
    const currentLevelProgress = state.xp % xpForNextLevel;

    const handleSimulateAction = (amount: number, reason: string) => {
        addXP(amount, reason);
        setSimulatedXP((prev) => prev + amount);
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Gamification Architecture
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A transparency report on how game mechanics drive engagement, mastery, and ethical learning.
                </p>
            </div>

            {/* Live Context Debugger / HUD Equivalent */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Live System State (Interactive)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-background border shadow-sm">
                            <div className="text-sm text-muted-foreground">Current Level</div>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                Level {state.level}
                                <Badge variant="secondary" className="text-xs">
                                    {state.xp} Total XP
                                </Badge>
                            </div>
                            <Progress value={currentLevelProgress} className="h-2 mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                                {currentLevelProgress} / {xpForNextLevel} XP to Level {state.level + 1}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-background border shadow-sm">
                            <div className="text-sm text-muted-foreground">Streak</div>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {state.currentStreak} Days
                                <Flame className={`w-5 h-5 ${state.currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-300"}`} />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 h-6 text-xs w-full"
                                onClick={incrementStreak}
                            >
                                Simulate Day Active
                            </Button>
                        </div>
                        <div className="p-4 rounded-lg bg-background border shadow-sm">
                            <div className="text-sm text-muted-foreground">Badges Earned</div>
                            <div className="text-2xl font-bold">
                                {state.achievements.length} / {Object.keys(BADGES).length}
                            </div>
                            <div className="flex -space-x-2 mt-2 overflow-hidden">
                                {state.achievements.length > 0 ? (
                                    state.achievements.map((a) => (
                                        <div
                                            key={a.id}
                                            className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs"
                                            title={BADGES[a.badgeId]?.name}
                                        >
                                            {BADGES[a.badgeId]?.icon}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground ml-2">No badges yet</span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-background border shadow-sm">
                            <div className="text-sm text-muted-foreground">Session XP</div>
                            <div className="text-2xl font-bold text-green-600">+{simulatedXP}</div>
                            <p className="text-xs text-muted-foreground">
                                Gained this session
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="student" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
                    <TabsTrigger value="student">Student View</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher View</TabsTrigger>
                    <TabsTrigger value="system">System Rules</TabsTrigger>
                </TabsList>

                {/* STUDENT VIEW */}
                <TabsContent value="student" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    XP Drivers
                                </CardTitle>
                                <CardDescription>
                                    Actions that drive progress and mastery.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Reward</TableHead>
                                            <TableHead>Try It</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Complete Phase</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">100-150 XP</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSimulateAction(100, "Phase Complete")}
                                                >
                                                    Simulate
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Deep Reasoning</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">+50 Bonus</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSimulateAction(50, "Deep Reasoning")}
                                                >
                                                    Simulate
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Daily Streak</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Multiplier</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">Auto-applied</span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Badge Showcase
                                </CardTitle>
                                <CardDescription>
                                    Milestones for explorer, streak, and mastery tracks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.values(BADGES).map((badge) => (
                                        <TooltipProvider key={badge.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-help transition-colors">
                                                        <div className="text-2xl">{badge.icon}</div>
                                                        <div className="text-left">
                                                            <div className="font-semibold text-sm">{badge.name}</div>
                                                            <Badge variant="secondary" className="text-[10px] h-5">
                                                                {badge.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-semibold">{badge.name}</p>
                                                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TEACHER VIEW */}
                <TabsContent value="teacher" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Teacher Dashboard Impacts
                            </CardTitle>
                            <CardDescription>
                                How gamification data translates to instructional insights.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        Engagement Proxy
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        XP velocity (XP gained per week) acts as a proxy for student engagement. Sudden drops trigger "Need Support" alerts.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        Mastery Evidence
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        "Mastery" category badges (e.g., Privacy Guardian) are only awarded after passing Socratic gates, serving as verified evidence of learning.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        Consistency Tracking
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Streak data helps teachers identify "crammers" vs. consistent learners, allowing for better study habit coaching.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM VIEW */}
                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                Underlying Logic
                            </CardTitle>
                            <CardDescription>
                                The mathematical rules governing the gamification engine.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                                <p className="text-muted-foreground">// Level Calculation</p>
                                <p className="text-foreground">Level = floor(XP / 100) + 1</p>

                                <p className="text-muted-foreground mt-4">// Streak Logic</p>
                                <p className="text-foreground">If (LastActivity == Yesterday) Streak++</p>
                                <p className="text-foreground">Else If (LastActivity &lt; Yesterday) Streak = 1</p>

                                <p className="text-muted-foreground mt-4">// Badge Assignment</p>
                                <p className="text-foreground">Grant Badge IF (CriteriaMet AND !HasBadge)</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Design Philosophy</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        <li><strong>Intrinsic First:</strong> Visuals are minimal to avoid distracting from content.</li>
                                        <li><strong>Competence focused:</strong> Badges celebrate skills, not just time spent.</li>
                                        <li><strong>No Leaderboards:</strong> Avoids demotivating struggling students.</li>
                                    </ul>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Future Roadmap</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        <li>Class-wide challenges (cooperative)</li>
                                        <li>Hidden "Easter Egg" badges for curiosity</li>
                                        <li>Customizable avatar accessories based on level</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
