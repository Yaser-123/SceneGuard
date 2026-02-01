import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, sceneAnalyses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find the user in the database
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!userRecord.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRecord[0];

    // 3. Fetch all scene analyses for this user, ordered by most recent first
    const analyses = await db
      .select()
      .from(sceneAnalyses)
      .where(eq(sceneAnalyses.userId, user.id))
      .orderBy(desc(sceneAnalyses.createdAt));

    // 4. Transform the data for the frontend
    const historyData = analyses.map((analysis) => {
      const data = analysis.finalAnalysisJson as any;
      
      // Calculate feasibility score (same logic as dashboard page)
      let feasibilityScore = 100;
      
      if (data.riskAnalysis?.signals) {
        const highRisks = data.riskAnalysis.signals.filter((s: any) => s.level === 'High').length;
        const mediumRisks = data.riskAnalysis.signals.filter((s: any) => s.level === 'Medium').length;
        
        feasibilityScore -= (highRisks * 15);
        feasibilityScore -= (mediumRisks * 8);
      }
      
      if (data.costImpact?.costPressure === 'High') feasibilityScore -= 10;
      if (data.costImpact?.costPressure === 'Medium') feasibilityScore -= 5;
      
      feasibilityScore = Math.max(0, Math.min(100, feasibilityScore));
      
      return {
        id: analysis.id,
        sceneDescription: analysis.sceneDescription,
        timestamp: analysis.createdAt.toISOString(),
        sceneMetadata: data.sceneMetadata,
        feasibilityScore,
        riskAnalysis: data.riskAnalysis,
        costImpact: data.costImpact,
        weatherFeasibility: data.weatherFeasibility,
      };
    });

    return NextResponse.json({ analyses: historyData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    );
  }
}
