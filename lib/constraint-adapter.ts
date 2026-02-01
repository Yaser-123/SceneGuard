/**
 * Adapter to convert new RiskAssessment[] format to old EvidenceGroundedConstraint format
 * This maintains backward compatibility with existing UI components
 */

import { RiskAssessment, RiskLevel } from './llm-risk-assessor';

export interface EvidenceGroundedConstraint {
  level: 'Low' | 'Medium' | 'High';
  reasoning: string;
  evidence: string[]; // For new system, this will be triggeredBy facts
  score?: number; // Optional compatibility
}

export interface EvidenceGroundedAnalysis {
  budget: EvidenceGroundedConstraint;
  logistics: EvidenceGroundedConstraint;
  safety: EvidenceGroundedConstraint;
  technical: EvidenceGroundedConstraint;
}

/**
 * Converts RiskAssessment[] to legacy constraint format for UI compatibility
 */
export function convertRiskSignalsToConstraints(
  risks: RiskAssessment[],
  categoryRiskLevels: {
    budget: RiskLevel;
    logistics: RiskLevel;
    safety: RiskLevel;
    technical: RiskLevel;
  }
): EvidenceGroundedAnalysis {
  // Group risks by category
  const budgetRisks = risks.filter(s => s.category === 'Budget');
  const logisticsRisks = risks.filter(s => s.category === 'Logistics');
  const safetyRisks = risks.filter(s => s.category === 'Safety');
  const technicalRisks = risks.filter(s => s.category === 'Technical');

  // Helper to create constraint from risk assessments
  const createConstraint = (
    categoryRisks: RiskAssessment[],
    level: RiskLevel
  ): EvidenceGroundedConstraint => {
    if (categoryRisks.length === 0) {
      return {
        level: 'Low',
        reasoning: 'No significant risk factors identified',
        evidence: [],
        score: 25,
      };
    }

    // Use the first (or primary) risk's reasoning
    const primaryRisk = categoryRisks[0];
    const reasoning = primaryRisk.reasoning;

    // Collect mitigation steps as evidence of risk factors
    const evidence = categoryRisks.flatMap(r => r.mitigationSteps || []);

    // Calculate score based on level
    const scoreMap = { Low: 25, Medium: 60, High: 85 };

    return {
      level,
      reasoning,
      evidence: evidence.slice(0, 3), // Limit to 3
      score: scoreMap[level],
    };
  };

  return {
    budget: createConstraint(budgetRisks, categoryRiskLevels.budget),
    logistics: createConstraint(logisticsRisks, categoryRiskLevels.logistics),
    safety: createConstraint(safetyRisks, categoryRiskLevels.safety),
    technical: createConstraint(technicalRisks, categoryRiskLevels.technical),
  };
}
