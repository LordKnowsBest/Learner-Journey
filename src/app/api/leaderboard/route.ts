import { NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/gamification/data/DataProviderFactory';

export async function GET() {
    try {
        const dataProvider = getDataProvider();
        const leaderboard = await dataProvider.getLeaderboard('class', 'weekly');
        return NextResponse.json(leaderboard);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
