import { GoogleGenerativeAI } from '@google/generative-ai';

// ===========================
// EVIDENCE-GROUNDED CONSTRAINT ANALYSIS
// ===========================
// This module uses Gemini to analyze constraints with STRICT evidence grounding.
// Gemini must return verbatim quotes from the scene text as evidence.
// No assumptions, no hallucinations, no boilerplate.

export interface EvidenceGroundedConstraint {
  level: 'Low' | 'Medium' | 'High';
  reasoning: string;
  evidence: string[]; // Verbatim quotes from scene text
}

export interface EvidenceGroundedAnalysis {
  budget: EvidenceGroundedConstraint;
  logistics: EvidenceGroundedConstraint;
  safety: EvidenceGroundedConstraint;
  technical: EvidenceGroundedConstraint;
}

// Strict Gemini prompt to prevent hallucinations
const EVIDENCE_GROUNDED_PROMPT = `You are a film production feasibility analyst.
Analyze the scene ONLY using explicit or strongly implied elements.

STRICT RULES:
- Evidence quotes must be copied VERBATIM from the scene text
- If no evidence exists for a constraint, it must be Low
- Do NOT assume vehicles, crowds, permits, stunts, or equipment unless explicitly mentioned
- Do NOT use generic film production boilerplate language
- Do NOT infer elements that are not in the scene

For EACH constraint (Budget, Logistics, Safety, Technical):
1. Determine level: Low / Medium / High
2. Provide clear reasoning based ONLY on scene content
3. Extract evidence quotes EXACTLY as written in the scene

Budget Constraint:
- High: Scene explicitly requires expensive elements (VFX, stunts, large crowd, specialized equipment)
- Medium: Scene mentions moderate resource needs
- Low: Simple scene with standard filming needs or no explicit requirements

Logistics Constraint:
- High: Scene explicitly mentions remote/complex location, large crowd, multiple vehicles, permits
- Medium: Scene mentions moderate coordination needs
- Low: Simple location or no explicit logistical challenges

Safety Constraint:
- High: Scene explicitly includes dangerous stunts, fire, weapons, vehicles, heights
- Medium: Scene mentions moderate safety considerations
- Low: Standard safety protocols or no explicit hazards

Technical Constraint:
- High: Scene explicitly requires complex VFX, special equipment, difficult cinematography
- Medium: Scene mentions moderate technical needs
- Low: Standard filming techniques or no explicit technical challenges

Return STRICT JSON ONLY in this format:
{
  "budget": {
    "level": "Low|Medium|High",
    "reasoning": "explanation based on scene content",
    "evidence": ["exact quote 1", "exact quote 2"]
  },
  "logistics": {
    "level": "Low|Medium|High",
    "reasoning": "explanation",
    "evidence": ["exact quote"]
  },
  "safety": {
    "level": "Low|Medium|High",
    "reasoning": "explanation",
    "evidence": ["exact quote"]
  },
  "technical": {
    "level": "Low|Medium|High",
    "reasoning": "explanation",
    "evidence": ["exact quote"]
  }
}

If a constraint has no explicit evidence, return:
{
  "level": "Low",
  "reasoning": "No explicit evidence in scene text",
  "evidence": []
}`;

/**
 * Analyzes constraints with strict evidence grounding using Gemini
 * @param sceneText - The full scene description text
 * @returns Evidence-grounded constraint analysis
 */
export async function analyzeEvidenceGroundedConstraints(
  sceneText: string
): Promise<EvidenceGroundedAnalysis> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `${EVIDENCE_GROUNDED_PROMPT}

Scene Text:
"""
${sceneText}
"""

Analyze the constraints with strict evidence grounding:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as EvidenceGroundedAnalysis;

    // Validate structure
    if (!analysis.budget || !analysis.logistics || !analysis.safety || !analysis.technical) {
      throw new Error('Incomplete constraint analysis from Gemini');
    }

    return analysis;
  } catch (error) {
    console.error('Error in evidence-grounded constraint analysis:', error);
    
    // Fallback to all Low constraints with no evidence
    return {
      budget: {
        level: 'Low',
        reasoning: 'Analysis failed - defaulting to Low',
        evidence: [],
      },
      logistics: {
        level: 'Low',
        reasoning: 'Analysis failed - defaulting to Low',
        evidence: [],
      },
      safety: {
        level: 'Low',
        reasoning: 'Analysis failed - defaulting to Low',
        evidence: [],
      },
      technical: {
        level: 'Low',
        reasoning: 'Analysis failed - defaulting to Low',
        evidence: [],
      },
    };
  }
}

/**
 * Validates that evidence quotes actually exist in the scene text
 * If evidence is fabricated, downgrades constraint to Low
 * @param analysis - The Gemini-generated analysis
 * @param sceneText - The original scene text
 * @returns Validated and potentially downgraded analysis
 */
export function validateConstraintEvidence(
  analysis: EvidenceGroundedAnalysis,
  sceneText: string
): EvidenceGroundedAnalysis {
  const validated: EvidenceGroundedAnalysis = {
    budget: validateConstraint(analysis.budget, sceneText, 'budget'),
    logistics: validateConstraint(analysis.logistics, sceneText, 'logistics'),
    safety: validateConstraint(analysis.safety, sceneText, 'safety'),
    technical: validateConstraint(analysis.technical, sceneText, 'technical'),
  };

  return validated;
}

/**
 * Validates a single constraint's evidence
 */
function validateConstraint(
  constraint: EvidenceGroundedConstraint,
  sceneText: string,
  constraintName: string
): EvidenceGroundedConstraint {
  // Check if all evidence quotes exist in scene text
  const validEvidence: string[] = [];
  const fabricatedEvidence: string[] = [];

  for (const quote of constraint.evidence) {
    // Check if quote exists in scene text (case-insensitive, allowing for minor whitespace differences)
    const normalizedScene = sceneText.toLowerCase().replace(/\s+/g, ' ');
    const normalizedQuote = quote.toLowerCase().replace(/\s+/g, ' ');
    
    if (normalizedScene.includes(normalizedQuote)) {
      validEvidence.push(quote);
    } else {
      fabricatedEvidence.push(quote);
      console.warn(`Fabricated evidence detected in ${constraintName}:`, quote);
    }
  }

  // If any evidence is fabricated, downgrade to Low
  if (fabricatedEvidence.length > 0) {
    return {
      level: 'Low',
      reasoning: `Insufficient explicit evidence in scene text. Some claimed evidence was not found verbatim.`,
      evidence: validEvidence, // Only keep valid evidence
    };
  }

  // If no evidence provided but constraint is not Low, downgrade
  if (constraint.evidence.length === 0 && constraint.level !== 'Low') {
    return {
      level: 'Low',
      reasoning: 'No explicit evidence provided in scene text',
      evidence: [],
    };
  }

  // Evidence is valid
  return constraint;
}

/**
 * Creates an evidence map for storage
 */
export function createEvidenceMap(analysis: EvidenceGroundedAnalysis): Record<string, string[]> {
  return {
    budget: analysis.budget.evidence,
    logistics: analysis.logistics.evidence,
    safety: analysis.safety.evidence,
    technical: analysis.technical.evidence,
  };
}
