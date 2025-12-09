import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/gamification/data/DataProviderFactory';
import { XPEngine } from '@/lib/gamification/engines/XPEngine';
import { BadgeEngine } from '@/lib/gamification/engines/BadgeEngine';
import { QuestEngine } from '@/lib/gamification/engines/QuestEngine';

const xpEngine = new XPEngine();
const badgeEngine = new BadgeEngine();
const questEngine = new QuestEngine();

export async function POST(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
    try {
        const studentId = params.studentId;
        const body = await request.json();
        const { activityType, metadata } = body;

        // Award XP
        const xpAwarded = await xpEngine.calculateAndAwardXP(studentId, activityType, metadata);

        // Check badges
        const newBadges = await badgeEngine.checkAndAwardBadges(studentId, activityType, metadata);

        // Check quest progress
        // Ensure metadata contains necessary Quest info if applicable
        const questUpdate = await questEngine.checkObjectiveCompletion(
            studentId,
            activityType,
            metadata.targetId || metadata.nodeId, // Fallback to nodeId often used in app
            metadata.score
        );

        return NextResponse.json({
            xpAwarded,
            newBadges: newBadges.map(b => b.id),
            questUpdate
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
