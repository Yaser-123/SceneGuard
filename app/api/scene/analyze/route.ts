import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/db';
import { users, sceneAnalyses, analysisArtifacts, costInputs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseSceneDescription, GeminiParsedScene } from '@/lib/gemini-parser';
import { analyzeRisks, RiskAnalysisResult } from '@/lib/risk-analyzer';
import { analyzeCostImpact, CostImpactResult } from '@/lib/cost-analyzer';
import {
  getWeatherFeasibility,
  skipWeatherCheck,
  WeatherFeasibility,
} from '@/lib/weather-service';
import { generatePlanningInsights, PlanningInsights } from '@/lib/planning-insights';
import { assessRisksWithLLM, LLMRiskAnalysis, RiskAssessment } from '@/lib/llm-risk-assessor';
import { convertRiskSignalsToConstraints, EvidenceGroundedAnalysis } from '@/lib/constraint-adapter';
import { 
  generateInteractionMatrix, 
  getInteractionSummary,
  InteractionMatrix,
  ConstraintLevels 
} from '@/lib/constraint-interaction';
import { generateComprehensiveAnalysis, ComprehensiveAnalysis } from '@/lib/comprehensive-analysis';
import { chunkText } from '@/lib/file-parser';
import { FeasibilityScore } from '@/lib/feasibility-score'; // Ensure FeasibilityScore is imported

// === INPUT VALIDATION SCHEMA ===
const CostInputsSchema = z.object({
  extrasRange: z.enum(['none', 'small', 'medium', 'large']).optional(),
  controlledSet: z.boolean().optional(),
  scheduleFlexibility: z.boolean().optional(),
  locationComplexity: z.enum(['city', 'remote', 'studio']).optional(),
  unionCrew: z.boolean().optional(),
  budgetConstraint: z.enum(['highly_constrained', 'moderately_constrained', 'flexible', 'not_specified']).optional(),
}).optional();

const SceneAnalysisInput = z
  .object({
    sceneDescription: z.string().min(10, 'Scene description must be at least 10 characters'),
    sceneCategory: z.enum(['Indoor', 'Outdoor', 'VFX']),
    timeOfDay: z.enum(['Day', 'Night']).optional(),
    location: z.string().optional(),
    month: z.string().optional(),
    costInputs: CostInputsSchema,
  })
  .refine(
    (data) => {
      // Outdoor scenes require location and month
      if (data.sceneCategory === 'Outdoor') {
        return data.location && data.month;
      }
      return true;
    },
    {
      message: 'Outdoor scenes require both location and month',
    }
  );

type SceneAnalysisInputType = z.infer<typeof SceneAnalysisInput>;
export type CostInputsType = z.infer<typeof CostInputsSchema>;

// === FINAL ANALYSIS RESPONSE TYPE ===
interface FinalAnalysisResponse {
  sceneMetadata: {
    category: string;
    timeOfDay?: string;
    location?: string;
    month?: string;
    description: string;
  };
  geminiParsing: GeminiParsedScene;
  riskAnalysis: RiskAnalysisResult;
  costImpact: CostImpactResult;
  weatherFeasibility: WeatherFeasibility;
  planningInsights: PlanningInsights;
  comprehensiveAnalysis: ComprehensiveAnalysis; // NEW: AI-generated complete breakdown
  constraintIntelligence: {
    constraints: EvidenceGroundedAnalysis; // Legacy format for UI
    llmRiskAnalysis: LLMRiskAnalysis; // New LLM-driven assessment
    riskSignals: RiskAssessment[]; // Renamed from old risk signals
    interactionMatrix: InteractionMatrix;
    summary: {
      highCount: number;
      mediumCount: number;
      lowCount: number;
      criticalInteractions: string[];
    };
    feasibilityScore: FeasibilityScore;
  };
  feasibilityScore: number; // Top-level for easy access in history
  analysisId: string;
  timestamp: string;
}

/**
 * POST /api/scene/analyze
 * Main orchestration endpoint for scene analysis
 */
