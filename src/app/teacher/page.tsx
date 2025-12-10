"use client";

import { useState } from "react";
import { StudentReportDialog } from "@/components/dashboard/student-report-dialog";
import {
    MOCK_CLASS,
    MOCK_ALERTS,
    MOCK_STUDENTS,
    exportClassDataToCSV,
    StudentProgress
} from "@/lib/teacher-data";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { StudentPill } from "@/components/dashboard/student-pill";
import { Button } from "@/components/ui/button";
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
import { IndividualProgressTab } from "@/components/dashboard/tabs/individual-progress-tab";
import { LearningPathsTab } from "@/components/dashboard/tabs/learning-paths-tab";
import { ReportsTab } from "@/components/dashboard/tabs/reports-tab";
import { Users, Clock, BrainCircuit, AlertOctagon, FileSpreadsheet, HelpCircle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";

export default function TeacherDashboard() {
    const activeAlerts = MOCK_ALERTS;
    const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
    const [reportOpen, setReportOpen] = useState(false);

    return (
        <TooltipProvider>
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
                        <EducationalTooltip
                            definition={ethicalTooltipDefinitions.report_export_csv}
                            side="bottom"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                                onClick={() => {
                                    const csv = exportClassDataToCSV();
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `class_roster_${new Date().toISOString().split('T')[0]}.csv`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }}
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </EducationalTooltip>

                        <div className="text-sm font-medium bg-secondary px-4 py-2 rounded-md cursor-default hover:bg-secondary/80 transition-colors">
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
                        tooltipDefinition={ethicalTooltipDefinitions.metric_active_today}
                    />
                    <MetricCard
                        label="Avg Time on Task"
                        value="42m"
                        subtext="Per session avg"
                        trend="neutral"
                        trendValue="0%"
                        tooltipDefinition={ethicalTooltipDefinitions.metric_time_on_task}
                    />
                    <MetricCard
                        label="Concepts Mastered"
                        value="18/25"
                        subtext="Class average"
                        trend="up"
                        trendValue="+2"
                        progress={72}
                        tooltipDefinition={ethicalTooltipDefinitions.metric_concepts_mastered}
                    />
                    <MetricCard
                        label="Avg Mastery"
                        value={`${MOCK_CLASS.avgMastery}%`}
                        subtext="Overall score"
                        trend="up"
                        trendValue="+1.5%"
                        progress={MOCK_CLASS.avgMastery}
                        tooltipDefinition={ethicalTooltipDefinitions.metric_avg_mastery}
                    />
                </div>

                {/* Alert Section */}
                {
                    activeAlerts.length > 0 && (
                        <div className="space-y-4">
                            <EducationalTooltip
                                definition={ethicalTooltipDefinitions.intervention_alert}
                                side="right"
                            >
                                <h3 className="text-lg font-semibold flex items-center gap-2 cursor-help w-fit">
                                    <AlertOctagon className="h-5 w-5 text-orange-500" />
                                    Intervention Needed ({activeAlerts.length})
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </h3>
                            </EducationalTooltip>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activeAlerts.map((alert) => (
                                    <AlertBanner key={alert.alertId} alert={alert} />
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <EducationalTooltip
                            definition={ethicalTooltipDefinitions.tab_class_overview}
                            side="bottom"
                        >
                            <TabsTrigger value="overview">Class Overview</TabsTrigger>
                        </EducationalTooltip>
                        <EducationalTooltip
                            definition={ethicalTooltipDefinitions.tab_individual_progress}
                            side="bottom"
                        >
                            <TabsTrigger value="students">Individual Progress</TabsTrigger>
                        </EducationalTooltip>
                        <EducationalTooltip
                            definition={ethicalTooltipDefinitions.tab_learning_paths}
                            side="bottom"
                        >
                            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
                        </EducationalTooltip>
                        <EducationalTooltip
                            definition={ethicalTooltipDefinitions.tab_reports}
                            side="bottom"
                        >
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </EducationalTooltip>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <EducationalTooltip
                                    definition={ethicalTooltipDefinitions.student_roster}
                                    side="right"
                                >
                                    <div className="cursor-help">
                                        <CardTitle className="flex items-center gap-2">
                                            Student Roster
                                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                        </CardTitle>
                                        <CardDescription>Real-time progress monitoring for all students.</CardDescription>
                                    </div>
                                </EducationalTooltip>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>
                                                <EducationalTooltip
                                                    definition={ethicalTooltipDefinitions.student_status_pill}
                                                    side="top"
                                                >
                                                    <span className="cursor-help flex items-center gap-1">
                                                        Status
                                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                                    </span>
                                                </EducationalTooltip>
                                            </TableHead>
                                            <TableHead>
                                                <EducationalTooltip
                                                    definition={ethicalTooltipDefinitions.learning_signal_score}
                                                    side="top"
                                                >
                                                    <span className="cursor-help flex items-center gap-1">
                                                        Learning Signal
                                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                                    </span>
                                                </EducationalTooltip>
                                            </TableHead>
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
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setReportOpen(true);
                                                            }}
                                                        >
                                                            Report
                                                        </Button>
                                                        <Button variant="link" size="sm">View Details</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="mt-6">
                        <IndividualProgressTab />
                    </TabsContent>

                    <TabsContent value="paths" className="mt-6">
                        <LearningPathsTab />
                    </TabsContent>

                    <TabsContent value="reports" className="mt-6">
                        <ReportsTab />
                    </TabsContent>
                </Tabs>

                {selectedStudent && (
                    <StudentReportDialog
                        studentId={selectedStudent.studentId}
                        studentName={selectedStudent.name}
                        open={reportOpen}
                        onOpenChange={setReportOpen}
                    />
                )}
            </div>
        </TooltipProvider>
    );
}
