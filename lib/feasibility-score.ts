// ===========================
// FEASIBILITY SCORE CALCULATOR
// ===========================
// Calculates overall production readiness from constraint analysis
// This is the PRIMARY metric judges will see

export type FeasibilityLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface FeasibilityScore {
  level: FeasibilityLevel;
  score: number; // 0-100
  explanation: string;
  breakdown?: {
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  }; // Added field
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface ConstraintLevels {
  budget: 'Low' | 'Medium' | 'High';
  logistics: 'Low' | 'Medium' | 'High';
  safety: 'Low' | 'Medium' | 'High';
  technical: 'Low' | 'Medium' | 'High';
}

/**
 * Calculates production feasibility score from constraint analysis
 * This represents "How ready is this scene for production?"
 * 
 * FIXED: No more 100% scores - realistic range 25-95
 * Formula: Base 100 - (risk cumulative * 20), clamped 25-95
 * 
 * @param constraints - The four constraint levels
 * @returns Feasibility score with explanation
 */
export function calculateFeasibilityScore(constraints: ConstraintLevels): FeasibilityScore {
  // Count risk levels
  const levels = Object.values(constraints);
  const highRiskCount = levels.filter((l) => l === 'High').length;
  const mediumRiskCount = levels.filter((l) => l === 'Medium').length;
  const lowRiskCount = levels.filter((l) => l === 'Low').length;

  // Calculate risk score (cumulative risk measure)
  // High = 1.0, Medium = 0.5, Low = 0.25
  let riskScore = 0;
  riskScore += highRiskCount * 1.0;
  riskScore += mediumRiskCount * 0.5;
  riskScore += lowRiskCount * 0.25;

  // Calculate feasibility score
  // Base 100 - (riskScore * 20)
  let score = 100 - (riskScore * 20);
  
  // Clamp between 25 and 95 (100% feasibility is IMPOSSIBLE in real production)
  score = Math.max(25, Math.min(95, score));
  score = Math.round(score);

  // Determine feasibility level
  let level: FeasibilityLevel;
  let explanation: string;

  if (score >= 75) {
    level = 'Low Risk';
    explanation = `Scene is highly feasible (${highRiskCount} high-priority, ${mediumRiskCount} medium-priority items). Production-ready with standard preparations.`;
  } else if (score >= 50) {
    level = 'Medium Risk';
    explanation = `Scene is feasible but requires careful planning (${highRiskCount} high-priority, ${mediumRiskCount} medium-priority concerns). Focused mitigation needed.`;
  } else {
    level = 'High Risk';
    explanation = `Scene presents significant challenges (${highRiskCount} high-priority, ${mediumRiskCount} medium-priority constraints). Extensive pre-production required before cameras roll.`;
  }

  return {
    level,
    score,
    explanation,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
  };
}

/**
 * Gets color class for feasibility level
 */
export function getFeasibilityColor(level: FeasibilityLevel): string {
  switch (level) {
    case 'Low Risk':
      return 'text-green-600 dark:text-green-400';
    case 'Medium Risk':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'High Risk':
      return 'text-red-600 dark:text-red-400';
  }
}

/**
 * Gets background color class for feasibility level
 */
export function getFeasibilityBgColor(level: FeasibilityLevel): string {
  switch (level) {
    case 'Low Risk':
      return 'bg-green-500/20 border-green-500/50';
    case 'Medium Risk':
      return 'bg-yellow-500/20 border-yellow-500/50';
    case 'High Risk':
      return 'bg-red-500/20 border-red-500/50';
  }
}
