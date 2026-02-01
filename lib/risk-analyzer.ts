import { GeminiParsedScene } from './gemini-parser';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskSignal {
  name: string;
  level: RiskLevel;
  reason: string;
}

export interface RiskAnalysisResult {
  signals: RiskSignal[];
  multiplier: number;
  safetyReasoning?: string; // Added field
}

/**
 * RULE-BASED RISK ANALYSIS ENGINE (DETERMINISTIC)
 * Identifies risk signals based on scene characteristics
 * Assigns Low / Medium / High levels using explicit rules
 */
export function analyzeRisks(
  parsed: GeminiParsedScene,
  sceneCategory: 'Indoor' | 'Outdoor' | 'VFX',
  timeOfDay?: 'Day' | 'Night'
): RiskAnalysisResult {
  const signals: RiskSignal[] = [];

  // === CROWD RISK ===
  if (parsed.hasCrowd) {
    signals.push({
      name: 'Crowd Management',
      level: 'High',
      reason: 'Requires extra coordination, safety protocols, and additional crew',
    });
  }

  // === STUNT RISK ===
  if (parsed.hasStunts) {
    signals.push({
      name: 'Stunt Coordination',
      level: 'High',
      reason: 'Requires specialized stunt coordinators, safety equipment, and insurance',
    });
  }

  // === VEHICLE RISK ===
  if (parsed.hasVehicles) {
    const level = parsed.actionIntensity === 'High' ? 'High' : 'Medium';
    signals.push({
      name: 'Vehicle Operations',
      level,
      reason:
        level === 'High'
          ? 'High-speed vehicle action requires precision drivers and road closures'
          : 'Vehicles require permits, insurance, and safety protocols',
    });
  }

  // === ACTION INTENSITY RISK ===
  if (parsed.actionIntensity === 'High') {
    signals.push({
      name: 'Action Intensity',
      level: 'High',
      reason: 'Complex choreography increases filming time and coordination needs',
    });
  } else if (parsed.actionIntensity === 'Medium') {
    signals.push({
      name: 'Action Intensity',
      level: 'Medium',
      reason: 'Moderate action sequences require careful planning',
    });
  }

  // === ENVIRONMENT COMPLEXITY RISK ===
  if (parsed.environmentComplexity === 'High') {
    signals.push({
      name: 'Environment Complexity',
      level: 'High',
      reason: 'Complex set design increases setup time and budget',
    });
  } else if (parsed.environmentComplexity === 'Medium') {
    signals.push({
      name: 'Environment Complexity',
      level: 'Medium',
      reason: 'Detailed environment requires additional art department work',
    });
  }

  // === OUTDOOR-SPECIFIC RISKS ===
  if (sceneCategory === 'Outdoor') {
    signals.push({
      name: 'Weather Dependency',
      level: 'High',
      reason: 'Outdoor shoots are vulnerable to weather delays and require contingency planning',
    });

    if (timeOfDay === 'Night') {
      signals.push({
        name: 'Night Shooting',
        level: 'Medium',
        reason: 'Night shoots require additional lighting equipment and crew overtime',
      });
    }
  }

  // === NIGHT SHOOTING RISK (VFX) ===
  if (sceneCategory === 'VFX' && timeOfDay === 'Night') {
    signals.push({
      name: 'Night Shooting (Studio)',
      level: 'Low',
      reason: 'Controlled studio environment but requires lighting setup',
    });
  }

  // === CALCULATE MULTIPLIER ===
  const highRiskCount = signals.filter((s) => s.level === 'High').length;
  const hasMultipleHighRisks = highRiskCount >= 2;
  const multiplier = hasMultipleHighRisks ? 1.3 : 1.0;

  // === GENERATE EXPLANATION ===
  let explanation = `Identified ${signals.length} risk signal${signals.length !== 1 ? 's' : ''}.`;

  if (hasMultipleHighRisks) {
    explanation += ` Multiple high-risk factors detected (${highRiskCount}), applying ${multiplier}x complexity multiplier for cumulative risk.`;
  } else if (highRiskCount === 1) {
    explanation += ' One high-risk factor identified requiring specialized resources.';
  } else {
    explanation += ' Risk profile is manageable with standard production protocols.';
  }

  return {
    signals,
    multiplier,
    safetyReasoning: explanation,
  };
}