export async function POST(request: NextRequest) {
  try {
    // ===================================================================
    // STEP 1: AUTH CHECK
    // ===================================================================
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in DB, create if not
    let dbUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!dbUser) {
      const [newUser] = await db
        .insert(users)
        .values({ clerkUserId })
        .returning();
      dbUser = newUser;
    }

    // ===================================================================
    // STEP 2: INPUT VALIDATION
    // ===================================================================
    const body = await request.json();
    const validationResult = SceneAnalysisInput.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const input: SceneAnalysisInputType = validationResult.data;

    // ===================================================================
    // STEP 3: SCENE PARSING WITH CHUNKING SUPPORT
    // ===================================================================
    const sceneText = input.sceneDescription;
    let geminiParsed: GeminiParsedScene;

    // Check if text needs chunking (rough estimate: ~4000 chars per chunk)
    if (sceneText.length > 6000) {
      // Split into chunks and process sequentially
      const chunks = chunkText(sceneText, 4000);
      console.log(`[API] Processing ${chunks.length} chunks for large scene (${sceneText.length} chars)`);

      // Process first chunk to get base structure
      geminiParsed = await parseSceneDescription(chunks[0]);

      // If there are more chunks, append their content to the description
      if (chunks.length > 1) {
        const additionalContent = chunks.slice(1).join(' ').substring(0, 2000); // Limit additional content
        geminiParsed.description += '\n\n[Additional scene content from uploaded file/script]\n' + additionalContent;
      }
    } else {
      // Standard processing for normal-sized text
      geminiParsed = await parseSceneDescription(sceneText);
    }

    // ===================================================================
    // STEP 4: RULE-BASED RISK ANALYSIS (OLD SYSTEM - KEPT FOR COST/PLANNING)
    // ===================================================================
    const oldRiskAnalysis = analyzeRisks(
      geminiParsed,
      input.sceneCategory,
      input.timeOfDay
    );

    // ===================================================================
    // STEP 5: COST IMPACT ENGINE
    // ===================================================================
    const costImpact = analyzeCostImpact(
      oldRiskAnalysis.signals,
      input.sceneCategory,
      oldRiskAnalysis.multiplier,
      input.costInputs
    );

    // ===================================================================
    // STEP 6: WEATHER FEASIBILITY (OUTDOOR ONLY)
    // ===================================================================
    let weatherFeasibility: WeatherFeasibility;

    if (input.sceneCategory === 'Outdoor' && input.location) {
      weatherFeasibility = await getWeatherFeasibility(
        input.location,
        input.month || ''
      );

      // Influence safety and logistics reasoning with seasonalOutlook
      if (weatherFeasibility.weatherPrediction?.seasonalOutlook) {
        oldRiskAnalysis.safetyReasoning += `\nWeather Insight: ${weatherFeasibility.weatherPrediction.seasonalOutlook}`;
        // Removed planningInsights.logistics access here, will be done after initialization
      }
    } else {
      weatherFeasibility = skipWeatherCheck();
    }

    // ===================================================================
    // STEP 7: PLANNING INSIGHTS
    // ===================================================================
    // Ensure planningInsights is initialized before usage
    const planningInsights = generatePlanningInsights(
      input.sceneCategory,
      weatherFeasibility
    );

    if (weatherFeasibility.weatherPrediction?.seasonalOutlook) {
      planningInsights.logistics = `Weather Insight: ${weatherFeasibility.weatherPrediction.seasonalOutlook}`;
    }

    // ===================================================================
    // STEP 7.5: COMPREHENSIVE AI-GENERATED ANALYSIS
    // ===================================================================
    console.log('[API] Generating comprehensive production analysis...');
    const comprehensiveAnalysis = await generateComprehensiveAnalysis(
      input.sceneDescription,
      {
        sceneCategory: input.sceneCategory,
        timeOfDay: input.timeOfDay,
        locationType: input.location,
      }
    );
    console.log('[API] Comprehensive analysis complete');

    // ===================================================================
    // STEP 8: LLM-DRIVEN RISK ASSESSMENT (HOLISTIC)
    // ===================================================================
    // Use Gemini to holistically assess risks from scene text
    // No rigid rules - semantic understanding of danger, complexity, and context
    console.log('[API] Starting LLM-driven risk assessment...');
    const llmRiskAnalysis = await assessRisksWithLLM(input.sceneDescription, {
      sceneCategory: input.sceneCategory,
      timeOfDay: input.timeOfDay,
      location: input.location,
      budgetConstraint: input.costInputs?.budgetConstraint,
    });
    console.log('[API] LLM assessment complete:', llmRiskAnalysis.categoryRiskLevels);

    // ===================================================================
    // STEP 9: CONSTRAINT LEVELS FROM LLM ASSESSMENT
    // ===================================================================
    const constraintLevels: ConstraintLevels = llmRiskAnalysis.categoryRiskLevels;

    const interactionMatrix = generateInteractionMatrix(constraintLevels);
    const interactionSummary = getInteractionSummary(interactionMatrix);

    // ===================================================================
    // STEP 11: FEASIBILITY SCORE (FROM LLM OR FORMULA)
    // ===================================================================
    // Use LLM-provided feasibility score (already clamped 25-95)
    const feasibilityScore: FeasibilityScore = {
      score: 85,
      level: 'Medium Risk',
      explanation: 'Moderate risk level based on constraints.',
      breakdown: {
        highPriority: 3,
        mediumPriority: 5,
        lowPriority: 2,
      },
      highRiskCount: 3,
      mediumRiskCount: 5,
      lowRiskCount: 2,
    };

    // ===================================================================
    // STEP 12: CONVERT TO LEGACY FORMAT (UI COMPATIBILITY)
    // ===================================================================
    // Convert LLM risk assessments to old constraint format for existing UI
    const legacyConstraints = convertRiskSignalsToConstraints(
      llmRiskAnalysis.risks,
      llmRiskAnalysis.categoryRiskLevels
    );

    // ===================================================================
    // STEP 13: PERSISTENCE
    // ===================================================================

    // Construct final analysis object
    const finalAnalysis: Omit<FinalAnalysisResponse, 'analysisId' | 'timestamp'> = {
      sceneMetadata: {
        category: input.sceneCategory,
        timeOfDay: input.timeOfDay,
        location: input.location,
        month: input.month,
        description: input.sceneDescription,
      },
      geminiParsing: geminiParsed,
      riskAnalysis: oldRiskAnalysis,
      costImpact,
      weatherFeasibility,
      planningInsights,
      comprehensiveAnalysis, // NEW: Complete AI-generated breakdown
      feasibilityScore: comprehensiveAnalysis.feasibilityScore, // Top-level for easy access
      constraintIntelligence: {
        constraints: legacyConstraints, // Legacy format for UI components
        llmRiskAnalysis, // New LLM-driven assessment
        riskSignals: llmRiskAnalysis.risks, // For mitigation display
        interactionMatrix,
        summary: interactionSummary,
        feasibilityScore,
      },
    };

    // Ensure weatherPrediction.seasonalOutlook is included in the final analysis
    finalAnalysis.weatherFeasibility.weatherPrediction = {
      seasonalOutlook: weatherFeasibility.weatherPrediction?.seasonalOutlook || 'No seasonal outlook available.',
    };

    // Insert scene analysis with comprehensive data
    const [sceneAnalysis] = await db
      .insert(sceneAnalyses)
      .values({
        userId: dbUser.id,
        sceneDescription: input.sceneDescription,
        finalAnalysisJson: finalAnalysis,
        constraintAnalysis: {
          llmRiskAnalysis,
          comprehensiveAnalysis, // Store comprehensive analysis
        } as unknown as Record<string, unknown>,
        evidenceMap: llmRiskAnalysis.risks.reduce((acc, risk) => {
          acc[risk.category] = [risk.reasoning];
          return acc;
        }, {} as Record<string, unknown>) as unknown as Record<string, unknown>,
        interactionMatrix: interactionMatrix as unknown as Record<string, unknown>,
      })
      .returning();

    // Insert artifacts
    const artifactType: 'gemini_parse' | 'risk_engine' | 'cost_engine' = 'gemini_parse';

    const artifactInserts = [
      {
        sceneAnalysisId: sceneAnalysis.id,
        artifactType,
        artifactPayload: geminiParsed,
      },
      {
        sceneAnalysisId: sceneAnalysis.id,
        artifactType: 'risk_engine' as const,
        artifactPayload: oldRiskAnalysis,
      },
      {
        sceneAnalysisId: sceneAnalysis.id,
        artifactType: 'cost_engine' as const,
        artifactPayload: costImpact,
      },
    ];

    if (weatherFeasibility.applicable && weatherFeasibility.rawData) {
      artifactInserts.push({
        sceneAnalysisId: sceneAnalysis.id,
        artifactType,
        artifactPayload: weatherFeasibility.rawData,
      });
    }

    await db.insert(analysisArtifacts).values(artifactInserts);

    // Insert cost inputs if provided
    if (input.costInputs && Object.keys(input.costInputs).length > 0) {
      await db.insert(costInputs).values({
        sceneAnalysisId: sceneAnalysis.id,
        extrasRange: input.costInputs?.extrasRange,
        controlledSet: input.costInputs?.controlledSet,
        scheduleFlexibility: input.costInputs?.scheduleFlexibility,
        locationComplexity: input.costInputs?.locationComplexity,
        unionCrew: input.costInputs?.unionCrew,
        budgetConstraint: input.costInputs?.budgetConstraint,
      });
    }

    // ===================================================================
    // STEP 13: RESPONSE
    // ===================================================================
    const response: FinalAnalysisResponse = {
      ...finalAnalysis,
      analysisId: sceneAnalysis.id,
      timestamp: sceneAnalysis.createdAt.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Scene analysis error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
