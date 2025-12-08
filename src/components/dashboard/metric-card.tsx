import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    progress?: number;
    className?: string; // Add className prop for flexibility
}

export function MetricCard({
    label,
    value,
    subtext,
    trend,
    trendValue,
    progress,
    className, // Destructure className
}: MetricCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}> {/* Apply className here */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                {trend && (
                    <div
                        className={cn(
                            "flex items-center text-xs font-medium",
                            trend === "up"
                                ? "text-green-500"
                                : trend === "down"
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                        )}
                    >
                        {trend === "up" && <ArrowUpIcon className="mr-1 h-3 w-3" />}
                        {trend === "down" && <ArrowDownIcon className="mr-1 h-3 w-3" />}
                        {trend === "neutral" && <ArrowRightIcon className="mr-1 h-3 w-3" />}
                        {trendValue}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {progress !== undefined && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                )}
                {subtext && <p className="mt-2 text-xs text-muted-foreground">{subtext}</p>}
            </CardContent>
        </Card>
    );
}
