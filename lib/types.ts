/**
 * SceneGuard Backend - Type Definitions
 * Centralized type definitions for better type safety
 */

import { ComprehensiveAnalysis } from './comprehensive-analysis';
import type { LLMRiskAnalysis, RiskAssessment } from './llm-risk-assessor';

// ============================================================================
// INPUT TYPES
// ============================================================================

export type SceneCategory = 'Indoor' | 'Outdoor' | 'VFX';
export type TimeOfDay = 'Day' | 'Night';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type CostPressure = 'Low' | 'Medium' | 'High';

export interface SceneAnalysisInput {
  sceneDescription: string;
  sceneCategory: SceneCategory;
  timeOfDay?: TimeOfDay;
  location?: string;
  month?: string;
}

// ============================================================================
// GEMINI PARSING TYPES
// ============================================================================

export interface GeminiParsedScene {
  hasCrowd: boolean;
  hasStunts: boolean;
  hasVehicles: boolean;
  actionIntensity: 'Low' | 'Medium' | 'High';
  environmentComplexity: 'Low' | 'Medium' | 'High';
}

// ============================================================================
// RISK ANALYSIS TYPES
// ============================================================================

export interface RiskSignal {
  name: string;
  level: RiskLevel;
  reason: string;
}

export interface RiskAnalysisResult {
  signals: RiskSignal[];
  hasMultipleHighRisks: boolean;
  multiplier: number;
  explanation: string;
}

// ============================================================================
// COST ANALYSIS TYPES
// ============================================================================

export interface CostDriver {
  category: string;
  impact: string;
}

export interface CostImpactResult {
  costPressure: CostPressure;
  drivers: CostDriver[];
  explanation: string;
}

// ============================================================================
// WEATHER TYPES
// ============================================================================

export interface WeatherFeasibility {
  applicable: boolean;
  location?: string;
  month?: string;
  averageRainDays?: number;
  averageWindSpeed?: number;
  recommendation?: string;
  rawData?: any;
}

// ============================================================================
// PLANNING INSIGHTS TYPES
// ============================================================================

export interface PlanningInsights {
  locationGuidance?: string;
  weatherPattern?: string;
  productionRecommendation: string;
  recommendations: string[];
  mitigationStrategies: string[];
  alternativeApproaches?: string[];
  logistics?: string;
}

// ============================================================================
// FINAL RESPONSE TYPES
// ============================================================================

export interface SceneMetadata {
  category: SceneCategory;
  timeOfDay?: TimeOfDay;
  location?: string;
  month?: string;
  description: string;
}

// Constraint Intelligence Types
export interface ConstraintLevel {
  level: 'Low' | 'Medium' | 'High';
  reasoning: string;
  evidence: string[];
}

export interface ConstraintSet {
  budget: ConstraintLevel;
  logistics: ConstraintLevel;
  safety: ConstraintLevel;
  technical: ConstraintLevel;
}

export interface Interaction {
  level: 'Low' | 'Medium' | 'High';
  reasoning: string;
}

export interface InteractionMatrix {
  budget_logistics: Interaction;
  budget_safety: Interaction;
  budget_technical: Interaction;
  logistics_safety: Interaction;
  logistics_technical: Interaction;
  safety_technical: Interaction;
}

export interface ConstraintSummary {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  criticalInteractions: string[];
}

export interface FeasibilityScore {
  level: 'Low Risk' | 'Medium Risk' | 'High Risk';
  score: number;
  explanation: string;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface ConstraintIntelligence {
  constraints: ConstraintSet;
  evidenceMap: Record<string, string[]>;
  interactionMatrix: InteractionMatrix;
  summary: ConstraintSummary;
  feasibilityScore: FeasibilityScore;
  // Optional LLM-driven assessments
  llmRiskAnalysis?: LLMRiskAnalysis;
  riskSignals?: RiskAssessment[];
}

export interface SceneAnalysisResponse {
  sceneMetadata: SceneMetadata;
  geminiParsing: GeminiParsedScene;
  riskAnalysis: RiskAnalysisResult;
  costImpact: CostImpactResult;
  weatherFeasibility: WeatherFeasibility;
  planningInsights: PlanningInsights;
  comprehensiveAnalysis: ComprehensiveAnalysis;
  constraintIntelligence: ConstraintIntelligence;
  analysisId: string;
  timestamp: string;
}

// ============================================================================
// DATABASE ARTIFACT TYPES
// ============================================================================

export type ArtifactType = 'gemini_parse' | 'weather_snapshot' | 'risk_engine' | 'cost_engine';

export interface ArtifactPayload {
  type: ArtifactType;
  data: GeminiParsedScene | RiskAnalysisResult | CostImpactResult | any;
  timestamp: string;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

export interface ValidationError {
  error: 'Invalid input';
  details: Array<{
    path: string[];
    message: string;
  }>;
}
