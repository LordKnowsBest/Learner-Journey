import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { EthicalTooltipDefinition } from "@/lib/ethical-design-tooltips";

export interface MetricCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    progress?: number;
    className?: string;
    tooltip?: string;
    /** Educational tooltip definition for multi-layer explanations */
    tooltipDefinition?: EthicalTooltipDefinition;
    tooltipSide?: "top" | "right" | "bottom" | "left";
}

export function MetricCard({
    label,
    value,
    subtext,
    trend,
    trendValue,
    progress,
    className,
    tooltip,
    tooltipDefinition,
    tooltipSide = "bottom",
}: MetricCardProps) {
    return (
        <Card className={cn(
            "overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default",
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    {tooltipDefinition ? (
                        <EducationalTooltip definition={tooltipDefinition} side={tooltipSide}>
                            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
                        </EducationalTooltip>
                    ) : tooltip ? (
                        <EducationalTooltip
                            definition={{
                                id: label.toLowerCase().replace(/\s+/g, '_'),
                                component: "MetricCard",
                                content: tooltip,
                                ethicalDesign: {
                                    principle: "Meaningful Metrics",
                                    rationale: "Metrics should inform decisions without creating surveillance or pressure.",
                                    category: "transparency",
                                },
                            }}
                            side={tooltipSide}
                        >
                            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
                        </EducationalTooltip>
                    ) : null}
                </div>
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
