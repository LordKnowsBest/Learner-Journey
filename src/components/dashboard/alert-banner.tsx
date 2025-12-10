import { AlertCircle, AlertTriangle, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert as AlertType } from "@/lib/teacher-data";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";

interface AlertBannerProps {
    alert: AlertType;
    onDismiss?: (id: string) => void;
    onView?: (id: string) => void;
}

export function AlertBanner({ alert, onDismiss, onView }: AlertBannerProps) {
    const { tier, studentName, triggerType } = alert;

    const styles = {
        CRITICAL: {
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800",
            icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
            text: "text-red-900 dark:text-red-200",
            badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        },
        WARNING: {
            bg: "bg-orange-50 dark:bg-orange-900/20",
            border: "border-orange-200 dark:border-orange-800",
            icon: <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
            text: "text-orange-900 dark:text-orange-200",
            badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        },
        MONITOR: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
            icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            text: "text-blue-900 dark:text-blue-200",
            badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
    }[tier];

    // Get the appropriate tooltip definition based on tier
    const getTooltipDefinition = () => {
        switch (tier) {
            case "CRITICAL":
                return ethicalTooltipDefinitions.alert_critical;
            case "WARNING":
                return ethicalTooltipDefinitions.alert_warning;
            default:
                return ethicalTooltipDefinitions.intervention_alert;
        }
    };

    return (
        <EducationalTooltip definition={getTooltipDefinition()} side="top">
            <div
                className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-all cursor-help",
                    styles.bg,
                    styles.border
                )}
            >
                <div className="mt-0.5">{styles.icon}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn("font-medium flex items-center gap-1", styles.text)}>
                            {tier === "CRITICAL" && "Critical Alert"}
                            {tier === "WARNING" && "Intervention Needed"}
                            {tier === "MONITOR" && "Monitor Status"}
                            <HelpCircle className="h-3 w-3 opacity-50" />
                        </h4>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", styles.badge)}>
                            {triggerType}
                        </span>
                    </div>
                    <p className={cn("mt-1 text-sm", styles.text)}>
                        <span className="font-semibold">{studentName}</span> requires attention.
                    </p>
                    <div className="mt-3 flex gap-2">
                        {onView && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-current bg-transparent hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(alert.alertId);
                                }}
                            >
                                View Details
                            </Button>
                        )}
                        {onDismiss && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDismiss(alert.alertId);
                                }}
                            >
                                Dismiss
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </EducationalTooltip>
    );
}
