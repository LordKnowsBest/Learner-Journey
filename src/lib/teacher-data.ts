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

// ... existing exports

export interface AdaptivePathModule {
    id: string;
    title: string;
    type: 'core' | 'support' | 'challenge';
    status: 'completed' | 'in-progress' | 'upcoming' | 'skipped';
    score?: number;
    assignedAt: string;
    completedAt?: string;
}

export interface ExplainabilityLog {
    id: string;
    moduleId: string;
    action: 'assigned' | 'adapted';
    reason: string;
    factors: string[];
    ethicalAlignment: string; // e.g., "Transparency: Student performance triggered support module"
    timestamp: string;
}

export interface StudentReport {
    studentId: string;
    summary: string;
    path: AdaptivePathModule[];
    explainabilityLogs: ExplainabilityLog[];
}

export const MOCK_STUDENT_REPORTS: Record<string, StudentReport> = {
    "stu_01": {
        studentId: "stu_01",
        summary: "Alex is mastering core concepts quickly. The system challenged Alex with advanced ethics scenarios.",
        path: [
            { id: "mod_1", title: "Intro to AI Ethics", type: "core", status: "completed", score: 95, assignedAt: "2024-03-01", completedAt: "2024-03-02" },
            { id: "mod_2", title: "Bias in Algorithms", type: "core", status: "completed", score: 88, assignedAt: "2024-03-03", completedAt: "2024-03-05" },
            { id: "mod_challenge_1", title: "Advanced Scenario: Healthcare Allocation", type: "challenge", status: "in-progress", assignedAt: "2024-03-06" },
            { id: "mod_3", title: "Privacy & Surveillance", type: "core", status: "upcoming", assignedAt: "2024-03-10" }
        ],
        explainabilityLogs: [
            {
                id: "log_1",
                moduleId: "mod_challenge_1",
                action: "adapted",
                reason: "Identify High Mastery > 85%",
                factors: ["Quiz Score: 95%", "Engagement: High"],
                ethicalAlignment: "Growth: System allows students to progress at their own pace without penalty.",
                timestamp: "2024-03-05T14:30:00Z"
            }
        ]
    },
    "stu_04": {
        studentId: "stu_04",
        summary: "Jason is struggling with the 'Bias' concept. The system inserted a support module to reinforce fundamentals.",
        path: [
            { id: "mod_1", title: "Intro to AI Ethics", type: "core", status: "completed", score: 72, assignedAt: "2024-03-01", completedAt: "2024-03-03" },
            { id: "mod_2", title: "Bias in Algorithms", type: "core", status: "completed", score: 45, assignedAt: "2024-03-04", completedAt: "2024-03-06" },
            { id: "mod_support_1", title: "Review: What is Data Bias?", type: "support", status: "in-progress", assignedAt: "2024-03-07" },
            { id: "mod_3", title: "Privacy & Surveillance", type: "core", status: "upcoming", assignedAt: "2024-03-12" }
        ],
        explainabilityLogs: [
            {
                id: "log_2",
                moduleId: "mod_support_1",
                action: "adapted",
                reason: "Detected Critical Gap < 60%",
                factors: ["Quiz Score: 45%", "Time on Task: Low"],
                ethicalAlignment: "Support: System provides helpful resources rather than grading down immediately.",
                timestamp: "2024-03-06T09:15:00Z"
            }
        ]
    }
};

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
