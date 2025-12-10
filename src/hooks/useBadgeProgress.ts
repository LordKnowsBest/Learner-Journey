"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useSession } from "@/context/SessionContext";
import { useGamification } from "@/context/GamificationContext";
import { Badge } from "@/lib/gamification/types";

/**
 * Progress metrics derived from SessionContext
 */
export interface ProgressMetrics {
    // Problem Progress
    problemsCompleted: number;
    problemsInProgress: number;

    // Concept Discovery
    conceptsDiscovered: number;
    conceptIds: string[];

    // Mastery
    maxMasteryLevel: number;
    averageMastery: number;
    conceptsWithHighMastery: number; // 75%+

    // Reflections
    reflectionsSubmitted: number;

    // Scores
    diagnosticScore: number | null;
    postTestScore: number | null;
    scoreImprovement: number;

    // Time
    learningTimeMinutes: number;

    // Streak (from gamification context)
    currentStreak: number;
}

/**
 * Badge progress calculation result
 */
export interface BadgeProgressResult {
    badgeId: string;
    progress: number; // 0-1
    isEligible: boolean;
    missingCriteria: string[];
}

/**
 * Hook that bridges SessionContext progress with the gamification badge system
 */
export function useBadgeProgress() {
    const { session, legacySession } = useSession();
    const { student, badges, unlockBadge, addXP, refresh } = useGamification();

    // Calculate progress metrics from session state
    const metrics: ProgressMetrics = useMemo(() => {
        const completedProblems = session.problemsProgress.filter(
            (p) => p.status === "completed"
        );
        const inProgressProblems = session.problemsProgress.filter(
            (p) => p.status === "investigating" || p.status === "reflecting"
        );

        // Calculate mastery stats
        const masteryValues = Object.values(session.conceptMastery);
        const maxMastery = masteryValues.length > 0 ? Math.max(...masteryValues) : 0;
        const avgMastery =
            masteryValues.length > 0
                ? masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length
                : 0;
        const highMasteryCount = masteryValues.filter((m) => m >= 75).length;

        // Count reflections
        const reflections = session.problemsProgress.reduce(
            (count, problem) => count + problem.reflectionResponses.length,
            0
        );

        // Calculate score improvement
        const diagnosticScore = legacySession.diagnosticScore;
        const postTestScore = legacySession.postTestScore;
        const improvement =
            diagnosticScore !== null && postTestScore !== null
                ? postTestScore - diagnosticScore
                : 0;

        return {
            problemsCompleted: completedProblems.length,
            problemsInProgress: inProgressProblems.length,
            conceptsDiscovered: session.allDiscoveredConcepts.length,
            conceptIds: session.allDiscoveredConcepts,
            maxMasteryLevel: maxMastery,
            averageMastery: avgMastery,
            conceptsWithHighMastery: highMasteryCount,
            reflectionsSubmitted: reflections,
            diagnosticScore,
            postTestScore,
            scoreImprovement: improvement,
            learningTimeMinutes: Math.round(session.totalLearningTime / 60),
            currentStreak: student.currentStreak,
        };
    }, [session, legacySession, student.currentStreak]);

    // Calculate progress for each badge based on its unlock criteria
    const calculateBadgeProgress = useCallback(
        (badge: Badge): BadgeProgressResult => {
            const missingCriteria: string[] = [];
            let totalConditions = badge.unlockCriteria.conditions.length;
            let metConditions = 0;

            for (const condition of badge.unlockCriteria.conditions) {
                let isMet = false;
                let progress = 0;

                switch (condition.metric) {
                    case "problemsCompleted":
                        progress = metrics.problemsCompleted / (condition.threshold || 1);
                        isMet = metrics.problemsCompleted >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Complete ${condition.threshold} problem(s)`
                            );
                        break;

                    case "conceptsDiscovered":
                        progress = metrics.conceptsDiscovered / (condition.threshold || 1);
                        isMet = metrics.conceptsDiscovered >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Discover ${condition.threshold} concept(s)`
                            );
                        break;

                    case "maxMasteryLevel":
                        progress = metrics.maxMasteryLevel / (condition.threshold || 100);
                        isMet = metrics.maxMasteryLevel >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Reach ${condition.threshold}% mastery on any concept`
                            );
                        break;

                    case "conceptsWithHighMastery":
                        progress =
                            metrics.conceptsWithHighMastery / (condition.threshold || 1);
                        isMet =
                            metrics.conceptsWithHighMastery >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Master ${condition.threshold} concept(s) at 75%+`
                            );
                        break;

                    case "reflectionsSubmitted":
                        progress =
                            metrics.reflectionsSubmitted / (condition.threshold || 1);
                        isMet =
                            metrics.reflectionsSubmitted >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Submit ${condition.threshold} reflection(s)`
                            );
                        break;

                    case "scoreImprovement":
                        if (metrics.diagnosticScore === null) {
                            progress = 0;
                            missingCriteria.push("Complete diagnostic assessment");
                        } else if (metrics.postTestScore === null) {
                            progress = 0.5; // Halfway there
                            missingCriteria.push("Complete post-test assessment");
                        } else {
                            progress =
                                metrics.scoreImprovement / (condition.threshold || 1);
                            isMet =
                                metrics.scoreImprovement >= (condition.threshold || 0);
                            if (!isMet)
                                missingCriteria.push(
                                    `Improve score by ${condition.threshold}+ points`
                                );
                        }
                        break;

                    case "postTestScore":
                        if (metrics.postTestScore === null) {
                            progress = 0;
                            missingCriteria.push("Complete post-test");
                        } else {
                            progress = metrics.postTestScore / (condition.threshold || 100);
                            isMet = metrics.postTestScore >= (condition.threshold || 0);
                            if (!isMet)
                                missingCriteria.push(
                                    `Score ${condition.threshold}%+ on post-test`
                                );
                        }
                        break;

                    case "learningTimeMinutes":
                        progress =
                            metrics.learningTimeMinutes / (condition.threshold || 1);
                        isMet =
                            metrics.learningTimeMinutes >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Study for ${condition.threshold} minutes`
                            );
                        break;

                    case "streak":
                        progress = metrics.currentStreak / (condition.threshold || 1);
                        isMet = metrics.currentStreak >= (condition.threshold || 0);
                        if (!isMet)
                            missingCriteria.push(
                                `Maintain ${condition.threshold}-day streak`
                            );
                        break;

                    // Event-based badges (check if event occurred)
                    default:
                        if (condition.event) {
                            // These are tracked separately via explicit triggers
                            progress = 0;
                            isMet = false;
                        }
                        break;
                }

                if (isMet) metConditions++;
            }

            // Calculate overall progress
            const overallProgress = badge.unlockCriteria.requireAll
                ? metConditions / totalConditions
                : metConditions > 0
                ? 1
                : 0;

            const isEligible = badge.unlockCriteria.requireAll
                ? metConditions === totalConditions
                : metConditions > 0;

            return {
                badgeId: badge.id,
                progress: Math.min(1, overallProgress),
                isEligible,
                missingCriteria: isEligible ? [] : missingCriteria,
            };
        },
        [metrics]
    );

    // Calculate progress for all badges
    const badgeProgressMap = useMemo(() => {
        const progressMap: Record<string, BadgeProgressResult> = {};
        for (const badge of badges) {
            progressMap[badge.id] = calculateBadgeProgress(badge);
        }
        return progressMap;
    }, [badges, calculateBadgeProgress]);

    // Get eligible badges that haven't been unlocked yet
    const eligibleBadges = useMemo(() => {
        return badges.filter(
            (badge) =>
                badgeProgressMap[badge.id]?.isEligible &&
                !student.unlockedBadges.includes(badge.id)
        );
    }, [badges, badgeProgressMap, student.unlockedBadges]);

    // Auto-award eligible badges
    useEffect(() => {
        const awardEligibleBadges = async () => {
            for (const badge of eligibleBadges) {
                // Award the badge
                await unlockBadge(badge.id);
                // Add XP reward
                await addXP(badge.xpReward, `badge_${badge.id}`);
            }
            if (eligibleBadges.length > 0) {
                refresh();
            }
        };

        if (eligibleBadges.length > 0) {
            awardEligibleBadges();
        }
    }, [eligibleBadges, unlockBadge, addXP, refresh]);

    // Get badges close to being unlocked (75%+ progress)
    const nearlyUnlockedBadges = useMemo(() => {
        return badges.filter((badge) => {
            const progress = badgeProgressMap[badge.id]?.progress || 0;
            return (
                progress >= 0.75 &&
                progress < 1 &&
                !student.unlockedBadges.includes(badge.id)
            );
        });
    }, [badges, badgeProgressMap, student.unlockedBadges]);

    // Trigger event-based badge (for explicit events like diagnostic_completed)
    const triggerBadgeEvent = useCallback(
        async (eventName: string) => {
            const eventBadges = badges.filter((badge) =>
                badge.unlockCriteria.conditions.some((c) => c.event === eventName)
            );

            for (const badge of eventBadges) {
                if (!student.unlockedBadges.includes(badge.id)) {
                    await unlockBadge(badge.id);
                    await addXP(badge.xpReward, `badge_${badge.id}`);
                }
            }
            if (eventBadges.length > 0) {
                refresh();
            }
        },
        [badges, student.unlockedBadges, unlockBadge, addXP, refresh]
    );

    return {
        // Current metrics
        metrics,

        // Badge progress
        badgeProgressMap,
        getBadgeProgress: (badgeId: string) =>
            badgeProgressMap[badgeId] || { progress: 0, isEligible: false, missingCriteria: [] },

        // Useful collections
        eligibleBadges,
        nearlyUnlockedBadges,

        // Actions
        triggerBadgeEvent,

        // Stats
        totalUnlocked: student.unlockedBadges.length,
        totalBadges: badges.filter((b) => !b.isSecret).length,
    };
}

/**
 * Hook for tracking specific badge progress
 */
export function useBadgeTracker(badgeId: string) {
    const { badgeProgressMap, triggerBadgeEvent } = useBadgeProgress();
    const { student, badges } = useGamification();

    const badge = badges.find((b) => b.id === badgeId);
    const progress = badgeProgressMap[badgeId];
    const isUnlocked = student.unlockedBadges.includes(badgeId);

    return {
        badge,
        progress: progress?.progress || 0,
        isEligible: progress?.isEligible || false,
        isUnlocked,
        missingCriteria: progress?.missingCriteria || [],
        trigger: () => {
            if (badge?.unlockCriteria.conditions[0]?.event) {
                triggerBadgeEvent(badge.unlockCriteria.conditions[0].event);
            }
        },
    };
}
