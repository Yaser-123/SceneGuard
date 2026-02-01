'use server';

import { db } from '@/db';
import { sceneAnalyses, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * SERVER ACTIONS FOR DATABASE OPERATIONS
 * All functions are server-side only and handle authentication
 */

export async function getAnalysisHistory() {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      throw new Error('Unauthorized');
    }

    // Get user's database ID from clerk ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return [];
    }

    // Fetch all analyses for the current user, newest first
    const analyses = await db
      .select({
        id: sceneAnalyses.id,
        sceneDescription: sceneAnalyses.sceneDescription,
        createdAt: sceneAnalyses.createdAt,
        finalAnalysisJson: sceneAnalyses.finalAnalysisJson,
      })
      .from(sceneAnalyses)
      .where(eq(sceneAnalyses.userId, user.id))
      .orderBy(desc(sceneAnalyses.createdAt))
      .limit(50);

    // Extract category and feasibilityScore from finalAnalysisJson
    return analyses.map(analysis => ({
      ...analysis,
      category: (analysis.finalAnalysisJson as any)?.sceneMetadata?.category || null,
      feasibilityScore: (analysis.finalAnalysisJson as any)?.feasibilityScore || null,
    }));
  } catch (error) {
    console.error('Failed to fetch analysis history:', error);
    return [];
  }
}

export async function getAnalysisById(analysisId: string) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      throw new Error('Unauthorized');
    }

    // Get user's database ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return null;
    }

    const [analysis] = await db
      .select()
      .from(sceneAnalyses)
      .where(eq(sceneAnalyses.id, analysisId))
      .limit(1);

    // Verify ownership
    if (analysis && analysis.userId !== user.id) {
      throw new Error('Unauthorized access to analysis');
    }

    return analysis;
  } catch (error) {
    console.error('Failed to fetch analysis:', error);
    return null;
  }
}

export async function getLatestAnalysis() {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return null;
    }

    // Get user's database ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return null;
    }

    const [latest] = await db
      .select()
      .from(sceneAnalyses)
      .where(eq(sceneAnalyses.userId, user.id))
      .orderBy(desc(sceneAnalyses.createdAt))
      .limit(1);

    return latest;
  } catch (error) {
    console.error('Failed to fetch latest analysis:', error);
    return null;
  }
}

export async function deleteAnalysis(analysisId: string) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      throw new Error('Unauthorized');
    }

    // Get user's database ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Verify ownership before deleting
    const [analysis] = await db
      .select({ userId: sceneAnalyses.userId })
      .from(sceneAnalyses)
      .where(eq(sceneAnalyses.id, analysisId))
      .limit(1);

    if (!analysis || analysis.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    await db
      .delete(sceneAnalyses)
      .where(eq(sceneAnalyses.id, analysisId));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete analysis:', error);
    return { success: false, error: 'Failed to delete analysis' };
  }
}
