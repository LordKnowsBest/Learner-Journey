"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, FileText, Download, Share2, ClipboardCheck, HelpCircle } from "lucide-react";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";

export function ReportsTab() {
    const reports = [
        { title: "Weekly Class Performance", type: "PDF", size: "2.4 MB", date: "Generated today" },
        { title: "Student Mastery Summary", type: "CSV", size: "125 KB", date: "Generated yesterday" },
        { title: "Standards Alignment Map", type: "PDF", size: "4.1 MB", date: "Updated 1 hour ago" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Generate New Report Section */}
                <EducationalTooltip
                    definition={ethicalTooltipDefinitions.tab_reports}
                    side="top"
                >
                    <Card className="bg-primary/5 border-primary/20 cursor-help">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-primary" />
                                Generate Custom Report
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>Select metrics and time range to export data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                                    <div>
                                        <div className="font-semibold mb-1">Class Progress</div>
                                        <div className="text-xs text-muted-foreground">Aggregate scores & completion</div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-left h-auto py-4">
                                    <div>
                                        <div className="font-semibold mb-1">Intervention Log</div>
                                        <div className="text-xs text-muted-foreground">Alerts & teacher actions</div>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Create New Report</Button>
                        </CardFooter>
                    </Card>
                </EducationalTooltip>

                {/* Standards Alignment */}
                <EducationalTooltip
                    definition={ethicalTooltipDefinitions.report_standards_alignment}
                    side="top"
                >
                    <Card className="cursor-help">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5" />
                                Standards Alignment
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>Curriculum coverage for CSTA & AI4K12</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span>CSTA 2-AI-01 (Algorithms)</span>
                                    <EducationalTooltip
                                        definition={{
                                            id: "standard_csta_ai_01",
                                            component: "ReportsTab",
                                            content: "Fully addressed by Modules 1 & 2",
                                            ethicalDesign: {
                                                principle: "Standards Transparency",
                                                rationale: "Making standards alignment visible ensures curriculum meets required competencies.",
                                                category: "transparency",
                                                references: ["CSTA K-12 CS Standards"],
                                            },
                                            pedagogy: "Standards mapping ensures comprehensive coverage.",
                                        }}
                                        side="left"
                                    >
                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold cursor-help">100% Covered</div>
                                    </EducationalTooltip>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>CSTA 2-IC-21 (Impacts of Computing)</span>
                                    <EducationalTooltip
                                        definition={{
                                            id: "standard_csta_ic_21",
                                            component: "ReportsTab",
                                            content: "Fully addressed by Ethics Case Studies",
                                            ethicalDesign: {
                                                principle: "Impact Assessment",
                                                rationale: "Understanding computing impacts is fundamental to ethical AI education.",
                                                category: "transparency",
                                                references: ["CSTA K-12 CS Standards"],
                                            },
                                            pedagogy: "Case studies provide real-world context for abstract standards.",
                                        }}
                                        side="left"
                                    >
                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold cursor-help">100% Covered</div>
                                    </EducationalTooltip>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>AI4K12 Big Idea 3 (Learning)</span>
                                    <EducationalTooltip
                                        definition={{
                                            id: "standard_ai4k12_3",
                                            component: "ReportsTab",
                                            content: "Missing practical lab on Neural Networks (Week 8)",
                                            ethicalDesign: {
                                                principle: "Curriculum Gap Transparency",
                                                rationale: "Identifying coverage gaps helps teachers plan supplemental activities.",
                                                category: "transparency",
                                                references: ["AI4K12 Five Big Ideas"],
                                            },
                                            pedagogy: "Partial coverage indicates areas for hands-on reinforcement.",
                                        }}
                                        side="left"
                                    >
                                        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded text-xs font-bold cursor-help">85% Covered</div>
                                    </EducationalTooltip>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </EducationalTooltip>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {reports.map((report, i) => (
                            <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-muted p-2 rounded">
                                        <FileText className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{report.title}</p>
                                        <p className="text-sm text-muted-foreground">{report.type} • {report.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground mr-4 hidden sm:block">{report.date}</span>
                                    <EducationalTooltip
                                        definition={ethicalTooltipDefinitions.report_export_csv}
                                        side="top"
                                    >
                                        <Button size="icon" variant="ghost">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </EducationalTooltip>
                                    <Button size="icon" variant="ghost">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
