import { RiskAnalysisResult } from './risk-analyzer';
import { CostImpactResult } from './cost-analyzer';
import { WeatherFeasibility } from './weather-service';
import { GeminiParsedScene } from './gemini-parser';

export type ConstraintLevel = 'Low' | 'Medium' | 'High';

export interface BudgetConstraintAnalysis {
  level: ConstraintLevel;
  score: number; // 0-10 for internal calculation
  explanation: string;
  primaryDrivers: string[];
  suggestions?: string[];
}

export interface LogisticsConstraintAnalysis {
  level: ConstraintLevel;
  score: number;
  explanation: string;
  primaryBottlenecks: string[];
  suggestions?: string[];
}

export interface SafetyConstraintAnalysis {
  level: ConstraintLevel;
  score: number;
  explanation: string;
  safetyConcerns: string[];
  suggestions?: string[];
}

export interface TechnicalConstraintAnalysis {
  level: ConstraintLevel;
  score: number;
  explanation: string;
  technicalChallenges: string[];
  suggestions?: string[];
}

export interface ConstraintAnalysisResult {
  budget: BudgetConstraintAnalysis;
  logistics: LogisticsConstraintAnalysis;
  safety: SafetyConstraintAnalysis;
  technical: TechnicalConstraintAnalysis;
}

/**
 * CONSTRAINT ANALYZER (DETERMINISTIC)
 * 
 * Analyzes production constraints across 4 categories:
 * - Budget: Financial limitations and cost pressures
 * - Logistics: Location, transport, coordination challenges
 * - Safety: Crew/cast safety risks
 * - Technical: Equipment, VFX, complexity requirements
 * 
 * All constraint levels are determined by algorithmic rules (70% deterministic)
 * Gemini is used ONLY for suggestions (30% AI)
 */

