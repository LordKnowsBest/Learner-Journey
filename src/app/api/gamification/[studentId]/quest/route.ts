import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/gamification/data/DataProviderFactory';

const dataProvider = getDataProvider();

export async function GET(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
    try {
        const studentId = params.studentId;
        // MVP hardcoded quest ID as per spec
        const progress = await dataProvider.getQuestProgress(studentId, 'bias_mystery');
        return NextResponse.json(progress);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
