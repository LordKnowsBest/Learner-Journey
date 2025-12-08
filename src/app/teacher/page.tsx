"use client";

import {
    MOCK_CLASS,
    MOCK_ALERTS,
    MOCK_STUDENTS,
} from "@/lib/teacher-data";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { StudentPill } from "@/components/dashboard/student-pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Clock, BrainCircuit, AlertOctagon } from "lucide-react";

export default function TeacherDashboard() {
    const activeAlerts = MOCK_ALERTS;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{MOCK_CLASS.name}</h1>
                    <p className="text-muted-foreground">
                        {MOCK_CLASS.period} • {MOCK_CLASS.gradeLevel}th Grade • {MOCK_CLASS.studentCount} Students
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Add Date or specialized actions here */}
                    <div className="text-sm font-medium bg-secondary px-4 py-2 rounded-md">
                        {MOCK_CLASS.currentWeek}
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Active Today"
                    value="24/28"
                    subtext="85% attendance"
                    trend="up"
                    trendValue="+12%"
                    progress={85}
                />
                <MetricCard
                    label="Avg Time on Task"
                    value="42m"
                    subtext="Per session avg"
                    trend="neutral"
                    trendValue="0%"
                />
                <MetricCard
                    label="Concepts Mastered"
                    value="18/25"
                    subtext="Class average"
                    trend="up"
                    trendValue="+2"
                    progress={72}
                />
                <MetricCard
                    label="Avg Mastery"
                    value={`${MOCK_CLASS.avgMastery}%`}
                    subtext="Overall score"
                    trend="up"
                    trendValue="+1.5%"
                    progress={MOCK_CLASS.avgMastery}
                />
            </div>

            {/* Alert Section */}
            {activeAlerts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AlertOctagon className="h-5 w-5 text-orange-500" />
                        Intervention Needed ({activeAlerts.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeAlerts.map((alert) => (
                            <AlertBanner key={alert.alertId} alert={alert} />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Class Overview</TabsTrigger>
                    <TabsTrigger value="students">Individual Progress</TabsTrigger>
                    <TabsTrigger value="paths">Learning Paths</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* We can add charts here later. For now showcasing the Roster on Overview or separate? 
               Technically specs say Overview has aggregate metrics. Let's put a "Recent Activity" or "Leaderboard" placeholder.
               Actually, let's just show the Student Roster here for easy access as per common dashboard patterns.
           */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Roster</CardTitle>
                            <CardDescription>Real-time progress monitoring for all students.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Learning Signal</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_STUDENTS.map((student) => (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>
                                                <StudentPill status={student.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{student.learningSignalScore}</span>
                                                    <div className="h-2 w-24 rounded-full bg-secondary">
                                                        <div
                                                            className="h-full rounded-full bg-primary"
                                                            style={{ width: `${student.learningSignalScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button className="text-sm font-medium text-primary hover:underline">View Details</button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/50 border-dashed">
                        <p className="text-muted-foreground">Individual Progress View - Under Construction</p>
                    </div>
                </TabsContent>

                <TabsContent value="paths">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/50 border-dashed">
                        <p className="text-muted-foreground">Learning Knowledge Graph View - Under Construction</p>
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/50 border-dashed">
                        <p className="text-muted-foreground">Compliance & Reports View - Under Construction</p>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
