import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/gamification/data/DataProviderFactory';
import { LearningSignalEngine } from '@/lib/gamification/engines/LearningSignalEngine';

const dataProvider = getDataProvider();
const lssEngine = new LearningSignalEngine();

export async function GET(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
    try {
        const studentId = params.studentId;
        const gamification = await dataProvider.getStudentGamification(studentId);
        const lss = await lssEngine.calculateLSS(studentId);

        return NextResponse.json({
            ...gamification,
            learningSignalScore: lss
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
