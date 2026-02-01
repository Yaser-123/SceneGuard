// ===========================
// CONSTRAINT INTERACTION ENGINE
// ===========================
// This module implements deterministic logic for analyzing how constraints
// amplify each other. This is NON-REPLACEABLE by Gemini and shows SceneGuard's
// unique reasoning capabilities.

export type ConstraintLevel = 'Low' | 'Medium' | 'High';
export type InteractionLevel = 'Low' | 'Medium' | 'High';

export interface ConstraintLevels {
  budget: ConstraintLevel;
  logistics: ConstraintLevel;
  safety: ConstraintLevel;
  technical: ConstraintLevel;
}

export interface InteractionMatrix {
  budget_logistics: {
    level: InteractionLevel;
    reasoning: string;
  };
  budget_safety: {
    level: InteractionLevel;
    reasoning: string;
  };
  budget_technical: {
    level: InteractionLevel;
    reasoning: string;
  };
  logistics_safety: {
    level: InteractionLevel;
    reasoning: string;
  };
  logistics_technical: {
    level: InteractionLevel;
    reasoning: string;
  };
  safety_technical: {
    level: InteractionLevel;
    reasoning: string;
  };
}

/**
 * Converts constraint level to numeric score for calculations
 */
function levelToScore(level: ConstraintLevel): number {
  switch (level) {
    case 'Low':
      return 1;
    case 'Medium':
      return 2;
    case 'High':
      return 3;
    default:
      return 1;
  }
}

/**
 * Converts interaction score to level
 */