// Helper: Convert score to constraint level
function scoreToLevel(score: number): ConstraintLevel {
  if (score >= 7) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

/**
 * BUDGET CONSTRAINT ANALYSIS
 * Derived from: budget_constraint, cost drivers, cost pressure
 */
export function analyzeBudgetConstraint(
  costImpact: CostImpactResult,
  budgetConstraint?: string
): BudgetConstraintAnalysis {
  let score = 0;
  const drivers: string[] = [];

  // Factor 1: User-specified budget constraint (+3)
  if (budgetConstraint === 'highly_constrained') {
    score += 3;
    drivers.push('Highly constrained budget specified');
  } else if (budgetConstraint === 'moderately_constrained') {
    score += 2;
    drivers.push('Moderately constrained budget');
  }

  // Factor 2: Cost pressure from backend (+5)
  if (costImpact.costPressure === 'High') {
    score += 5;
    drivers.push('High cost pressure from multiple cost drivers');
  } else if (costImpact.costPressure === 'Medium') {
    score += 3;
    drivers.push('Medium cost pressure');
  } else {
    score += 1;
  }

  // Factor 3: Number of cost drivers (+2 if >3)
  if (costImpact.drivers.length > 3) {
    score += 2;
    drivers.push(`${costImpact.drivers.length} cost drivers identified`);
  }

  const level = scoreToLevel(score);

  let explanation = '';
  if (level === 'High') {
    explanation = `Budget constraint is high due to ${drivers.length} factors. Multiple cost-intensive elements create significant financial pressure. Careful resource allocation and trade-off decisions are critical.`;
  } else if (level === 'Medium') {
    explanation = `Budget constraint is moderate. Some cost factors require attention but remain manageable with standard production planning.`;
  } else {
    explanation = `Budget constraint is low. Scene can be executed within typical production parameters without extraordinary financial pressure.`;
  }

  return {
    level,
    score,
    explanation,
    primaryDrivers: drivers.slice(0, 3), // Top 3
  };
}

/**
 * LOGISTICS CONSTRAINT ANALYSIS
 * Derived from: location complexity, crowd, outdoor/indoor, weather, vehicles
 */
export function analyzeLogisticsConstraint(
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  parsed: GeminiParsedScene,
  weather: WeatherFeasibility,
  locationComplexity?: string
): LogisticsConstraintAnalysis {
  let score = 0;
  const bottlenecks: string[] = [];

  // Factor 1: Location complexity (+3)
  if (locationComplexity === 'remote') {
    score += 3;
    bottlenecks.push('Remote location requires extensive transport and logistics');
  } else if (locationComplexity === 'city') {
    score += 2;
    bottlenecks.push('Urban location requires permits and traffic management');
  } else if (locationComplexity === 'studio') {
    score += 1;
    bottlenecks.push('Studio rental and facility coordination');
  }

  // Factor 2: Outdoor scene (+2)
  if (sceneCategory === 'Outdoor') {
    score += 2;
    bottlenecks.push('Outdoor filming increases logistical complexity');
  }

  // Factor 3: Weather dependency (+3)
  if (sceneCategory === 'Outdoor' && weather.applicable) {
    if (weather.averageRainDays && weather.averageRainDays > 5) {
      score += 3;
      bottlenecks.push('High weather unpredictability requires backup plans');
    } else if (weather.averageRainDays && weather.averageRainDays > 2) {
      score += 2;
      bottlenecks.push('Moderate weather variability affects scheduling');
    }
  }

  // Factor 4: Crowd management (+2)
  if (parsed.hasCrowd) {
    score += 2;
    bottlenecks.push('Crowd coordination requires additional logistics personnel');
  }

  // Factor 5: Vehicle operations (+2)
  if (parsed.hasVehicles) {
    score += 2;
    bottlenecks.push('Vehicle transport and parking logistics');
  }

  const level = scoreToLevel(score);

  let explanation = '';
  if (level === 'High') {
    explanation = `Logistics constraint is high with ${bottlenecks.length} coordination challenges. Multiple moving parts require detailed planning and backup contingencies.`;
  } else if (level === 'Medium') {
    explanation = `Logistics constraint is moderate. Standard production coordination protocols will address most challenges.`;
  } else {
    explanation = `Logistics constraint is low. Straightforward production setup with minimal coordination complexity.`;
  }

  return {
    level,
    score,
    explanation,
    primaryBottlenecks: bottlenecks.slice(0, 3),
  };
}

/**
 * SAFETY CONSTRAINT ANALYSIS
 * Derived from: night shoot, crowd, vehicles, stunts, weather
 */
export function analyzeSafetyConstraint(
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  parsed: GeminiParsedScene,
  timeOfDay?: 'Day' | 'Night',
  weather?: WeatherFeasibility
): SafetyConstraintAnalysis {
  let score = 0;
  const concerns: string[] = [];

  // Factor 1: Stunt work (+5 - highest safety priority)
  if (parsed.hasStunts) {
    score += 5;
    concerns.push('Stunt coordination requires specialized safety protocols');
  }

  // Factor 2: Crowd management (+3)
  if (parsed.hasCrowd) {
    score += 3;
    concerns.push('Large crowd increases safety oversight requirements');
  }

  // Factor 3: Vehicle operations (+3)
  if (parsed.hasVehicles) {
    score += 3;
    concerns.push('Vehicle operations require safety barriers and coordination');
  }

  // Factor 4: Night shooting (+2)
  if (timeOfDay === 'Night') {
    score += 2;
    concerns.push('Night filming requires enhanced lighting and crew safety measures');
  }

  // Factor 5: Outdoor + weather risk (+2)
  if (sceneCategory === 'Outdoor' && weather?.applicable) {
    if (weather.averageWindSpeed && weather.averageWindSpeed > 15) {
      score += 2;
      concerns.push('High wind conditions pose equipment and crew safety risks');
    }
  }

  // Factor 6: High action intensity (+2)
  if (parsed.actionIntensity === 'High') {
    score += 2;
    concerns.push('High-intensity action sequences require comprehensive safety planning');
  }

  const level = scoreToLevel(score);

  let explanation = '';
  if (level === 'High') {
    explanation = `Safety constraint is high with ${concerns.length} identified risks. Comprehensive safety protocols, specialized personnel, and emergency contingencies are mandatory.`;
  } else if (level === 'Medium') {
    explanation = `Safety constraint is moderate. Standard production safety measures with enhanced oversight for identified risk areas.`;
  } else {
    explanation = `Safety constraint is low. Routine production safety protocols are sufficient.`;
  }

  return {
    level,
    score,
    explanation,
    safetyConcerns: concerns.slice(0, 4),
  };
}

/**
 * TECHNICAL CONSTRAINT ANALYSIS
 * Derived from: VFX, environment complexity, action intensity, equipment needs
 */
export function analyzeTechnicalConstraint(
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  parsed: GeminiParsedScene
): TechnicalConstraintAnalysis {
  let score = 0;
  const challenges: string[] = [];

  // Factor 1: VFX scene (+4)
  if (sceneCategory === 'VFX') {
    score += 4;
    challenges.push('VFX production requires specialized equipment and post-production pipeline');
  }

  // Factor 2: Environment complexity (+3)
  if (parsed.environmentComplexity === 'High') {
    score += 3;
    challenges.push('Highly complex environment demands advanced set design and construction');
  } else if (parsed.environmentComplexity === 'Medium') {
    score += 2;
    challenges.push('Moderate environment complexity requires detailed art direction');
  }

  // Factor 3: Action intensity (+3)
  if (parsed.actionIntensity === 'High') {
    score += 3;
    challenges.push('High-intensity action requires specialized camera equipment and rigging');
  } else if (parsed.actionIntensity === 'Medium') {
    score += 2;
    challenges.push('Moderate action choreography needs careful camera planning');
  }

  // Factor 4: Stunts (+2)
  if (parsed.hasStunts) {
    score += 2;
    challenges.push('Stunt work demands precision camera positioning and multiple takes');
  }

  // Factor 5: Vehicles (+2)
  if (parsed.hasVehicles) {
    score += 2;
    challenges.push('Vehicle shots require specialized mounting equipment');
  }

  const level = scoreToLevel(score);

  let explanation = '';
  if (level === 'High') {
    explanation = `Technical constraint is high with ${challenges.length} specialized requirements. Advanced equipment, skilled technicians, and extended setup time are essential.`;
  } else if (level === 'Medium') {
    explanation = `Technical constraint is moderate. Standard production equipment with some specialized additions for specific sequences.`;
  } else {
    explanation = `Technical constraint is low. Scene can be captured with standard production equipment and techniques.`;
  }

  return {
    level,
    score,
    explanation,
    technicalChallenges: challenges.slice(0, 4),
  };
}

/**
 * MASTER CONSTRAINT ANALYZER
 * Orchestrates all 4 constraint analyses
 */
export function analyzeConstraints(
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  parsed: GeminiParsedScene,
  riskAnalysis: RiskAnalysisResult,
  costImpact: CostImpactResult,
  weather: WeatherFeasibility,
  timeOfDay?: 'Day' | 'Night',
  costInputs?: {
    budgetConstraint?: string;
    locationComplexity?: string;
  }
): ConstraintAnalysisResult {
  const budget = analyzeBudgetConstraint(
    costImpact,
    costInputs?.budgetConstraint
  );

  const logistics = analyzeLogisticsConstraint(
    sceneCategory,
    parsed,
    weather,
    costInputs?.locationComplexity
  );

  const safety = analyzeSafetyConstraint(
    sceneCategory,
    parsed,
    timeOfDay,
    weather
  );

  const technical = analyzeTechnicalConstraint(
    sceneCategory,
    parsed
  );

  return {
    budget,
    logistics,
    safety,
    technical,
  };
}
