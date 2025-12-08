"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/teacher-data";
import { StudentPill } from "@/components/dashboard/student-pill";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function IndividualProgressTab() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-sm w-full">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search students..." className="h-9" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Download className="w-4 h-4" />
                        Export View
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Progress Tracking</CardTitle>
                    <CardDescription>Comprehensive view of student performance across all modules.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Current Module</TableHead>
                                <TableHead>Improvement</TableHead>
                                <TableHead>Last Assessment</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_STUDENTS.map((student) => (
                                <TableRow key={student.studentId}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{student.name}</span>
                                            <span className="text-xs text-muted-foreground">ID: {student.studentId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StudentPill status={student.status} />
                                            <span className="text-xs text-muted-foreground ml-2">Phase 2: Investigation</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.gradeTrend === 'up' ? 'bg-green-100 text-green-700' :
                                                    student.gradeTrend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {student.gradeTrend === 'up' ? '↗ Increasing' : student.gradeTrend === 'down' ? '↘ Needs Support' : '→ Stable'}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{student.gradeTrend === 'up' ? '+5% avg over last 3 sessions' :
                                                    student.gradeTrend === 'down' ? 'Dropped below 70% threshold' : 'Consistent performance'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">85%</span>
                                            <span className="text-xs text-muted-foreground">{student.lastActive}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View Report</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
