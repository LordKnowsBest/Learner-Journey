export interface MetricCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    progress?: number; // 0-100 for progress bar
}

export interface Alert {
    alertId: string;
    studentId: string;
    studentName: string;
    classId: string;
    tier: "CRITICAL" | "WARNING" | "MONITOR";
    triggerType: string;
    createdAt: string; // ISO string for mock
    interventionNotes?: string;
}

export interface TeacherClass {
    classId: string;
    name: string;
    period: string;
    gradeLevel: number;
    studentCount: number;
    currentWeek: string;
    avgMastery: number; // 0-100
}

export interface StudentProgress {
    studentId: string;
    name: string;
    learningSignalScore: number;
    status: "on-track" | "needs-attention" | "at-risk" | "accelerated";
    gradeTrend: "up" | "down" | "neutral";
    lastActive: string;
    alerts: Alert[];
}

export const MOCK_CLASS: TeacherClass = {
    classId: "cls_123",
    name: "Intro to AI Ethics",
    period: "Period 3",
    gradeLevel: 8,
    studentCount: 28,
    currentWeek: "Week 4 of 12",
    avgMastery: 76.5,
};

export const MOCK_ALERTS: Alert[] = [
    {
        alertId: "alt_1",
        studentId: "stu_04",
        studentName: "Jason M.",
        classId: "cls_123",
        tier: "CRITICAL",
        triggerType: "mastery_drop",
        createdAt: new Date().toISOString(),
    },
    {
        alertId: "alt_2",
        studentId: "stu_11",
        studentName: "Sarah K.",
        classId: "cls_123",
        tier: "WARNING",
        triggerType: "inactivity",
        createdAt: new Date().toISOString(),
    },
];

export const MOCK_STUDENTS: StudentProgress[] = [
    {
        studentId: "stu_01",
        name: "Alex R.",
        learningSignalScore: 88,
        status: "on-track",
        gradeTrend: "up",
        lastActive: "2 min ago",
        alerts: [],
    },
    {
        studentId: "stu_04",
        name: "Jason M.",
        learningSignalScore: 42,
        status: "at-risk",
        gradeTrend: "down",
        lastActive: "1 day ago",
        alerts: [MOCK_ALERTS[0]],
    },
    {
        studentId: "stu_11",
        name: "Sarah K.",
        learningSignalScore: 58,
        status: "needs-attention",
        gradeTrend: "neutral",
        lastActive: "4 hours ago",
        alerts: [MOCK_ALERTS[1]],
    },
    {
        studentId: "stu_15",
        name: "Emily W.",
        learningSignalScore: 94,
        status: "accelerated",
        gradeTrend: "up",
        lastActive: "10 min ago",
        alerts: [],
    },
    // Add more mock students as needed for UI density
    { studentId: "stu_02", name: "Jordan B.", learningSignalScore: 75, status: "on-track", gradeTrend: "neutral", lastActive: "1 hour ago", alerts: [] },
    { studentId: "stu_03", name: "Casey L.", learningSignalScore: 82, status: "on-track", gradeTrend: "up", lastActive: "30 min ago", alerts: [] },
    { studentId: "stu_05", name: "Morgan T.", learningSignalScore: 71, status: "on-track", gradeTrend: "neutral", lastActive: "15 min ago", alerts: [] },
];

// Helper to export data to CSV
export function exportClassDataToCSV(): string {
    const headers = ["Student ID", "Name", "Status", "Grade Trend", "Learning Signal", "Last Active"];
    const rows = MOCK_STUDENTS.map(s => [
        s.studentId,
        s.name,
        s.status,
        s.gradeTrend,
        s.learningSignalScore.toString(),
        s.lastActive
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    return csvContent;
}
