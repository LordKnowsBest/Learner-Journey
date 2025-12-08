import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Zap } from "lucide-react";

interface StatusPillProps {
    status: "on-track" | "needs-attention" | "at-risk" | "accelerated";
    showLabel?: boolean;
    className?: string; // Add className
}

export function StudentPill({ status, showLabel = true, className }: StatusPillProps) {
    const config = {
        "on-track": {
            icon: CheckCircle2,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-100 dark:bg-green-900/30",
            label: "On Track",
        },
        "needs-attention": {
            icon: AlertTriangle,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-100 dark:bg-orange-900/30",
            label: "Needs Attention",
        },
        "at-risk": {
            icon: XCircle,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-100 dark:bg-red-900/30",
            label: "At Risk",
        },
        accelerated: {
            icon: Zap,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            label: "Accelerated",
        },
    }[status];

    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                config.bg,
                config.color,
                className
            )}
        >
            <Icon className="h-3.5 w-3.5" />
            {showLabel && config.label}
        </div>
    );
}