function scoreToInteractionLevel(score: number): InteractionLevel {
  if (score >= 5) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

/**
 * Analyzes Budget × Logistics interaction
 * Rule: High if both are Medium or above (budget constraints limit logistics flexibility)
 */
function analyzeBudgetLogistics(budget: ConstraintLevel, logistics: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const budgetScore = levelToScore(budget);
  const logisticsScore = levelToScore(logistics);
  const interactionScore = budgetScore * logisticsScore;

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (budgetScore >= 2 && logisticsScore >= 2) {
    level = scoreToInteractionLevel(interactionScore);
    reasoning = 'Budget constraints amplify logistics challenges - limited resources reduce flexibility in solving coordination issues';
  } else if (budgetScore >= 2 || logisticsScore >= 2) {
    level = 'Medium';
    reasoning = 'Either budget or logistics pressure exists, creating moderate amplification';
  } else {
    level = 'Low';
    reasoning = 'Both constraints are manageable - minimal interaction effect';
  }

  return { level, reasoning };
}

/**
 * Analyzes Budget × Safety interaction
 * Rule: High if budget is constrained and safety is Medium+ (safety cannot be compromised)
 */
function analyzeBudgetSafety(budget: ConstraintLevel, safety: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const budgetScore = levelToScore(budget);
  const safetyScore = levelToScore(safety);

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (safetyScore >= 2 && budgetScore >= 2) {
    level = 'High';
    reasoning = 'Safety requirements are non-negotiable and amplify budget pressure - specialized safety equipment and personnel cannot be cut';
  } else if (safetyScore >= 2) {
    level = 'Medium';
    reasoning = 'Safety needs require allocation regardless of budget constraints';
  } else if (budgetScore >= 2) {
    level = 'Low';
    reasoning = 'Budget constraints exist but safety requirements are minimal';
  } else {
    level = 'Low';
    reasoning = 'Both constraints are manageable - minimal interaction';
  }

  return { level, reasoning };
}

/**
 * Analyzes Budget × Technical interaction
 * Rule: Medium if both are Medium (technical solutions often have cost-effective alternatives)
 */
function analyzeBudgetTechnical(budget: ConstraintLevel, technical: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const budgetScore = levelToScore(budget);
  const technicalScore = levelToScore(technical);

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (technicalScore === 3 && budgetScore >= 2) {
    level = 'High';
    reasoning = 'High technical complexity requires specialized equipment/crew that budget constraints make difficult to obtain';
  } else if (budgetScore >= 2 && technicalScore >= 2) {
    level = 'Medium';
    reasoning = 'Technical challenges exist but may have cost-effective solutions available';
  } else if (technicalScore >= 2) {
    level = 'Low';
    reasoning = 'Technical needs can be met within budget flexibility';
  } else {
    level = 'Low';
    reasoning = 'Standard technical requirements with manageable budget';
  }

  return { level, reasoning };
}

/**
 * Analyzes Logistics × Safety interaction
 * Rule: High if both are Medium or above (complex logistics increase safety risks)
 */
function analyzeLogisticsSafety(logistics: ConstraintLevel, safety: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const logisticsScore = levelToScore(logistics);
  const safetyScore = levelToScore(safety);
  const interactionScore = logisticsScore * safetyScore;

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (logisticsScore >= 2 && safetyScore >= 2) {
    level = scoreToInteractionLevel(interactionScore);
    reasoning = 'Complex logistics amplify safety risks - coordination challenges increase accident potential with hazardous elements';
  } else if (logisticsScore >= 2 || safetyScore >= 2) {
    level = 'Medium';
    reasoning = 'Either logistics or safety pressure exists, requiring careful management';
  } else {
    level = 'Low';
    reasoning = 'Both constraints are manageable - minimal interaction risk';
  }

  return { level, reasoning };
}

/**
 * Analyzes Logistics × Technical interaction
 * Rule: Medium+ if both constraints exist (technical complexity requires precise logistics)
 */
function analyzeLogisticsTechnical(logistics: ConstraintLevel, technical: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const logisticsScore = levelToScore(logistics);
  const technicalScore = levelToScore(technical);
  const interactionScore = logisticsScore * technicalScore;

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (logisticsScore >= 2 && technicalScore >= 2) {
    level = scoreToInteractionLevel(interactionScore);
    reasoning = 'Technical complexity requires precise logistics - specialized equipment and crew coordination amplify scheduling challenges';
  } else if (logisticsScore >= 2 || technicalScore >= 2) {
    level = 'Medium';
    reasoning = 'Either logistics or technical complexity exists, creating moderate coordination needs';
  } else {
    level = 'Low';
    reasoning = 'Standard logistics and technical requirements';
  }

  return { level, reasoning };
}

/**
 * Analyzes Safety × Technical interaction
 * Rule: High if both are High (dangerous stunts + complex tech = critical risk)
 */
function analyzeSafetyTechnical(safety: ConstraintLevel, technical: ConstraintLevel): {
  level: InteractionLevel;
  reasoning: string;
} {
  const safetyScore = levelToScore(safety);
  const technicalScore = levelToScore(technical);

  let reasoning = '';
  let level: InteractionLevel = 'Low';

  if (safetyScore === 3 && technicalScore === 3) {
    level = 'High';
    reasoning = 'High-risk safety scenarios combined with complex technical requirements create critical execution challenges - margin for error is minimal';
  } else if (safetyScore >= 2 && technicalScore >= 2) {
    level = 'Medium';
    reasoning = 'Safety and technical complexity both require careful execution - amplified coordination needs';
  } else if (safetyScore >= 2 || technicalScore >= 2) {
    level = 'Low';
    reasoning = 'Either safety or technical complexity exists but interaction is manageable';
  } else {
    level = 'Low';
    reasoning = 'Standard safety and technical requirements';
  }

  return { level, reasoning };
}

/**
 * Generates complete constraint interaction matrix
 * This is pure deterministic logic - NO AI involved
 * @param constraints - The constraint levels from evidence-grounded analysis
 * @returns Interaction matrix showing how constraints amplify each other
 */
export function generateInteractionMatrix(constraints: ConstraintLevels): InteractionMatrix {
  return {
    budget_logistics: analyzeBudgetLogistics(constraints.budget, constraints.logistics),
    budget_safety: analyzeBudgetSafety(constraints.budget, constraints.safety),
    budget_technical: analyzeBudgetTechnical(constraints.budget, constraints.technical),
    logistics_safety: analyzeLogisticsSafety(constraints.logistics, constraints.safety),
    logistics_technical: analyzeLogisticsTechnical(constraints.logistics, constraints.technical),
    safety_technical: analyzeSafetyTechnical(constraints.safety, constraints.technical),
  };
}

/**
 * Gets summary statistics from interaction matrix
 */
export function getInteractionSummary(matrix: InteractionMatrix): {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  criticalInteractions: string[];
} {
  const interactions = Object.entries(matrix);
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  const criticalInteractions: string[] = [];

  for (const [key, value] of interactions) {
    if (value.level === 'High') {
      highCount++;
      criticalInteractions.push(key.replace('_', ' × '));
    } else if (value.level === 'Medium') {
      mediumCount++;
    } else {
      lowCount++;
    }
  }

  return {
    highCount,
    mediumCount,
    lowCount,
    criticalInteractions,
  };
}
